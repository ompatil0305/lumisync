import { useNavigate } from 'react-router';
import { ttuProfile } from '../data/universityProfile';
import {
  UtensilsCrossed, Car, Building2, Briefcase,
  CalendarDays, Users, Bus, Search, ChevronRight, GraduationCap
} from 'lucide-react';
import { motion } from 'framer-motion';

const categories = [
  { label: 'Dining', description: '17 venues · 50+ concepts', icon: UtensilsCrossed, path: '/explore/dining', color: 'text-primary bg-primary/10' },
  { label: 'Parking', description: 'Live lot availability', icon: Car, path: '/explore/parking', color: 'text-primary bg-primary/10' },
  { label: 'Buildings', description: 'Find any room or hall', icon: Building2, path: '/explore/buildings', color: 'text-primary bg-primary/10' },
  { label: 'Jobs', description: 'On-campus & work-study', icon: Briefcase, path: '/explore/jobs', color: 'text-primary bg-primary/10' },
  { label: 'Events', description: 'TechEvents calendar', icon: CalendarDays, path: '/explore/events', color: 'text-primary bg-primary/10' },
  { label: 'Organizations', description: '500+ student orgs', icon: Users, path: '/explore/orgs', color: 'text-primary bg-primary/10' },
  { label: 'Shuttle', description: 'Live bus tracking', icon: Bus, path: '/explore/shuttle', color: 'text-primary bg-primary/10' },
  { label: 'Faculty', description: 'Find professors & staff', icon: GraduationCap, path: '/faculty', color: 'text-primary bg-primary/10' },
  { label: 'Search', description: 'Search everything', icon: Search, path: '/search', color: 'text-primary bg-primary/10' },
];

export default function Explore() {
  const navigate = useNavigate();

  return (
    <div className="min-h-full bg-background">
      <div className="sticky top-0 z-40 bg-background/95 backdrop-blur-lg border-b border-border">
        <div className="px-4 pt-4 pb-3">
          <h1 className="text-2xl font-bold tracking-tight">Explore</h1>
          <p className="text-sm text-muted-foreground">{ttuProfile.name}</p>
        </div>
      </div>

      <div className="px-4 py-4 pb-24">
        {/* Search */}
        <button
          onClick={() => navigate('/search')}
          className="w-full flex items-center gap-2.5 bg-muted rounded-xl px-4 py-3 text-left mb-5"
        >
          <Search size={18} className="text-muted-foreground shrink-0" />
          <span className="text-sm text-muted-foreground">Search everything on campus...</span>
        </button>

        {/* Category Grid */}
        <div className="grid grid-cols-2 gap-3">
          {categories.map((cat, i) => {
            const Icon = cat.icon;
            return (
              <motion.button
                key={cat.label}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                onClick={() => navigate(cat.path)}
                className="flex flex-col items-start gap-2.5 p-4 bg-card border border-border rounded-2xl text-left active:scale-[0.97] transition-transform"
              >
                <div className={`w-10 h-10 rounded-xl ${cat.color} flex items-center justify-center`}>
                  <Icon size={20} />
                </div>
                <div>
                  <p className="font-semibold text-sm">{cat.label}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{cat.description}</p>
                </div>
                <ChevronRight size={16} className="text-muted-foreground ml-auto" />
              </motion.button>
            );
          })}
        </div>

        {/* University Card */}
        <div className="mt-6 bg-primary rounded-2xl p-5 text-primary-foreground">
          <p className="font-semibold">{ttuProfile.name}</p>
          <p className="text-sm opacity-80 mt-1">{ttuProfile.tagline}</p>
        </div>
      </div>
    </div>
  );
}
