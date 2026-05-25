import React from "react";
import { Search, MapPin, Briefcase, Sparkles } from "lucide-react";
import { FilterCriteria } from "../types";

interface FilterControlsProps {
  filters: FilterCriteria;
  onFilterChange: (filters: FilterCriteria) => void;
  allLocations: string[];
  allSpecialties: string[];
}

export default function FilterControls({
  filters,
  onFilterChange,
  allLocations,
  allSpecialties,
}: FilterControlsProps) {

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFilterChange({ ...filters, searchQuery: e.target.value });
  };

  const handleLocationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onFilterChange({ ...filters, searchLocation: e.target.value });
  };

  const selectRoleCategory = (category: string) => {
    onFilterChange({ ...filters, roleCategory: category === filters.roleCategory ? "" : category });
  };

  const toggleSpecialty = (specialty: string) => {
    onFilterChange({ ...filters, specialtyTag: specialty === filters.specialtyTag ? "" : specialty });
  };

  const categories = [
    { label: "Frontend", id: "Frontend" },
    { label: "Backend", id: "Backend" },
    { label: "Fullstack", id: "Fullstack" },
    { label: "Mobile Dev", id: "Mobile" },
    { label: "Cloud & DevOps", id: "DevOps" },
    { label: "AI & ML", id: "AI" },
    { label: "QA / Testing", id: "QA" }
  ];

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 mb-8 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Search string */}
        <div className="relative">
          <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
            Search Software House Name or Stack
          </label>
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
            <input
              type="text"
              value={filters.searchQuery}
              onChange={handleSearchChange}
              placeholder="e.g. Arbisoft, Python, ERP, systems, React Native..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 focus:border-brand-green-light focus:bg-white focus:outline-none rounded-xl text-sm transition-all"
            />
          </div>
        </div>

        {/* Location Selector */}
        <div>
          <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
            Filter by Pakistan City Hub
          </label>
          <div className="relative">
            <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
            <select
              value={filters.searchLocation}
              onChange={handleLocationChange}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 focus:border-brand-green-light focus:bg-white focus:outline-none rounded-xl text-sm transition-all appearance-none cursor-pointer"
            >
              <option value="">All Offices (Lahore, Karachi, Islamabad, Remote)</option>
              {allLocations.map((loc) => (
                <option key={loc} value={loc}>
                  {loc} Office
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Role categories fast clicks */}
      <div className="mt-5 pt-5 border-t border-slate-100">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2.5">
          <Briefcase className="w-3.5 h-3.5" />
          Filter by Demanded Role Category
        </div>
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => {
            const isSelected = filters.roleCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => selectRoleCategory(cat.id)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-all ${
                  isSelected
                    ? "bg-brand-green text-white border-brand-green shadow-xs"
                    : "bg-slate-50 text-slate-600 border-slate-200/60 hover:bg-slate-100"
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Specialty Tags Cloud */}
      <div className="mt-4 pt-4 border-t border-slate-100">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2.5">
          <Sparkles className="w-3.5 h-3.5" />
          Quick Specialties Cloud
        </div>
        <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto pr-2 custom-scrollbar">
          {allSpecialties.map((spec) => {
            const isSelected = filters.specialtyTag === spec;
            return (
              <button
                key={spec}
                onClick={() => toggleSpecialty(spec)}
                className={`px-2.5 py-1 text-xs rounded-md transition-all ${
                  isSelected
                    ? "bg-emerald-700 text-white shadow-xs"
                    : "bg-slate-100 hover:bg-slate-200 text-slate-600"
                }`}
              >
                {spec}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
