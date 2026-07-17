import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useJobs } from '../../hooks/useUniversity';
import { Briefcase, Search, ChevronLeft, MapPin, Clock, DollarSign } from 'lucide-react';
import { useApp } from '../../context/AppContext';

const filters = ['All', 'On-Campus', 'Work-Study', 'Off-Campus'];

export default function JobsScreen() {
  const navigate = useNavigate();
  useApp(); // for future use
  const [query, setQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');

  const { data: campusJobs = [] } = useJobs();

  const filtered = campusJobs.filter(j => {
    const matchesSearch = j.title.toLowerCase().includes(query.toLowerCase()) ||
      j.department.toLowerCase().includes(query.toLowerCase());
    const matchesFilter = activeFilter === 'All' ? true :
      activeFilter === 'On-Campus' ? j.type === 'On-Campus' :
      activeFilter === 'Work-Study' ? j.type === 'Federal Work-Study' :
      activeFilter === 'Off-Campus' ? j.type === 'Off-Campus' : true;
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
            <h1 className="text-xl font-bold">Campus Jobs</h1>
          </div>
          <div className="relative mb-2">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search jobs..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full bg-muted rounded-xl pl-9 pr-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-1">
            {filters.map(f => (
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
        <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-xl px-3 py-2">
          <p className="text-[11px] text-blue-700 dark:text-blue-300">
            Applications are submitted through{' '}
            <a href="https://ttu-csm.symplicity.com/students" target="_blank" rel="noopener noreferrer" className="font-medium underline">RRSEC</a>
            {' '}or{' '}
            <a href="https://ttu-csm.symplicity.com/students" target="_blank" rel="noopener noreferrer" className="font-medium underline">Hire Red Raiders</a>
            {' '}— Lumisync surfaces listings only.
          </p>
        </div>

        {filtered.map((job) => (
          <button
            key={job.id}
            onClick={() => navigate(`/detail/job/${job.id}`)}
            className="w-full bg-card border border-border rounded-2xl p-4 text-left"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  {job.isNew && (
                    <span className="text-[10px] bg-primary text-primary-foreground px-1.5 py-0.5 rounded-full font-medium">NEW</span>
                  )}
                  <span className="text-[10px] bg-muted px-1.5 py-0.5 rounded-full">{job.type}</span>
                </div>
                <h3 className="font-semibold text-sm">{job.title}</h3>
                <p className="text-xs text-muted-foreground">{job.department}</p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 mt-2.5 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <MapPin size={12} /> {job.location}
              </span>
              <span className="flex items-center gap-1">
                <DollarSign size={12} /> {job.payRange}/hr
              </span>
              <span className="flex items-center gap-1">
                <Clock size={12} /> {job.hoursPerWeek} hrs/week
              </span>
            </div>

            <div className="flex items-center justify-between mt-3">
              <span className="text-[10px] text-muted-foreground">
                Apply by {job.applicationDeadline}
              </span>
              <span className="text-[10px] bg-muted px-2 py-0.5 rounded-full">
                via {job.source}
              </span>
            </div>
          </button>
        ))}

        {filtered.length === 0 && (
          <div className="text-center py-12">
            <Briefcase size={40} className="mx-auto text-muted-foreground/30 mb-3" />
            <p className="text-sm text-muted-foreground">No jobs found</p>
          </div>
        )}
      </div>
    </div>
  );
}
