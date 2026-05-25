import React, { useState } from "react";
import { 
  ExternalLink, 
  Mail, 
  MapPin, 
  Calendar, 
  Copy, 
  Check, 
  Briefcase, 
  ChevronRight, 
  FileText, 
  Send,
  Zap
} from "lucide-react";
import { SoftwareHouse, MatchResult } from "../types";

interface CompanyCardProps {
  key?: string;
  company: SoftwareHouse;
  match?: MatchResult; // Optional Gemini CV match report
  onOpenDraft: (company: SoftwareHouse, customLetter?: MatchResult) => void;
}

export default function CompanyCard({ company, match, onOpenDraft }: CompanyCardProps) {
  const [copiedEmail, setCopiedEmail] = useState(false);

  const handleCopyEmail = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(company.hrEmail);
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 2000);
    } catch (err) {
      console.error("Could not copy email", err);
    }
  };

  // Safe color generator for scores
  const getScoreColor = (score: number) => {
    if (score >= 85) return "bg-emerald-50 text-emerald-700 border-emerald-200";
    if (score >= 65) return "bg-teal-50 text-teal-700 border-teal-200";
    if (score >= 45) return "bg-amber-50 text-amber-700 border-amber-200";
    return "bg-slate-50 text-slate-500 border-slate-200";
  };

  return (
    <div 
      id={`house-card-${company.id}`}
      className={`relative bg-white rounded-3xl border transition-all duration-300 hover:shadow-md ${
        match 
          ? "border-emerald-300 ring-2 ring-emerald-400/10 shadow-emerald-50 bg-radial-gradient" 
          : "border-slate-200/70"
      }`}
    >
      {/* Matching Ribbon if matching data available */}
      {match && (
        <div className="absolute -top-3.5 right-6 flex items-center gap-1.5 px-3.5 py-1 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-full text-xs font-bold shadow-sm animate-bounce">
          <Zap className="w-3 h-3 fill-current" />
          <span>{match.ratingScore}% AI Match</span>
        </div>
      )}

      {/* Main Content Area */}
      <div className="p-6">
        <div className="flex justify-between items-start gap-3">
          <div>
            <h3 className="text-xl font-bold text-slate-900 tracking-tight leading-none mb-1.5 flex items-center gap-1.5">
              {company.name}
            </h3>
            
            {/* Website Indicator */}
            <a 
              href={company.website} 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs font-medium text-brand-green hover:underline mb-3"
            >
              visit website
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          <div className="flex gap-1.5">
            {/* Rating Stars (Mock or Defined) */}
            <div className="text-xs bg-amber-50 text-amber-600 border border-amber-200 rounded-lg px-2 py-0.5 font-bold font-mono">
              ★ {company.rating || "4.5"}
            </div>
            
            <div className="text-xs bg-slate-50 text-slate-500 border border-slate-200 rounded-lg px-2 py-0.5 font-mono">
              Est. {company.establishedYear}
            </div>
          </div>
        </div>

        {/* Cities/Locations Badge row */}
        <div className="flex flex-wrap items-center gap-1.5 mt-1.5 mb-4">
          <MapPin className="w-3.5 h-3.5 text-slate-400 stroke-[2.5]" />
          {company.cities.map((city) => (
            <span 
              key={city} 
              className={`text-xs px-2 py-0.5 rounded-md font-medium ${
                city === "Remote" 
                  ? "bg-sky-50 text-sky-700 border border-sky-100" 
                  : "bg-slate-100/80 text-slate-600"
              }`}
            >
              {city}
            </span>
          ))}
        </div>

        {/* Corporate brief */}
        <p className="text-sm text-slate-600/95 leading-relaxed font-light mb-5">
          {company.description}
        </p>

        {/* AI match metrics reasoning */}
        {match && (
          <div className="mb-5 p-4 bg-emerald-50/50 rounded-2xl border border-emerald-100">
            <h4 className="text-xs font-bold text-emerald-800 uppercase tracking-wider mb-1 flex items-center gap-1">
              <Zap className="w-3 h-3 text-emerald-600" />
              AIS Match Rationale
            </h4>
            <p className="text-xs text-emerald-900/90 leading-relaxed font-light">
              {match.reasoning}
            </p>
            {match.matchedRoles.length > 0 && (
              <div className="flex items-center gap-1.5 mt-2">
                <span className="text-[10px] font-bold text-emerald-700 uppercase">Targeting:</span>
                <div className="flex flex-wrap gap-1">
                  {match.matchedRoles.map((r) => (
                    <span key={r} className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded-sm font-semibold">
                      {r}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Commonly demand skills & commonly hired roles widgets */}
        <div className="space-y-3 pt-3 border-t border-slate-100 mb-5">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1.5">
              Core Tech Stack specialties
            </span>
            <div className="flex flex-wrap gap-1">
              {company.specialties.map((spec) => (
                <span 
                  key={spec} 
                  className="text-xs bg-slate-50 text-slate-700 px-2.5 py-1 rounded-lg border border-slate-200/30"
                >
                  {spec}
                </span>
              ))}
            </div>
          </div>

          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1.5">
              Typical Openings / Core Roles
            </span>
            <div className="flex flex-wrap gap-1">
              {company.commonlyHiredRoles.map((role) => (
                <span 
                  key={role} 
                  className="text-[11px] bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded-md font-medium"
                >
                  {role}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Flagship corporate culture snip */}
        {company.cultureSnippet && (
          <div className="text-xs italic bg-slate-50 text-slate-500 p-3 rounded-xl mb-6 font-light border-l-2 border-slate-300">
            "{company.cultureSnippet}"
          </div>
        )}

        {/* Recruitment / Action Portal buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-4 pt-4 border-t border-slate-100">
          
          {/* Apply channel 1: Home page website link */}
          <a
            href={company.website}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-1.5 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-all"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            Visit Website
          </a>

          {/* Quick Apply letter compiler caller */}
          <button
            onClick={() => onOpenDraft(company, match)}
            className="flex items-center justify-center gap-1.5 px-4 py-2.5 bg-brand-green hover:bg-emerald-800 text-white text-xs font-semibold rounded-xl shadow-xs transition-all cursor-pointer"
          >
            <FileText className="w-3.5 h-3.5" />
            Direct HR Courier
            <ChevronRight className="w-3 h-3" />
          </button>
        </div>

        {/* HR Mail address tray with copy button */}
        <div className="mt-3 flex items-center justify-between p-2.5 bg-slate-50 rounded-xl border border-slate-100">
          <div className="flex items-center gap-2 truncate">
            <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="text-xs text-slate-600 font-mono truncate select-all">
              {company.hrEmail}
            </span>
          </div>
          <button
            onClick={handleCopyEmail}
            className="p-1.5 hover:bg-slate-200 text-slate-400 hover:text-slate-700 rounded-lg transition-all cursor-pointer"
            title="Copy HR Email Address"
          >
            {copiedEmail ? (
              <Check className="w-3.5 h-3.5 text-emerald-600" />
            ) : (
              <Copy className="w-3.5 h-3.5" />
            )}
          </button>
        </div>

      </div>
    </div>
  );
}
