import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";
import { SOFTWARE_HOUSES } from "./src/data/softwareHouses";

dotenv.config();

const app = express();
const PORT = 3000;

// Set up JSON body parser with comfortable boundaries for base64 PDF uploads
app.use(express.json({ limit: "15mb" }));
app.use(express.urlencoded({ limit: "15mb", extended: true }));

// Retrieve server-side Gemini client
const apiKey = process.env.GEMINI_API_KEY;

// Log key state (non-secret state only)
console.log("Gemini API key available:", !!apiKey);

const getAiClient = () => {
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY environment variable is missing. Please add it in Settings > Secrets.");
  }
  return new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
};

// API Endpoint: Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", softwareHousesCount: SOFTWARE_HOUSES.length });
});

// API Endpoint: Match CV
app.post("/api/match-cv", async (req, res) => {
  try {
    const { cvText, fileBase64, mimeType } = req.body;

    if (!cvText && !fileBase64) {
      return res.status(400).json({ error: "No CV content provided (text or file attachment)." });
    }

    const ai = getAiClient();

    // Prepare content parts for Gemini
    const contentParts: any[] = [];

    if (fileBase64 && mimeType) {
      // Clean base64 encoding if prefix is included by client FileReader
      const base64Data = fileBase64.replace(/^data:.*,/, "");
      contentParts.push({
        inlineData: {
          mimeType: mimeType,
          data: base64Data,
        },
      });
    }

    if (cvText) {
      contentParts.push({
        text: `Here is the copy-pasted CV text of the candidate:\n\n${cvText}`,
      });
    }

    const systemPrompt = `
You are an expert technical recruiter and resume analyzer specializing in the Pakistan software industry.
Your task is to analyze the candidate's CV (which can be a PDF document or a plain text transcript), detect their contact information, skills, preferred location, and match them against these curated software houses in Pakistan:

${JSON.stringify(SOFTWARE_HOUSES, null, 2)}

Instructions for Matching:
1. Extract candidate's summary, name, email, phone, skills, experience level, and preferred city in Pakistan (e.g. Lahore, Karachi, Islamabad, or Remote).
2. For each of the software houses provided in the JSON, perform a matching logical assessment:
   - Match Score: 0 to 100 based on core skills, tech stacks used at the company, location options, and commonly hired roles.
   - Matched Roles: Which commonly hired roles at that company match the candidate's background.
   - Matched Locations: Which locations of that company match the candidate's inferred preferred location or location flexibility.
   - Direct Email Cover Letter: Write a customized, tailored, high-converting email cover letter to be sent directly to that company's HR email. Use the candidate name and details as the sender, and format it with a professional subject line. The content should explicitly highlight why customer is a fit for that specific company's specialties and products (e.g. NFS Ascent at NetSol, Python EdTech dev at Arbisoft, .NET at Contour, client startups dev at Devsinc). Keep it highly authentic, concise, and professional.
3. Sort matches, but output all Software Houses listed above in the 'matches' array so the user knows eligibility for every company!
4. Return a structured JSON matching the provided schema.
`;

    contentParts.push({
      text: "Analyze this CV, match, and return the structured report now.",
    });

    console.log("Sending match request to Gemini API...");

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: contentParts,
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          required: [
            "candidateName",
            "candidateEmail",
            "candidatePhone",
            "detectedSkills",
            "preferredLocation",
            "suggestedRoles",
            "matches",
            "overallSummary",
          ],
          properties: {
            candidateName: {
              type: Type.STRING,
              description: "The extracted candidate full name. Default to 'Candidate' if undetected.",
            },
            candidateEmail: {
              type: Type.STRING,
              description: "Extracted candidate email address. Default to '' if undetected.",
            },
            candidatePhone: {
              type: Type.STRING,
              description: "Extracted candidate phone number. Default to '' if undetected.",
            },
            detectedSkills: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "List of the core programming languages, frameworks, or methodologies detected.",
            },
            preferredLocation: {
              type: Type.STRING,
              description: "Derived candidate city/state in Pakistan, e.g. Lahore, Karachi, Islamabad, Remote.",
            },
            suggestedRoles: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Roles the candidate is highly suitable for based on their CV.",
            },
            overallSummary: {
              type: Type.STRING,
              description: "A summary sentence synthesizing the candidate's career level, main strengths, and ideal target companies.",
            },
            matches: {
              type: Type.ARRAY,
              description: "Matching evaluations for each of the 12 software houses.",
              items: {
                type: Type.OBJECT,
                required: [
                  "softwareHouseId",
                  "ratingScore",
                  "reasoning",
                  "matchedRoles",
                  "matchedLocations",
                  "tailoredSubject",
                  "tailoredCoverLetter",
                ],
                properties: {
                  softwareHouseId: {
                    type: Type.STRING,
                    description: "The unique ID of the software house from the database.",
                  },
                  ratingScore: {
                    type: Type.INTEGER,
                    description: "Match score percentage (0-100) based on alignment.",
                  },
                  reasoning: {
                    type: Type.STRING,
                    description: "Short, highly descriptive paragraph describing exactly why they did/didn't match (e.g., Tech stack matches Python Django stack, or missing required 10Pearls design experience).",
                  },
                  matchedRoles: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                    description: "The specific commonly hired roles that align with candidate skills.",
                  },
                  matchedLocations: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                    description: "Overlapping location facilities, e.g. Lahore, Islamabad etc.",
                  },
                  tailoredSubject: {
                    type: Type.STRING,
                    description: "A professional email subject line for the HR application.",
                  },
                  tailoredCoverLetter: {
                    type: Type.STRING,
                    description: "High quality custom parsed cover letter focused on the company specialties.",
                  },
                },
              },
            },
          },
        },
      },
    });

    const reportText = response.text;
    console.log("Raw Response received successfully!");

    if (!reportText) {
      throw new Error("Empty response returned from Gemini API.");
    }

    const parsedReport = JSON.parse(reportText.trim());
    return res.json(parsedReport);
  } catch (error: any) {
    console.error("Error analyzing CV via Gemini:", error);
    return res.status(500).json({
      error: "CV Analysis failed",
      message: error.message || error,
    });
  }
});

// Configure Vite or Static Assets based on Environment
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    // Development Environment
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
    console.log("Vite development middleware mounted successfully.");
  } else {
    // Production Environment
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
    console.log("Production static files mounted from:", distPath);
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Express custom server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
