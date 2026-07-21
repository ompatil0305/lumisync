import { useParams, useNavigate } from 'react-router';
import { useJob } from '../../hooks/useUniversity';
import { ChevronLeft, Briefcase, MapPin, Clock, DollarSign, ExternalLink, Heart, Calendar, CheckCircle2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function JobDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { state, dispatch } = useApp();
  
  const { data: job, isLoading } = useJob(id || '');

  if (isLoading) {
    return (
      <div className="min-h-full flex items-center justify-center bg-background">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-full flex items-center justify-center bg-background">
        <p className="text-muted-foreground">Job not found</p>
      </div>
    );
  }

  const isSaved = state.savedJobs.includes(job.id);

  return (
    <div className="min-h-full bg-background">
      {/* Header */}
      <div className="relative bg-muted h-36">
        <div className="absolute inset-0 flex items-center justify-center">
          <Briefcase size={48} className="text-primary/30" />
        </div>
        <button
          onClick={() => navigate(-1)}
          className="absolute top-4 left-4 w-9 h-9 rounded-full bg-background/90 backdrop-blur flex items-center justify-center shadow-lg"
        >
          <ChevronLeft size={20} />
        </button>
        <button
          onClick={() => dispatch({ type: 'TOGGLE_SAVE_JOB', jobId: job.id })}
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-background/90 backdrop-blur flex items-center justify-center shadow-lg"
        >
          <Heart size={18} className={isSaved ? 'text-red-500 fill-red-500' : 'text-muted-foreground'} />
        </button>
      </div>

      <div className="px-4 py-5 pb-24 -mt-6 relative">
        <div className="bg-card border border-border rounded-2xl p-5 mb-4">
          <div className="flex items-center gap-2 mb-2">
            {job.isNew && (
              <span className="text-[10px] bg-primary text-primary-foreground px-2 py-0.5 rounded-full font-medium">NEW</span>
            )}
            <span className="text-[10px] bg-muted px-2 py-0.5 rounded-full">{job.type}</span>
          </div>
          <h1 className="text-xl font-bold mb-1">{job.title}</h1>
          <p className="text-sm text-muted-foreground">{job.department}</p>
        </div>

        {/* Key details */}
        <div className="bg-card border border-border rounded-2xl p-4 mb-4 space-y-3">
          <div className="flex items-center gap-3">
            <MapPin size={18} className="text-primary shrink-0" />
            <p className="text-sm">{job.location}</p>
          </div>
          <div className="flex items-center gap-3">
            <DollarSign size={18} className="text-primary shrink-0" />
            <p className="text-sm">{job.payRange} / {job.payType}</p>
          </div>
          <div className="flex items-center gap-3">
            <Clock size={18} className="text-primary shrink-0" />
            <p className="text-sm">{job.hoursPerWeek} hours/week</p>
          </div>
          <div className="flex items-center gap-3">
            <Calendar size={18} className="text-primary shrink-0" />
            <p className="text-sm">Apply by {job.applicationDeadline}</p>
          </div>
        </div>

        {/* Description */}
        <div className="bg-card border border-border rounded-2xl p-4 mb-4">
          <h3 className="font-semibold text-sm mb-2">Description</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">{job.description}</p>
        </div>

        {/* Requirements */}
        <div className="bg-card border border-border rounded-2xl p-4 mb-4">
          <h3 className="font-semibold text-sm mb-3">Requirements</h3>
          <div className="space-y-2">
            {job.requirements.map((req, i) => (
              <div key={i} className="flex items-start gap-2">
                <CheckCircle2 size={16} className="text-emerald-500 shrink-0 mt-0.5" />
                <p className="text-sm text-muted-foreground">{req}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Source */}
        <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-xl px-4 py-3 mb-4">
          <p className="text-xs text-blue-700 dark:text-blue-300 mb-1">
            Applications are submitted through <strong>{job.source}</strong>.
          </p>
          <p className="text-xs text-blue-600 dark:text-blue-400">
            Lumisync surfaces listings only — apply on the official university system.
          </p>
        </div>

        {/* Action buttons */}
        <div className="space-y-2">
          <a
            href={job.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full bg-primary text-primary-foreground rounded-2xl py-3.5 font-medium text-sm flex items-center justify-center gap-2"
          >
            <ExternalLink size={18} />
            Apply on {job.source}
          </a>
          <button
            onClick={() => dispatch({ type: 'TOGGLE_SAVE_JOB', jobId: job.id })}
            className={`w-full rounded-2xl py-3.5 font-medium text-sm flex items-center justify-center gap-2 ${
              isSaved
                ? 'bg-red-50 text-red-600 border border-red-200'
                : 'bg-muted text-foreground'
            }`}
          >
            <Heart size={18} className={isSaved ? 'fill-red-500' : ''} />
            {isSaved ? 'Saved' : 'Save Job'}
          </button>
        </div>
      </div>
    </div>
  );
}
