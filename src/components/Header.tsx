import { Building2, Mail, BadgeCheck, Compass } from "lucide-react";

export default function Header({ totalHouses }: { totalHouses: number }) {
  return (
    <header className="relative overflow-hidden bg-brand-green-dark text-white py-10 px-6 sm:px-12 md:py-14 rounded-3xl shadow-xl border border-emerald-900/40 mb-10">
      {/* Decorative background vectors */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-600/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-700/15 rounded-full blur-3xl -ml-20 -mb-20 pointer-events-none" />

      <div className="relative z-10 max-w-5xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 border border-white/20 rounded-full text-xs font-medium text-emerald-300 mb-4 backdrop-blur-md">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          Pakistan Tech Directory
        </div>

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight leading-tight">
          Pakistan Software Houses <br />
          <span className="text-emerald-300">Careers Directory</span>
        </h1>

        <p className="mt-4 text-base sm:text-lg text-emerald-100/80 max-w-3xl font-light">
          Skip generic job board clutter. Browse Pakistan's leading software creators directly, access their proprietary portals, download direct application forms, and find HR contact emails. Upload your CV below to match your tech stack and generate optimized letters.
        </p>

        {/* Info Metric Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 pt-6 border-t border-white/10">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-white/10 rounded-xl">
              <Building2 className="w-5 h-5 text-emerald-300" />
            </div>
            <div>
              <div className="text-xl font-bold font-mono">{totalHouses}</div>
              <div className="text-xs text-emerald-200/60">Curated Entities</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-white/10 rounded-xl">
              <BadgeCheck className="w-5 h-5 text-emerald-300" />
            </div>
            <div>
              <div className="text-xl font-bold font-mono">100%</div>
              <div className="text-xs text-emerald-200/60">Verified Portals</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-white/10 rounded-xl">
              <Mail className="w-5 h-5 text-emerald-300" />
            </div>
            <div>
              <div className="text-sm font-bold truncate">Direct HR Inbox</div>
              <div className="text-xs text-emerald-200/60">No Middlemen</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-white/10 rounded-xl">
              <Compass className="w-5 h-5 text-emerald-300" />
            </div>
            <div>
              <div className="text-sm font-bold">AI Skill Matching</div>
              <div className="text-xs text-emerald-200/60">Instant CV Audit</div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
