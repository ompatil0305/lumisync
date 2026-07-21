import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router';
import { useGlobalSearch } from '../hooks/useUniversity';
import type { SearchResult } from '../providers/types';
import {
  Search, X, Building2, User, UtensilsCrossed, Car,
  Calendar, Users, Briefcase, ArrowRight,
  TrendingUp, Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const typeIcons: Record<string, typeof Building2> = {
  building: Building2,
  faculty: User,
  dining: UtensilsCrossed,
  parking: Car,
  event: Calendar,
  organization: Users,
  job: Briefcase,
  department: Building2,
};

const typeColors: Record<string, string> = {
  building: '#CC0000',
  faculty: '#0066CC',
  dining: '#FF6600',
  parking: '#339933',
  event: '#9933CC',
  organization: '#CC0066',
  job: '#0099CC',
  department: '#666666',
};

const typeLabels: Record<string, string> = {
  building: 'Building',
  faculty: 'Faculty',
  dining: 'Dining',
  parking: 'Parking',
  event: 'Event',
  organization: 'Organization',
  job: 'Job',
  department: 'Department',
};

// Quick search suggestions
const quickSearches = [
  'Holden Hall',
  'Computer Science',
  'The Commons',
  'Library',
  'Career Fair',
  'Parking',
  'Starbucks',
  'ACM',
];

export default function SearchScreen() {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const { data: results = [], isLoading } = useGlobalSearch(query);

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Handle result click
  const handleResultClick = (result: SearchResult) => {
    switch (result.type) {
      case 'building':
        navigate(`/detail/building/${result.id}`);
        break;
      case 'faculty':
        navigate('/faculty');
        break;
      case 'dining':
        navigate(`/detail/dining/${result.id}`);
        break;
      case 'parking':
        navigate('/explore/parking');
        break;
      case 'event':
        navigate(`/detail/event/${result.id}`);
        break;
      case 'organization':
        navigate(`/detail/org/${result.id}`);
        break;
      case 'job':
        navigate(`/detail/job/${result.id}`);
        break;
      default:
        break;
    }
  };

  // Group results by type
  const groupedResults = results.reduce(
    (acc, result) => {
      if (!acc[result.type]) acc[result.type] = [];
      acc[result.type].push(result);
      return acc;
    },
    {} as Record<string, SearchResult[]>
  );

  const handleQuickSearch = (term: string) => {
    setQuery(term);
  };

  return (
    <div className="h-full flex flex-col bg-background">
      {/* Search Header */}
      <div className="shrink-0 px-4 pt-4 pb-2">
        <div className="flex items-center gap-3 mb-3">
          <button
            onClick={() => navigate(-1)}
            className="w-9 h-9 rounded-xl bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors"
          >
            <ArrowRight size={18} className="rotate-180" />
          </button>
          <div className="flex-1 flex items-center bg-muted rounded-xl px-3 h-11">
            <Search size={18} className="text-muted-foreground shrink-0" />
            <input
              ref={inputRef}
              type="text"
              placeholder="Search anything on campus..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1 ml-2.5 bg-transparent outline-none text-sm placeholder:text-muted-foreground"
            />
            {query && (
              <button onClick={() => setQuery('')}>
                <X size={16} className="text-muted-foreground" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-4 pb-6">
        <AnimatePresence mode="wait">
          {!query ? (
            /* Empty State - Quick Searches */
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="mb-5">
                <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                  Trending Searches
                </h2>
                <div className="flex flex-wrap gap-2">
                  {quickSearches.map((term) => (
                    <button
                      key={term}
                      onClick={() => handleQuickSearch(term)}
                      className="flex items-center gap-1.5 px-3 py-2 bg-muted rounded-xl text-sm hover:bg-muted/80 transition-colors"
                    >
                      <TrendingUp size={14} className="text-muted-foreground" />
                      {term}
                    </button>
                  ))}
                </div>
              </div>

              {/* Categories */}
              <div>
                <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                  Browse by Category
                </h2>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { type: 'building', label: 'Buildings', icon: Building2, color: '#CC0000' },
                    { type: 'faculty', label: 'Faculty', icon: User, color: '#0066CC' },
                    { type: 'dining', label: 'Dining', icon: UtensilsCrossed, color: '#FF6600' },
                    { type: 'parking', label: 'Parking', icon: Car, color: '#339933' },
                    { type: 'event', label: 'Events', icon: Calendar, color: '#9933CC' },
                    { type: 'organization', label: 'Organizations', icon: Users, color: '#CC0066' },
                    { type: 'job', label: 'Jobs', icon: Briefcase, color: '#0099CC' },
                  ].map((cat) => (
                    <button
                      key={cat.type}
                      onClick={() => {
                        if (cat.type === 'building') navigate('/explore/buildings');
                        else if (cat.type === 'faculty') navigate('/faculty');
                        else if (cat.type === 'dining') navigate('/explore/dining');
                        else if (cat.type === 'parking') navigate('/explore/parking');
                        else if (cat.type === 'event') navigate('/explore/events');
                        else if (cat.type === 'organization') navigate('/explore/orgs');
                        else if (cat.type === 'job') navigate('/explore/jobs');
                      }}
                      className="flex items-center gap-3 p-3 bg-card border border-border rounded-xl hover:border-primary/30 transition-colors text-left"
                    >
                      <div
                        className="w-10 h-10 rounded-lg flex items-center justify-center"
                        style={{ backgroundColor: `${cat.color}15` }}
                      >
                        <cat.icon size={20} style={{ color: cat.color }} />
                      </div>
                      <span className="text-sm font-medium">{cat.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          ) : isLoading ? (
            /* Loading State */
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center justify-center py-12"
            >
              <Loader2 size={24} className="animate-spin text-muted-foreground" />
            </motion.div>
          ) : results.length === 0 ? (
            /* No Results */
            <motion.div
              key="noresults"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-16 text-muted-foreground"
            >
              <Search size={48} className="mb-3 opacity-30" />
              <p className="text-sm font-medium">No results found</p>
              <p className="text-xs mt-1">Try a different search term</p>
            </motion.div>
          ) : (
            /* Search Results */
            <motion.div
              key="results"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="text-xs text-muted-foreground mb-3">
                {results.length} result{results.length !== 1 ? 's' : ''} for "{query}"
              </div>

              {Object.entries(groupedResults).map(([type, items]) => {
                const Icon = typeIcons[type] || Building2;
                const color = typeColors[type] || '#666666';
                const label = typeLabels[type] || type;

                return (
                  <div key={type} className="mb-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Icon size={14} style={{ color }} />
                      <h3 className="text-xs font-semibold uppercase tracking-wider" style={{ color }}>
                        {label}
                        <span className="ml-1 text-muted-foreground">({items.length})</span>
                      </h3>
                    </div>

                    <div className="space-y-1.5">
                      {items.map((result, i) => (
                        <motion.button
                          key={result.id}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.03 }}
                          onClick={() => handleResultClick(result)}
                          className="w-full flex items-center gap-3 p-3 bg-card border border-border rounded-xl hover:border-primary/30 transition-all text-left"
                        >
                          <div
                            className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                            style={{ backgroundColor: `${color}15` }}
                          >
                            <Icon size={18} style={{ color }} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium truncate">{result.title}</div>
                            <div className="text-xs text-muted-foreground truncate">
                              {result.subtitle}
                            </div>
                          </div>
                          <ArrowRight size={14} className="text-muted-foreground shrink-0" />
                        </motion.button>
                      ))}
                    </div>
                  </div>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
