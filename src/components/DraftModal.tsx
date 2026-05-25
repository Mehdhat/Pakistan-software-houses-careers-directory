import { useState, useEffect } from "react";
import { 
  X, 
  Copy, 
  Check, 
  Send, 
  Sparkles, 
  Briefcase, 
  ExternalLink,
  Edit2
} from "lucide-react";
import { SoftwareHouse, MatchResult } from "../types";

interface DraftModalProps {
  company: SoftwareHouse | null;
  matchResult: MatchResult | null;
  onClose: () => void;
}

export default function DraftModal({ company, matchResult, onClose }: DraftModalProps) {
  const [copiedSubject, setCopiedSubject] = useState(false);
  const [copiedBody, setCopiedBody] = useState(false);
  
  // Custom template fields for users who have not uploaded their CV
  const [candidateName, setCandidateName] = useState("");
  const [targetRole, setTargetRole] = useState("");
  const [targetStack, setTargetStack] = useState("");
  const [experienceYears, setExperienceYears] = useState("2");
  const [customizedLetter, setCustomizedLetter] = useState("");
  const [customizedSubject, setCustomizedSubject] = useState("");

  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (!company) return;

    // Set default target role from first commonly hired role if not selected
    const initialRole = company.commonlyHiredRoles[0] || "Software Engineer";
    setTargetRole(initialRole);
    setTargetStack(company.specialties.slice(0, 3).join(", "));
    setCandidateName("Candidate Name");

    if (matchResult) {
      // Use premium Gemini custom cover letter parsed from CV matching index
      setCustomizedSubject(matchResult.tailoredSubject);
      setCustomizedLetter(matchResult.tailoredCoverLetter);
    } else {
      // Build a premium dynamic template if no AI CV uploaded
      regenerateTemplate("Candidate Name", initialRole, company.specialties.slice(0, 3).join(", "), "2");
    }
  }, [company, matchResult]);

  const regenerateTemplate = (name: string, role: string, stack: string, exp: string) => {
    if (!company) return;
    const subject = `Job Application - ${role} - ${name}`;
    const body = `Dear HR & Recruitment Team,

I am writing to express my strong interest in the ${role} position at ${company.name}, as listed on your career portal. 

Having analyzed ${company.name}'s industry reputation for excellence in ${company.specialties[0] || "custom software creation"} and your focus on ${company.cultureSnippet ? "stellar team scaling" : "cutting-edge applications"}, I believe my technical background is an exemplary match. I possess over ${exp} years of core engineering experience specializing in ${stack}.

During my career, I have successfully designed, optimized, and deployed responsive web services and architectures. I pride myself on writing clean, scalable Code and collaborating effectively in high-velocity agile teams.

I have attached my up-to-date resume for your consideration. I would welcome the opportunity to discuss how my skill set aligns with company goals.

Thank you for your time and consideration.

Sincerely,
${name}
Contact: [Insert Phone Number]
Portfolio/GitHub: [Insert Portfolio Link]`;

    setCustomizedSubject(subject);
    setCustomizedLetter(body);
  };

  const handleFieldChange = (field: string, val: string) => {
    let freshName = candidateName;
    let freshRole = targetRole;
    let freshStack = targetStack;
    let freshExp = experienceYears;

    if (field === "name") {
      setCandidateName(val);
      freshName = val;
    } else if (field === "role") {
      setTargetRole(val);
      freshRole = val;
    } else if (field === "stack") {
      setTargetStack(val);
      freshStack = val;
    } else if (field === "exp") {
      setExperienceYears(val);
      freshExp = val;
    }

    if (!matchResult) {
      regenerateTemplate(freshName, freshRole, freshStack, freshExp);
    }
  };

  if (!company) return null;

  // Clipboard copy utilities
  const copyToClipboard = async (text: string, setCopiedState: (s: boolean) => void) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedState(true);
      setTimeout(() => setCopiedState(false), 2000);
    } catch (err) {
      console.error("Copy failed", err);
    }
  };

  // mailto launcher helper
  const handleSendEmail = () => {
    const encodedSubject = encodeURIComponent(customizedSubject);
    const encodedBody = encodeURIComponent(customizedLetter);
    const mailtoUrl = `mailto:${company.hrEmail}?subject=${encodedSubject}&body=${encodedBody}`;
    window.location.href = mailtoUrl;
  };

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-3xl w-full border border-slate-100 shadow-2xl max-h-[90vh] overflow-y-auto flex flex-col justify-between animate-fade-in custom-scrollbar">
        
        {/* Header toolbar */}
        <div>
          <div className="flex justify-between items-start gap-3 border-b border-slate-100 pb-4 mb-5">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-brand-green" />
                <h3 className="text-xl font-bold text-slate-800 leading-none">Apply Direct to {company.name}</h3>
              </div>
              <p className="text-xs text-slate-400 mt-1 font-light">
                Direct Application Dispatcher — targeting HR Inbox: <b className="font-mono text-slate-600">{company.hrEmail}</b>
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 hover:bg-slate-100 text-slate-400 hover:text-slate-700 rounded-xl transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* AI vs Template Banner status bar */}
          {matchResult ? (
            <div className="mb-5 p-3.5 bg-emerald-50 border border-emerald-100/60 rounded-xl flex items-center gap-3 text-xs text-emerald-800 font-light">
              <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
              <div>
                Our <b>Gemini CV Matcher</b> has custom compiled your cover letter to explicitly align your profile with <b>{company.name} Specialties</b>. Live-edit the fields below if customization is desired.
              </div>
            </div>
          ) : (
            <div className="mb-5 p-3.5 bg-slate-50 border border-slate-200/50 rounded-xl space-y-3">
              <h4 className="text-xs font-bold text-slate-600 uppercase tracking-wider flex items-center gap-1">
                <Edit2 className="w-3 h-3 text-brand-green" />
                Live Application Template Builder
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                
                {/* Name */}
                <div>
                  <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Your Name</label>
                  <input
                    type="text"
                    value={candidateName === "Candidate Name" ? "" : candidateName}
                    placeholder="Enter full name"
                    onChange={(e) => handleFieldChange("name", e.target.value)}
                    className="w-full text-xs p-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-brand-green"
                  />
                </div>

                {/* Role dropdown */}
                <div>
                  <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Target Job Role</label>
                  <select
                    value={targetRole}
                    onChange={(e) => handleFieldChange("role", e.target.value)}
                    className="w-full text-xs p-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-brand-green"
                  >
                    {company.commonlyHiredRoles.map((r) => (
                      <option key={r} value={r}>{r}</option>
                    ))}
                    <option value="Associate Software Engineer">Associate Software Engineer</option>
                    <option value="Senior Software Engineer">Senior Software Engineer</option>
                    <option value="Intern Tech Engineer">Intern Tech Engineer</option>
                  </select>
                </div>

                {/* Stacks */}
                <div>
                  <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Your Tech Stack</label>
                  <input
                    type="text"
                    value={targetStack}
                    onChange={(e) => handleFieldChange("stack", e.target.value)}
                    className="w-full text-xs p-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-brand-green"
                  />
                </div>

                {/* Experience */}
                <div>
                  <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Exp Years</label>
                  <select
                    value={experienceYears}
                    onChange={(e) => handleFieldChange("exp", e.target.value)}
                    className="w-full text-xs p-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-brand-green"
                  >
                    <option value="0">0 (Fresh/Grad)</option>
                    <option value="1">1 Year</option>
                    <option value="2">2 Years</option>
                    <option value="3">3 Years</option>
                    <option value="5">5+ Years</option>
                  </select>
                </div>

              </div>
            </div>
          )}

          {/* Letter preview panel */}
          <div className="space-y-4">
            
            {/* Subject preview */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  Email Subject Line
                </span>
                <button
                  onClick={() => copyToClipboard(customizedSubject, setCopiedSubject)}
                  className="inline-flex items-center gap-1.5 text-[11px] text-slate-500 hover:text-slate-800 transition-all cursor-pointer"
                >
                  {copiedSubject ? (
                    <span className="text-emerald-600 flex items-center gap-1 font-bold"><Check className="w-3 h-3" /> Copied</span>
                  ) : (
                    <span className="flex items-center gap-1"><Copy className="w-3 h-3" /> Copy</span>
                  )}
                </button>
              </div>

              <input
                type="text"
                value={customizedSubject}
                onChange={(e) => setCustomizedSubject(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-800 focus:outline-none focus:border-brand-green/30"
              />
            </div>

            {/* Body letter preview */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  Cover Letter Body Text
                </span>
                <button
                  onClick={() => copyToClipboard(customizedLetter, setCopiedBody)}
                  className="inline-flex items-center gap-1.5 text-[11px] text-slate-500 hover:text-slate-800 transition-all cursor-pointer"
                >
                  {copiedBody ? (
                    <span className="text-emerald-600 flex items-center gap-1 font-bold"><Check className="w-3 h-3" /> Copied Letter</span>
                  ) : (
                    <span className="flex items-center gap-1"><Copy className="w-3 h-3" /> Copy Letter</span>
                  )}
                </button>
              </div>

              <textarea
                value={customizedLetter}
                onChange={(e) => setCustomizedLetter(e.target.value)}
                rows={11}
                className="w-full p-4 bg-slate-50/70 border border-slate-200 rounded-2xl text-xs font-light text-slate-800 focus:outline-none focus:border-brand-green/30 leading-relaxed font-mono"
              />
            </div>

          </div>
        </div>

        {/* Modal footer call to action */}
        <div className="mt-8 pt-5 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-3 gap-2">
          
          {/* Dual Action 1: Visit main website home page */}
          <a
            href={company.website}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-1.5 px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-all"
          >
            <ExternalLink className="w-4 h-4" />
            Visit Website
          </a>

          {/* Dual Action 2: Open and prefill candidate mail client */}
          <button
            onClick={handleSendEmail}
            className="sm:col-span-2 flex items-center justify-center gap-2 px-5 py-3 bg-brand-green hover:bg-emerald-800 text-white text-xs font-extrabold rounded-xl shadow-md transition-all cursor-pointer"
          >
            <Send className="w-4 h-4 animate-bounce" />
            Launch Mail Client (Auto pre-fill Application)
          </button>
          
        </div>

      </div>
    </div>
  );
}
