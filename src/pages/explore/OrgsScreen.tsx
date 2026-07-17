import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useOrganizations } from '../../hooks/useUniversity';
import { Users, Search, ChevronLeft, Heart, Users2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';

const categories = ['All', 'Engineering/CS', 'Cultural', 'Academic', 'Service', 'Recreation'];

export default function OrgsScreen() {
  const navigate = useNavigate();
  const { state, dispatch } = useApp();
  const [query, setQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');

  const { data: studentOrgs = [] } = useOrganizations();

  const filtered = studentOrgs.filter(o => {
    const matchesSearch = o.name.toLowerCase().includes(query.toLowerCase()) ||
      o.description.toLowerCase().includes(query.toLowerCase());
    const matchesFilter = activeFilter === 'All' ? true : o.category === activeFilter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-full bg-background">
      <div className="sticky top-0 z-40 bg-background/95 backdrop-blur-lg border-b border-border">
        <div className="px-4 pt-3 pb-2">
          <div className="flex items-center gap-3 mb-3">
            <button onClick={() => navigate(-1)} className="w-9 h-9 rounded-full bg-muted flex items-center justify-center shrink-0">
              <ChevronLeft size={20} />
            </button>
            <h1 className="text-xl font-bold">Organizations</h1>
          </div>
          <div className="relative mb-2">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search organizations..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full bg-muted rounded-xl pl-9 pr-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-1">
            {categories.map(f => (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                  activeFilter === f ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="px-4 py-4 pb-24 space-y-3">
        {filtered.map((org) => {
          const isFav = state.favoriteOrgs.includes(org.id);
          return (
            <button
              key={org.id}
              onClick={() => navigate(`/detail/org/${org.id}`)}
              className="w-full bg-card border border-border rounded-2xl p-4 text-left"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] bg-muted px-1.5 py-0.5 rounded-full">{org.category}</span>
                    {org.memberCount && (
                      <span className="text-[10px] text-muted-foreground flex items-center gap-0.5">
                        <Users2 size={10} /> {org.memberCount} members
                      </span>
                    )}
                  </div>
                  <h3 className="font-semibold text-sm">{org.name}</h3>
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{org.description}</p>
                  {org.meetingTime && (
                    <p className="text-xs text-muted-foreground mt-1.5">
                      Meets {org.meetingTime}{org.meetingLocation ? ` · ${org.meetingLocation}` : ''}
                    </p>
                  )}
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    dispatch({ type: 'TOGGLE_FAVORITE_ORG', orgId: org.id });
                  }}
                  className="shrink-0 p-1 ml-2"
                >
                  <Heart size={18} className={isFav ? 'text-red-500 fill-red-500' : 'text-muted-foreground'} />
                </button>
              </div>
            </button>
          );
        })}

        {filtered.length === 0 && (
          <div className="text-center py-12">
            <Users size={40} className="mx-auto text-muted-foreground/30 mb-3" />
            <p className="text-sm text-muted-foreground">No organizations found</p>
          </div>
        )}

        {/* Start an org CTA */}
        <div className="bg-primary/5 border border-primary/10 rounded-2xl p-4 text-center">
          <p className="text-sm font-medium mb-1">Want to start a new organization?</p>
          <p className="text-xs text-muted-foreground mb-3">
            Visit the Office of Student Involvement to learn about the registration process.
          </p>
          <a
            href="https://ttu.campuslabs.com/engage/account/login?returnUrl=/engage/organizations"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block text-xs bg-primary text-primary-foreground px-4 py-2 rounded-full font-medium"
          >
            Learn More on TechConnect
          </a>
        </div>
      </div>
    </div>
  );
}
