import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useBuildings } from '../../hooks/useUniversity';
import { Search, Building2, ChevronLeft, MapPin, Navigation } from 'lucide-react';

export default function BuildingsScreen() {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const { data: buildings = [] } = useBuildings();

  const filtered = buildings.filter(b =>
    b.name.toLowerCase().includes(query.toLowerCase()) ||
    b.abbreviation?.toLowerCase().includes(query.toLowerCase()) ||
    b.departments?.some(d => d.toLowerCase().includes(query.toLowerCase())) ||
    (b.officialNumber && b.officialNumber !== 'N/A' && b.officialNumber.toLowerCase().includes(query.toLowerCase()))
  );

  const categories = ['academic', 'dining', 'parking', 'residence', 'recreation', 'library', 'admin', 'other'] as const;

  return (
    <div className="min-h-full bg-background">
      <div className="sticky top-0 z-40 bg-background/95 backdrop-blur-lg border-b border-border">
        <div className="px-4 pt-3 pb-3">
          <div className="flex items-center gap-3 mb-3">
            <button onClick={() => navigate(-1)} className="w-9 h-9 rounded-full bg-muted flex items-center justify-center shrink-0">
              <ChevronLeft size={20} />
            </button>
            <h1 className="text-xl font-bold">Buildings</h1>
          </div>
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by name, code, or department..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full bg-muted rounded-xl pl-9 pr-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
        </div>
      </div>

      <div className="px-4 py-4 pb-24 space-y-2">
        {categories.map(cat => {
          const catBuildings = filtered.filter(b => b.category === cat);
          if (catBuildings.length === 0) return null;
          return (
            <div key={cat}>
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-1">
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </h3>
              {catBuildings.map((building) => (
                <button
                  key={building.id}
                  onClick={() => navigate(`/detail/building/${building.id}`)}
                  className="w-full flex items-start gap-3 bg-card border border-border rounded-2xl p-3.5 text-left mb-2"
                >
                  <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                    <Building2 size={20} className="text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-sm">{building.name}</p>
                      {building.abbreviation && (
                        <span className="text-[10px] bg-muted px-1.5 py-0.5 rounded-full">{building.abbreviation}</span>
                      )}
                    </div>
                    {building.departments && (
                      <p className="text-xs text-muted-foreground truncate mt-0.5">{building.departments.join(', ')}</p>
                    )}
                    {building.address && (
                      <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                        <MapPin size={10} /> {building.address}
                      </p>
                    )}
                  </div>
                  <Navigation size={16} className="text-muted-foreground shrink-0 self-center" />
                </button>
              ))}
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div className="text-center py-12">
            <Building2 size={40} className="mx-auto text-muted-foreground/30 mb-3" />
            <p className="text-sm text-muted-foreground">No buildings found</p>
          </div>
        )}
      </div>
    </div>
  );
}
