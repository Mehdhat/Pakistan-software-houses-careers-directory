import React, { useState, useRef } from "react";
import { 
  Upload, 
  FileText, 
  Sparkles, 
  Trash2, 
  AlertCircle, 
  CheckCircle2, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Tag, 
  Compass,
  ArrowRight
} from "lucide-react";
import { CVAnalysisResult } from "../types";

interface CVMatcherProps {
  onAnalysisSuccess: (result: CVAnalysisResult) => void;
  onClearAnalysis: () => void;
  analysisResult: CVAnalysisResult | null;
}

export default function CVMatcher({
  onAnalysisSuccess,
  onClearAnalysis,
  analysisResult,
}: CVMatcherProps) {
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [pastedText, setPastedText] = useState("");
  const [usePastedText, setUsePastedText] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const loadingSteps = [
    "Uploading data securely to application portal...",
    "Invoking Gemini to extract programming credentials...",
    "Synthesizing tech profile & checking Pakistan hubs...",
    "Matching credentials with 12+ corporate databases...",
    "Composing hyper-targeted HR direct cover letters...",
    "Assembling match reports..."
  ];

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      validateAndSetFile(droppedFile);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const validateAndSetFile = (selectedFile: File) => {
    const validTypes = ["application/pdf", "text/plain", "text/markdown"];
    if (!validTypes.includes(selectedFile.type) && !selectedFile.name.endsWith(".txt") && !selectedFile.name.endsWith(".pdf") && !selectedFile.name.endsWith(".md")) {
      setError("Unsupported file format. Please upload a PDF (.pdf) or Plain Text (.txt, .md) file.");
      return;
    }
    setError(null);
    setFile(selectedFile);
    setUsePastedText(false);
  };

  const handleRemoveFile = () => {
    setFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const triggerSearch = async () => {
    if (!file && !pastedText.trim()) {
      setError("Please either drag & drop a resume file or paste your CV details in the text area.");
      return;
    }

    setLoading(true);
    setLoadingStep(0);
    setError(null);

    // Incremental loading stepper
    const stepInterval = setInterval(() => {
      setLoadingStep((prev) => {
        if (prev < loadingSteps.length - 1) {
          return prev + 1;
        }
        return prev;
      });
    }, 2800);

    try {
      let requestBody: any = {};

      if (usePastedText || !file) {
        requestBody.cvText = pastedText;
      } else {
        // Handle file conversion to base64 for PDF or direct reading for text
        if (file.type === "application/pdf" || file.name.endsWith(".pdf")) {
          const base64Data = await convertFileToBase64(file);
          requestBody.fileBase64 = base64Data;
          requestBody.mimeType = "application/pdf";
        } else {
          // Plain text file read
          const textContent = await readFileAsText(file);
          requestBody.cvText = textContent;
        }
      }

      const response = await fetch("/api/match-cv", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to process CV report");
      }

      const reportData: CVAnalysisResult = await response.json();
      onAnalysisSuccess(reportData);
    } catch (err: any) {
      console.error(err);
      setError(err?.message || "An error occurred during CV matching. Please try again with copy-pasting your text directly.");
    } finally {
      clearInterval(stepInterval);
      setLoading(false);
    }
  };

  const convertFileToBase64 = (f: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(f);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  const readFileAsText = (f: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsText(f);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  const scrollToCard = (id: string) => {
    const el = document.getElementById(`house-card-${id}`);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
      el.classList.add("ring-8", "ring-emerald-500/20");
      setTimeout(() => {
        el.classList.remove("ring-8", "ring-emerald-500/20");
      }, 2000);
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-xs max-w-7xl mx-auto overflow-hidden mb-10">
      
      {/* Dynamic Header */}
      <div className="bg-gradient-to-r from-emerald-900 to-brand-green p-6 sm:p-8 text-white">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-emerald-800 rounded-md text-xs font-semibold text-emerald-200 mb-2">
              <Sparkles className="w-3 h-3 text-emerald-300" />
              Gemini Powered
            </div>
            <h2 className="text-2xl font-bold tracking-tight">AI Resume & CV Matching Engine</h2>
            <p className="text-emerald-100/70 text-sm mt-1 max-w-xl font-light">
              Don't guess where you fit. Upload your resume or paste CV text. Our matching engine parses your stack and maps you to matching positions.
            </p>
          </div>

          {analysisResult && (
            <button
              onClick={onClearAnalysis}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white border border-white/20 text-xs font-semibold rounded-xl transition-all cursor-pointer select-none"
            >
              Clear Analysis
            </button>
          )}
        </div>
      </div>

      <div className="p-6 sm:p-8">
        {!analysisResult ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left selector: File Upload & Input */}
            <div className="lg:col-span-7 space-y-5">
              
              {/* Selector Tabs */}
              <div className="flex border-b border-slate-100 pb-px">
                <button
                  onClick={() => setUsePastedText(false)}
                  className={`pb-3 text-sm font-semibold transition-all relative px-2 cursor-pointer ${
                    !usePastedText 
                      ? "text-brand-green border-b-2 border-brand-green" 
                      : "text-slate-400 hover:text-slate-600"
                  }`}
                >
                  Match via Document Upload (.pdf, .txt)
                </button>
                <button
                  onClick={() => setUsePastedText(true)}
                  className={`pb-3 text-sm font-semibold transition-all relative px-2 ml-6 cursor-pointer ${
                    usePastedText 
                      ? "text-brand-green border-b-2 border-brand-green" 
                      : "text-slate-400 hover:text-slate-600"
                  }`}
                >
                  Match via Pasted Copy
                </button>
              </div>

              {!usePastedText ? (
                /* Drag & Drop zone */
                <div
                  onDragEnter={handleDrag}
                  onDragOver={handleDrag}
                  onDragLeave={handleDrag}
                  onDrop={handleDrop}
                  className={`relative p-8 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center text-center transition-all min-h-64 ${
                    dragActive 
                      ? "border-emerald-500 bg-emerald-50/20" 
                      : file 
                        ? "border-slate-300 bg-slate-50/50" 
                        : "border-slate-200 hover:border-slate-300 hover:bg-slate-50/30"
                  }`}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    onChange={handleFileChange}
                    accept=".pdf,.txt,.md"
                    className="hidden"
                  />

                  {file ? (
                    <div className="space-y-4">
                      <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-2xl inline-flex items-center justify-center">
                        <FileText className="w-10 h-10 text-emerald-600" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-slate-800 line-clamp-1">{file.name}</h4>
                        <p className="text-xs text-slate-500 mt-1 font-mono">
                          {(file.size / 1024 / 1024).toFixed(2)} MB • {file.name.substring(file.name.lastIndexOf(".") + 1).toUpperCase()} File
                        </p>
                      </div>
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => fileInputRef.current?.click()}
                          className="px-3.5 py-1.5 bg-white border border-slate-200 hover:border-slate-300 text-slate-600 text-xs font-semibold rounded-lg transition-all cursor-pointer"
                        >
                          Change File
                        </button>
                        <button
                          onClick={handleRemoveFile}
                          className="p-1.5 bg-red-50 hover:bg-red-100 border border-red-100 text-red-600 rounded-lg transition-all"
                          title="Remove File"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="p-4 bg-slate-50 rounded-2xl inline-flex items-center justify-center border border-slate-100">
                        <Upload className="w-8 h-8 text-slate-400" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-700">
                          Drag and drop your visual CV or Resume here
                        </p>
                        <p className="text-xs text-slate-400 mt-1.5 max-w-xs mx-auto leading-normal">
                          Supports high fidelity resumes in <b className="text-slate-500">PDF</b> format, alongside standard files formatted in <b className="text-slate-500">TXT</b> or <b className="text-slate-500">MD</b>.
                        </p>
                      </div>
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="px-5 py-2 bg-slate-900 text-white hover:bg-slate-800 text-xs font-bold rounded-xl transition-all cursor-pointer"
                      >
                        Choose File from Local
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                /* Paste textarea */
                <div className="space-y-2">
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Copy and Paste CV Transcript
                  </label>
                  <textarea
                    value={pastedText}
                    onChange={(e) => setPastedText(e.target.value)}
                    placeholder="Paste details of your resume (Education, Skills, Work Experience, Coding Stacks)..."
                    rows={8}
                    className="w-full p-4 bg-slate-50 border border-slate-200 focus:border-brand-green focus:bg-white focus:outline-none rounded-2xl text-sm transition-all text-slate-800 font-light"
                  />
                  <p className="text-slate-400 text-[10px] leading-relaxed">
                    💡 Ideal for quick parsing when you do not have the visual PDF document on the current device.
                  </p>
                </div>
              )}

              {/* Error Callout */}
              {error && (
                <div className="p-4 bg-red-50 border border-red-100 rounded-2xl flex items-start gap-2 text-xs text-red-700 leading-relaxed font-light">
                  <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold">Matching error:</span> {error}
                  </div>
                </div>
              )}

              {/* Action execute button wrapper */}
              <div className="flex justify-end">
                <button
                  onClick={triggerSearch}
                  disabled={loading}
                  className={`px-6 py-3 bg-brand-green hover:bg-emerald-800 disabled:opacity-50 text-white rounded-2xl font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer`}
                >
                  <Sparkles className="w-4.5 h-4.5 fill-current" />
                  Analyze CV & Discover Fits
                </button>
              </div>

            </div>

            {/* Right: Quick Instructions board */}
            <div className="lg:col-span-5 bg-slate-50 rounded-2xl border border-slate-200/50 p-6 space-y-5">
              <h3 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                <Compass className="w-4.5 h-4.5 text-brand-green" />
                How the Matching Engine Works
              </h3>

              <div className="space-y-4">
                <div className="flex gap-3">
                  <div className="w-6 h-6 rounded-full bg-slate-200 text-slate-800 text-xs font-bold flex items-center justify-center shrink-0">1</div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-700">Dynamic Base64 Streaming</h4>
                    <p className="text-[11px] text-slate-500 leading-normal mt-0.5 font-light">Your PDF/TXT profile is converted to Base64 stream and processed directly in a secure server-side pipeline.</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="w-6 h-6 rounded-full bg-slate-200 text-slate-800 text-xs font-bold flex items-center justify-center shrink-0">2</div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-700">Multi-Modal Parsing via Gemini</h4>
                    <p className="text-[11px] text-slate-500 leading-normal mt-0.5 font-light">The Gemini 3.5 Flash model parses the structured contents, extracting programming languages, frameworks, location parameters, and experience.</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="w-6 h-6 rounded-full bg-slate-200 text-slate-800 text-xs font-bold flex items-center justify-center shrink-0">3</div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-700">Strategic Alignment Formula</h4>
                    <p className="text-[11px] text-slate-500 leading-normal mt-0.5 font-light">Outputs weighted score matches for each company. Generates pre-written, highly persuasive Cover Letter applications tailored specifically to matching hiring portals.</p>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-200">
                <div className="p-3.5 bg-emerald-50 border border-emerald-100 rounded-xl text-[11px] text-slate-700 leading-relaxed font-light">
                  🔒 <b>Strict Data Privacy Principle:</b> Resumes uploaded here are processed purely in ephemeral server memory and streamed to Gemini. No databases retain your personal document long-term.
                </div>
              </div>
            </div>

          </div>
        ) : (
          /* Analysis Report visualization panel */
          <div className="bg-slate-50/50 rounded-2xl border border-slate-200/80 p-5 sm:p-7 space-y-6">
            
            {/* Direct candidate info overview bar */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start pb-6 border-b border-slate-200/60">
              <div className="md:col-span-4 space-y-3.5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-brand-green text-white flex items-center justify-center shrink-0 shadow-sm">
                    <User className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Candidate Profile</div>
                    <div className="text-lg font-bold text-slate-800 truncate leading-tight">
                      {analysisResult.candidateName || "Extracted Candidate"}
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5 pl-1.5 text-xs text-slate-600">
                  {analysisResult.candidateEmail && (
                    <div className="flex items-center gap-2 truncate">
                      <Mail className="w-3.5 h-3.5 text-slate-400" />
                      <span className="font-mono">{analysisResult.candidateEmail}</span>
                    </div>
                  )}
                  {analysisResult.candidatePhone && (
                    <div className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-slate-400" />
                      <span className="font-mono">{analysisResult.candidatePhone}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 animate-pulse text-emerald-600" />
                    <span>Inferred Hub: <b className="text-slate-800 font-semibold">{analysisResult.preferredLocation || "Pakistan (Fleixble)"}</b></span>
                  </div>
                </div>
              </div>

              {/* Center overall synthetic report */}
              <div className="md:col-span-8 bg-white border border-slate-200/70 rounded-2xl p-5 shadow-xs">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Compass className="w-4 h-4 text-emerald-600" />
                  Recruiter's Synthetic Synopsis
                </h3>
                <p className="text-sm text-slate-700 leading-relaxed font-light mb-4">
                  {analysisResult.overallSummary}
                </p>

                {/* Sub: Suggested Roles & Target channels */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest shrink-0">Identified fits:</span>
                  <div className="flex flex-wrap gap-1">
                    {analysisResult.suggestedRoles.map((role) => (
                      <span key={role} className="text-[11px] bg-brand-green/10 text-brand-green px-2.5 py-0.5 rounded-md font-semibold font-mono">
                        {role}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Extracted programming language / skill sets tag line */}
            <div>
              <div className="flex items-center gap-1 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
                <Tag className="w-3.5 h-3.5 text-brand-green" />
                Detected Skill tags
              </div>
              <div className="flex flex-wrap gap-1.5">
                {analysisResult.detectedSkills.map((sk) => (
                  <span key={sk} className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1 rounded-xl font-medium border border-slate-200/20">
                    {sk}
                  </span>
                ))}
              </div>
            </div>

            {/* Visual ranking of software houses based on matches */}
            <div className="space-y-3 mt-4 pt-4 border-t border-slate-200/60">
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
                Identified Placement matches (Click to anchor & view full application portal)
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {analysisResult.matches
                  .filter((m) => m.ratingScore > 40) // only showcase relevant scores
                  .sort((a, b) => b.ratingScore - a.ratingScore)
                  .map((matchReport) => {
                    return (
                      <button
                        key={matchReport.softwareHouseId}
                        onClick={() => scrollToCard(matchReport.softwareHouseId)}
                        className="p-3.5 bg-white border border-slate-200 hover:border-emerald-500 hover:shadow-xs rounded-xl flex items-center justify-between text-left transition-all group cursor-pointer"
                      >
                        <div className="truncate pr-2">
                          <h4 className="text-xs font-bold text-slate-800 truncate group-hover:text-emerald-700">
                            {matchReport.softwareHouseId.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ")}
                          </h4>
                          <span className="text-[10px] text-slate-400 font-light mt-0.5 block">
                            Score matches: {matchReport.ratingScore}%
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className={`w-8 h-8 rounded-lg text-xs font-bold flex items-center justify-center shrink-0 border ${
                            matchReport.ratingScore >= 80 
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200" 
                              : "bg-teal-50 text-teal-700 border-teal-200"
                          }`}>
                            {matchReport.ratingScore}
                          </span>
                          <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-500 group-hover:translate-x-0.5 transition-all shrink-0" />
                        </div>
                      </button>
                    );
                  })}
              </div>
            </div>

          </div>
        )}
      </div>

      {/* Embedded dynamic loading overlay screens for reassured waiting state */}
      {loading && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-6">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full border border-slate-100 shadow-2xl space-y-6 text-center animate-fade-in">
            <div className="relative w-16 h-16 mx-auto">
              <span className="absolute inset-0 rounded-full border-4 border-emerald-100" />
              <span className="absolute inset-0 rounded-full border-4 border-solid border-emerald-600 border-t-transparent animate-spin" />
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-bold text-slate-900">Calculating Placement Matches</h3>
              <p className="text-xs text-slate-500 max-w-xs mx-auto leading-normal">
                Please wait while Gemini analyzes the formatted sections of your resume. This can take up to 10 seconds.
              </p>
            </div>

            {/* Safe visual step updates */}
            <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-2xl flex items-center justify-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-600 animate-pulse shrink-0" />
              <span className="text-xs font-medium text-emerald-800 animate-pulse leading-none truncate">
                {loadingSteps[loadingStep]}
              </span>
            </div>

            {/* Stepper Progress bar */}
            <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
              <div 
                className="bg-brand-green h-full transition-all duration-1000" 
                style={{ width: `${((loadingStep + 1) / loadingSteps.length) * 100}%` }}
              />
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
