import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import ServiceCard from './ServiceCard';
import EmptyState from './EmptyState';
import { servicesData, serviceCategories } from '../data/servicesData';
import { ArrowRight, Search, Filter, X } from 'lucide-react';

const ServiceGrid = ({ featuredOnly = false, limit, showFilters = false }) => {
  const [selectedCategory, setSelectedCategory] = useState("All Services");
  const [searchQuery, setSearchQuery] = useState("");

  let filteredServices = servicesData;

  if (featuredOnly) {
    filteredServices = filteredServices.filter(s => s.featured);
  }

  if (selectedCategory !== "All Services") {
    filteredServices = filteredServices.filter(s => s.category === selectedCategory);
  }

  if (searchQuery.trim() !== "") {
    const q = searchQuery.toLowerCase().trim();
    filteredServices = filteredServices.filter(
      s => s.title.toLowerCase().includes(q) ||
           s.description.toLowerCase().includes(q) ||
           (s.shortDescription && s.shortDescription.toLowerCase().includes(q)) ||
           s.category.toLowerCase().includes(q)
    );
  }

  if (limit) {
    filteredServices = filteredServices.slice(0, limit);
  }

  const handleReset = () => {
    setSelectedCategory("All Services");
    setSearchQuery("");
  };

  return (
    <div className="space-y-8">
      {/* Category Filter & Search Strip */}
      {showFilters && (
        <div className="space-y-4 bg-slate-100/90 p-4 sm:p-6 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            
            {/* Search Input Box */}
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search services (e.g. PAN, Income, Passport)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="form-input pl-10 pr-9 py-2 bg-white text-xs sm:text-sm"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 cursor-pointer"
                  aria-label="Clear search query"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 w-full sm:w-auto">
              <Filter className="w-4 h-4 text-slate-400 shrink-0" />
              <span>Category Filter:</span>
            </div>
          </div>

          {/* Category Filter Badges */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {serviceCategories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-indigo-600 text-white shadow-xs font-semibold'
                    : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Active Filter Indicators */}
          {(selectedCategory !== "All Services" || searchQuery !== "") && (
            <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-200/80 text-slate-500">
              <span>
                Showing {filteredServices.length} result{filteredServices.length !== 1 ? 's' : ''}
              </span>
              <button
                onClick={handleReset}
                className="text-indigo-600 font-semibold hover:underline cursor-pointer"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>
      )}

      {/* Grid Container */}
      {filteredServices.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredServices.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>
      ) : (
        <EmptyState
          title="No services match your criteria"
          message="Try adjusting your search terms or select another service category filter."
          onReset={handleReset}
        />
      )}

      {/* View All Services CTA */}
      {featuredOnly && (
        <div className="text-center pt-4">
          <Link
            to="/services"
            className="btn-secondary inline-flex items-center gap-2 px-6 py-3 text-sm"
          >
            <span>View Complete Service Catalog</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      )}
    </div>
  );
};

export default ServiceGrid;
