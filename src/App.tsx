import { useState, useMemo } from "react";
import { SOFTWARE_HOUSES } from "./data/softwareHouses";
import { FilterCriteria, CVAnalysisResult, SoftwareHouse, MatchResult } from "./types";
import Header from "./components/Header";
import FilterControls from "./components/FilterControls";
import CompanyCard from "./components/CompanyCard";
import CVMatcher from "./components/CVMatcher";
import DraftModal from "./components/DraftModal";
import { Sparkles, Building2, HelpCircle, ArrowRight } from "lucide-react";

export default function App() {
  const [filters, setFilters] = useState<FilterCriteria>({
    searchQuery: "",
    searchLocation: "",
    roleCategory: "",
    specialtyTag: "",
  });

  const [analysisResult, setAnalysisResult] = useState<CVAnalysisResult | null>(null);
  const [selectedCompany, setSelectedCompany] = useState<SoftwareHouse | null>(null);
  const [selectedMatch, setSelectedMatch] = useState<MatchResult | null>(null);

  // Derive unique cities and specialties dynamically for filters
  const allLocations = useMemo(() => {
    const locations = new Set<string>();
    SOFTWARE_HOUSES.forEach((house) => {
      house.cities.forEach((city) => {
        if (city !== "Remote") locations.add(city);
      });
    });
    return Array.from(locations).sort();
  }, []);

  const allSpecialties = useMemo(() => {
    const specialties = new Set<string>();
    SOFTWARE_HOUSES.forEach((house) => {
      house.specialties.forEach((spec) => specialties.add(spec));
    });
    return Array.from(specialties).sort();
  }, []);

  // Filter Software Houses based on criteria
  const filteredSoftwareHouses = useMemo(() => {
    return SOFTWARE_HOUSES.filter((house) => {
      // 1. Search Query
      if (filters.searchQuery.trim()) {
        const query = filters.searchQuery.toLowerCase();
        const matchesName = house.name.toLowerCase().includes(query);
        const matchesDesc = house.description.toLowerCase().includes(query);
        const matchesSpecialties = house.specialties.some((spec) =>
          spec.toLowerCase().includes(query)
        );
        const matchesRoles = house.commonlyHiredRoles.some((role) =>
          role.toLowerCase().includes(query)
        );
        if (!matchesName && !matchesDesc && !matchesSpecialties && !matchesRoles) {
          return false;
        }
      }

      // 2. City Location Filter
      if (filters.searchLocation) {
        const hasCity = house.cities.includes(filters.searchLocation);
        if (!hasCity) return false;
      }

      // 3. Demanded Role Category Filter
      if (filters.roleCategory) {
        const category = filters.roleCategory.toLowerCase();
        let matchesCategory = false;

        if (category === "frontend") {
          matchesCategory = house.commonlyHiredRoles.some((role) => {
            const r = role.toLowerCase();
            return r.includes("frontend") || r.includes("react") || r.includes("angular") || r.includes("vue") || r.includes("uiux") || r.includes("designer");
          });
        } else if (category === "backend") {
          matchesCategory = house.commonlyHiredRoles.some((role) => {
            const r = role.toLowerCase();
            return r.includes("backend") || r.includes("python") || r.includes("node") || r.includes("java") || r.includes("golang") || r.includes("rails") || r.includes("c#") || r.includes(".net");
          });
        } else if (category === "fullstack") {
          matchesCategory = house.commonlyHiredRoles.some((role) => {
            const r = role.toLowerCase();
            return r.includes("fullstack") || r.includes("mern") || r.includes("ecommerce") || r.includes("netsuite") || r.includes("shopify") || r.includes("developer");
          });
        } else if (category === "mobile") {
          matchesCategory = house.commonlyHiredRoles.some((role) => {
            const r = role.toLowerCase();
            return r.includes("mobile") || r.includes("ios") || r.includes("android") || r.includes("flutter") || r.includes("react native") || r.includes("swift");
          });
        } else if (category === "devops") {
          matchesCategory = house.commonlyHiredRoles.some((role) => {
            const r = role.toLowerCase();
            return r.includes("devops") || r.includes("aws") || r.includes("cloud") || r.includes("sysadmin");
          });
        } else if (category === "ai") {
          matchesCategory = house.commonlyHiredRoles.some((role) => {
            const r = role.toLowerCase();
            return r.includes("ai") || r.includes("machine learning") || r.includes("learning") || r.includes("data") || r.includes("specialist") || r.includes("resident");
          });
        } else if (category === "qa") {
          matchesCategory = house.commonlyHiredRoles.some((role) => {
            const r = role.toLowerCase();
            return r.includes("qa") || r.includes("sqa") || r.includes("testing") || r.includes("quality") || r.includes("automation");
          });
        }

        if (!matchesCategory) return false;
      }

      // 4. Specialty Tag Filter Check
      if (filters.specialtyTag) {
        if (!house.specialties.includes(filters.specialtyTag)) {
          return false;
        }
      }

      return true;
    });
  }, [filters]);

  // Sort filtered houses based on AI match ranking if analysis is ready
  const processedHouses = useMemo(() => {
    if (!analysisResult) return filteredSoftwareHouses;

    const matchMap = new Map<string, number>();
    analysisResult.matches.forEach((m) => {
      matchMap.set(m.softwareHouseId, m.ratingScore);
    });

    return [...filteredSoftwareHouses].sort((a, b) => {
      const scoreA = matchMap.get(a.id) || 0;
      const scoreB = matchMap.get(b.id) || 0;
      return scoreB - scoreA; // highest score first
    });
  }, [filteredSoftwareHouses, analysisResult]);

  const handleAnalysisSuccess = (result: CVAnalysisResult) => {
    setAnalysisResult(result);
  };

  const handleClearAnalysis = () => {
    setAnalysisResult(null);
  };

  const handleOpenDraft = (company: SoftwareHouse, customLetter?: MatchResult) => {
    setSelectedCompany(company);
    setSelectedMatch(customLetter || null);
  };

  const handleCloseDraft = () => {
    setSelectedCompany(null);
    setSelectedMatch(null);
  };

  // Helper dynamic matcher getter
  const getMatchByCompanyId = (id: string): MatchResult | undefined => {
    if (!analysisResult) return undefined;
    return analysisResult.matches.find((m) => m.softwareHouseId === id);
  };

  return (
    <div className="min-h-screen bg-slate-50/50 pb-20">
      
      {/* Decorative top green accent band */}
      <div className="h-2 bg-brand-green w-full" />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        
        {/* Flagship Header */}
        <Header totalHouses={SOFTWARE_HOUSES.length} />

        {/* CV Analyzing Dashboard component */}
        <CVMatcher
          onAnalysisSuccess={handleAnalysisSuccess}
          onClearAnalysis={handleClearAnalysis}
          analysisResult={analysisResult}
        />

        {/* Directory Header label */}
        <div className="max-w-7xl mx-auto mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-brand-green" />
            <h2 className="text-xl font-bold text-slate-800">
              {analysisResult ? "AI Ranked Software Houses Match List" : "Curated Software House Directory"}
            </h2>
            <span className="px-2.5 py-0.5 bg-slate-100 text-slate-600 text-xs rounded-full font-bold font-mono">
              {processedHouses.length} Companies
            </span>
          </div>

          {analysisResult && (
            <div className="inline-flex items-center gap-1 text-xs text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-100 font-semibold anim-pulse">
              <Sparkles className="w-3.5 h-3.5" />
              Dynamic resume scoring sorted descending
            </div>
          )}
        </div>

        {/* Directory Advanced Filter controls */}
        <FilterControls
          filters={filters}
          onFilterChange={setFilters}
          allLocations={allLocations}
          allSpecialties={allSpecialties}
        />

        {/* Corporate Grid Directory list */}
        {processedHouses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
            {processedHouses.map((company) => (
              <CompanyCard
                key={company.id}
                company={company}
                match={getMatchByCompanyId(company.id)}
                onOpenDraft={handleOpenDraft}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-slate-200/80 p-12 text-center max-w-xl mx-auto mb-10 shadow-xs">
            <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-slate-100">
              <HelpCircle className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-bold text-slate-800">No software houses found</h3>
            <p className="text-xs text-slate-500 max-w-xs mx-auto mt-2 leading-relaxed">
              We couldn't find any companies matching your selected filters. Try clearing some filters or searching for different keywords (like Python, React, RoR, etc.).
            </p>
            <button
              onClick={() =>
                setFilters({
                  searchQuery: "",
                  searchLocation: "",
                  roleCategory: "",
                  specialtyTag: "",
                })
              }
              className="mt-6 px-4 py-2 bg-slate-900 border border-slate-800 text-white text-xs font-bold rounded-xl hover:bg-slate-800 transition-all cursor-pointer"
            >
              Reset All Filters
            </button>
          </div>
        )}

        {/* Applied custom application draft MODAL helper */}
        <DraftModal
          company={selectedCompany}
          matchResult={selectedMatch}
          onClose={handleCloseDraft}
        />

      </main>

      {/* Elegant minimalist footer */}
      <footer className="mt-20 pt-8 pb-10 border-t border-slate-200 text-center text-xs text-slate-400 font-light max-w-5xl mx-auto px-4">
        <p>© 2026 Pakistan Software Houses Careers Portal. Built to facilitate direct & streamlined hiring processes for local developers.</p>
        <p className="mt-1 font-mono text-[10px] text-slate-300">Ref: Standardized AI Studio Container Framework with Gemini 3.5 Flash Matching</p>
      </footer>

    </div>
  );
}
