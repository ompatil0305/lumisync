import { useParams, useNavigate } from 'react-router';
import { studentOrgs } from '../../data/universityProfile';
import { ChevronLeft, Users, Users2, Heart, Mail, Clock, MapPin, ExternalLink } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function OrgDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { state, dispatch } = useApp();
  const org = studentOrgs.find(o => o.id === id);

  if (!org) {
    return (
      <div className="min-h-full flex items-center justify-center bg-background">
        <p className="text-muted-foreground">Organization not found</p>
      </div>
    );
  }

  const isFav = state.favoriteOrgs.includes(org.id);

  return (
    <div className="min-h-full bg-background">
      {/* Header */}
      <div className="relative bg-muted h-36">
        <div className="absolute inset-0 flex items-center justify-center">
          <Users size={48} className="text-primary/30" />
        </div>
        <button
          onClick={() => navigate(-1)}
          className="absolute top-4 left-4 w-9 h-9 rounded-full bg-background/90 backdrop-blur flex items-center justify-center shadow-lg"
        >
          <ChevronLeft size={20} />
        </button>
        <button
          onClick={() => dispatch({ type: 'TOGGLE_FAVORITE_ORG', orgId: org.id })}
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-background/90 backdrop-blur flex items-center justify-center shadow-lg"
        >
          <Heart size={18} className={isFav ? 'text-red-500 fill-red-500' : 'text-muted-foreground'} />
        </button>
      </div>

      <div className="px-4 py-5 pb-24 -mt-6 relative">
        <div className="bg-card border border-border rounded-2xl p-5 mb-4">
          <span className="text-[10px] bg-muted px-2 py-0.5 rounded-full">{org.category}</span>
          <h1 className="text-xl font-bold mt-2 mb-1">{org.name}</h1>
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Users2 size={14} />
            <span>{org.memberCount} members</span>
          </div>
        </div>

        {/* Description */}
        <div className="bg-card border border-border rounded-2xl p-4 mb-4">
          <p className="text-sm text-muted-foreground leading-relaxed">{org.description}</p>
        </div>

        {/* Meeting info */}
        {(org.meetingTime || org.meetingLocation) && (
          <div className="bg-card border border-border rounded-2xl p-4 mb-4 space-y-3">
            {org.meetingTime && (
              <div className="flex items-center gap-3">
                <Clock size={18} className="text-primary shrink-0" />
                <p className="text-sm">{org.meetingTime}</p>
              </div>
            )}
            {org.meetingLocation && (
              <div className="flex items-center gap-3">
                <MapPin size={18} className="text-primary shrink-0" />
                <p className="text-sm">{org.meetingLocation}</p>
              </div>
            )}
          </div>
        )}

        {/* Contact */}
        <div className="bg-card border border-border rounded-2xl p-4 mb-4">
          <h3 className="font-semibold text-sm mb-3">Contact</h3>
          {org.email && (
            <a href={`mailto:${org.email}`} className="flex items-center gap-3 py-2">
              <Mail size={18} className="text-primary shrink-0" />
              <span className="text-sm">{org.email}</span>
            </a>
          )}
          {org.socialLink && (
            <a href={org.socialLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 py-2">
              <ExternalLink size={18} className="text-primary shrink-0" />
              <span className="text-sm">Social Media</span>
            </a>
          )}
        </div>

        {/* Favorite button */}
        <button
          onClick={() => dispatch({ type: 'TOGGLE_FAVORITE_ORG', orgId: org.id })}
          className={`w-full rounded-2xl py-3.5 font-medium text-sm flex items-center justify-center gap-2 ${
            isFav
              ? 'bg-red-50 text-red-600 border border-red-200'
              : 'bg-primary text-primary-foreground'
          }`}
        >
          <Heart size={18} className={isFav ? 'fill-red-500' : ''} />
          {isFav ? 'Favorited — Get Reminders' : 'Favorite This Organization'}
        </button>
      </div>
    </div>
  );
}
