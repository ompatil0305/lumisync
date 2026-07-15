import { useState, useRef, useEffect } from 'react';

import {
  buildings, diningVenues, parkingLots, shuttleRoutes,
  campusEvents, campusJobs, studentOrgs, isVenueOpen
} from '../data/universityProfile';
import { Send, Sparkles, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  suggestions?: string[];
}

const suggestionChips = [
  'Where should I eat after class?',
  'Find parking near Holden Hall.',
  'What jobs were posted today?',
  'What events have free food this week?',
  'When is the next shuttle?',
  'Show me engineering clubs.',
];

function generateResponse(query: string): string {
  const q = query.toLowerCase();

  // Dining queries
  if (q.includes('eat') || q.includes('food') || q.includes('dining') || q.includes('hungry') || q.includes('restaurant')) {
    const open = diningVenues.filter(isVenueOpen);
    if (open.length === 0) return "No dining venues are currently open. The Commons opens at 7:00 AM on weekdays. Check the Dining section for full hours.";
    const venues = open.slice(0, 3).map(v => `• ${v.name} (${v.location}) — ${v.category}`).join('\n');
    return `Here are dining venues open right now:\n\n${venues}\n\nAll accept Dining Bucks. Commuters get 15% off at participating locations.`;
  }

  // Parking queries
  if (q.includes('park') || q.includes('parking')) {
    let buildingName = '';
    buildings.forEach(b => {
      if (q.includes(b.name.toLowerCase()) || (b.abbreviation && q.includes(b.abbreviation.toLowerCase()))) {
        buildingName = b.id;
      }
    });
    if (buildingName) {
      const building = buildings.find(b => b.id === buildingName);
      const nearbyLots = parkingLots
        .filter(l => l.walkingDistances.some(w => w.buildingId === buildingName))
        .sort((a, b) => {
          const da = a.walkingDistances.find(w => w.buildingId === buildingName)?.minutes || 99;
          const db = b.walkingDistances.find(w => w.buildingId === buildingName)?.minutes || 99;
          return da - db;
        });
      if (nearbyLots.length > 0) {
        const lots = nearbyLots.slice(0, 3).map(l => {
          const dist = l.walkingDistances.find(w => w.buildingId === buildingName);
          return `• ${l.name} — ${l.status} (${dist?.minutes} min walk)`;
        }).join('\n');
        return `Parking options near ${building?.name}:\n\n${lots}`;
      }
    }
    const available = parkingLots.filter(l => l.status === 'available');
    const lots = available.slice(0, 3).map(l => `• ${l.name} — ${l.totalSpaces - l.occupiedSpaces} spaces available`).join('\n');
    return `Available parking lots:\n\n${lots}\n\nCampus core is closed to non-permit vehicles weekdays 7:30 AM – 5:30 PM. Visitor Park & Pay spaces are $2/hour.`;
  }

  // Job queries
  if (q.includes('job') || q.includes('work') || q.includes('employment') || q.includes('hiring')) {
    const newJobs = campusJobs.filter(j => j.isNew).slice(0, 3);
    const jobs = newJobs.map(j => `• ${j.title} — ${j.department} (${j.payRange}/hr)`).join('\n');
    return `New job postings this week:\n\n${jobs}\n\nApply through RRSEC or Hire Red Raiders. Links are in each job listing.`;
  }

  // Event queries
  if (q.includes('event') || q.includes('happening') || q.includes('what\'s going on')) {
    if (q.includes('free food')) {
      const freeFoodEvents = campusEvents.filter(e => e.hasFreeFood);
      const events = freeFoodEvents.map(e => `• ${e.title} — ${e.date} at ${e.startTime} (${e.location})`).join('\n');
      return `Events with free food this week:\n\n${events}\n\nFree food events are popular — arrive early!`;
    }
    const events = campusEvents.slice(0, 5).map(e => `• ${e.title} — ${e.date} at ${e.startTime}`).join('\n');
    return `Upcoming events:\n\n${events}\n\nCheck the Events section for more details and to save events.`;
  }

  // Shuttle queries
  if (q.includes('shuttle') || q.includes('bus') || q.includes('transport')) {
    const redRaider = shuttleRoutes[0];
    const nextArrival = redRaider.stops[0].nextArrival;
    return `Next Red Raider shuttle arrives at ${redRaider.stops[0].name} in ${nextArrival} minutes.\n\nRed Raider and Double T routes run every 10-12 minutes weekdays 7 AM – 6 PM. Free for TTU students with ID.\n\nRaider Ride (evening van service) runs 6 PM – 2:45 AM daily. Call (806) 742-RAID to request pickup.`;
  }

  // Organization queries
  if (q.includes('club') || q.includes('org') || q.includes('organization') || q.includes('engineering')) {
    const orgs = studentOrgs.filter(o =>
      q.includes('engineering') || q.includes('cs') || q.includes('computer')
        ? o.category === 'Engineering/CS'
        : true
    ).slice(0, 5);
    const list = orgs.map(o => `• ${o.name} — ${o.memberCount} members${o.meetingTime ? ` (${o.meetingTime})` : ''}`).join('\n');
    return `Student organizations${q.includes('engineering') || q.includes('cs') ? ' in Engineering/CS' : ''}:\n\n${list}\n\nFavorite an organization to get meeting reminders!`;
  }

  // Building queries
  if (q.includes('building') || q.includes('hall') || q.includes('where is')) {
    let found = false;
    let response = '';
    buildings.forEach(b => {
      if (q.includes(b.name.toLowerCase()) || (b.abbreviation && q.includes(b.abbreviation.toLowerCase()))) {
        found = true;
        response = `${b.name}${b.abbreviation ? ` (${b.abbreviation})` : ''}\n\n${b.description || ''}\n\n`;
        if (b.departments) response += `Departments: ${b.departments.join(', ')}\n`;
        if (b.address) response += `Address: ${b.address}\n`;
        if (b.nearestShuttleStop) response += `Nearest shuttle: ${b.nearestShuttleStop}`;
      }
    });
    if (found) return response;
  }

  // Help / general
  if (q.includes('help') || q.includes('what can you do')) {
    return `I'm Lumi, your Texas Tech campus assistant! I can help you with:\n\n🍽️ Dining — find open venues, menus, and locations\n🚗 Parking — check lot availability and find spots near your building\n💼 Jobs — browse on-campus and work-study positions\n📅 Events — discover campus events (including free food!)\n🚌 Shuttle — check routes, schedules, and ETAs\n🏢 Buildings — find any building, room, or department\n👥 Organizations — explore 500+ student orgs\n\nTry asking me anything about campus life!`;
  }

  // Default
  return `I can help with dining, parking, jobs, events, shuttles, buildings, and student organizations at Texas Tech.\n\nTry asking something like:\n• "Where should I eat?"\n• "Find parking near Holden Hall"\n• "What events have free food?"\n• "When is the next shuttle?"`;
}

export default function Lumi() {

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: "Hi! I'm Lumi, your Texas Tech campus assistant. Ask me anything — dining, parking, jobs, events, shuttles, and more.",
      suggestions: suggestionChips,
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages]);

  const sendMessage = (text: string) => {
    if (!text.trim()) return;

    const userMsg: Message = { id: Date.now().toString(), role: 'user', content: text };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      const response = generateResponse(text);
      const assistantMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
      };
      setMessages(prev => [...prev, assistantMsg]);
      setIsTyping(false);
    }, 600 + Math.random() * 400);
  };

  return (
    <div className="h-full flex flex-col bg-background">
      {/* Header */}
      <div className="shrink-0 flex items-center gap-3 px-4 py-3 border-b border-border bg-background/95 backdrop-blur-lg z-10">
        <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center shrink-0">
          <Sparkles size={18} className="text-primary-foreground" />
        </div>
        <div className="flex-1 min-w-0">
          <h1 className="font-semibold text-sm">Lumi</h1>
          <div className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span className="text-[10px] text-muted-foreground">Campus AI Assistant</span>
          </div>
        </div>
        <span className="text-[10px] bg-accent/20 text-amber-700 px-2 py-0.5 rounded-full font-medium">
          GROUNDED DATA
        </span>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        <AnimatePresence>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex gap-2.5 ${msg.role === 'user' ? 'justify-end' : ''}`}
            >
              {msg.role === 'assistant' && (
                <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center shrink-0 mt-0.5">
                  <Sparkles size={14} className="text-primary-foreground" />
                </div>
              )}
              <div className={`max-w-[80%] ${msg.role === 'user' ? 'order-first' : ''}`}>
                <div className={`rounded-2xl px-4 py-2.5 text-sm leading-relaxed whitespace-pre-line ${
                  msg.role === 'user'
                    ? 'bg-primary text-primary-foreground rounded-br-md'
                    : 'bg-muted rounded-bl-md'
                }`}>
                  {msg.content}
                </div>
                {/* Suggestion chips */}
                {msg.suggestions && (
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {msg.suggestions.map(s => (
                      <button
                        key={s}
                        onClick={() => sendMessage(s)}
                        className="text-xs bg-background border border-border rounded-full px-3 py-1.5 text-left hover:bg-muted transition-colors"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              {msg.role === 'user' && (
                <div className="w-7 h-7 rounded-full bg-muted flex items-center justify-center shrink-0 mt-0.5">
                  <User size={14} />
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>

        {isTyping && (
          <div className="flex gap-2.5">
            <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center shrink-0">
              <Sparkles size={14} className="text-primary-foreground" />
            </div>
            <div className="bg-muted rounded-2xl rounded-bl-md px-4 py-3">
              <div className="flex gap-1">
                <span className="w-2 h-2 rounded-full bg-muted-foreground/40 animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-2 rounded-full bg-muted-foreground/40 animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2 h-2 rounded-full bg-muted-foreground/40 animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="shrink-0 px-4 py-3 border-t border-border bg-background">
        <div className="flex items-center gap-2 bg-muted rounded-2xl px-4 py-1">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && sendMessage(input)}
            placeholder="Ask Lumi anything..."
            className="flex-1 bg-transparent py-3 text-sm outline-none"
          />
          <button
            onClick={() => sendMessage(input)}
            disabled={!input.trim() || isTyping}
            className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-colors ${
              input.trim() && !isTyping ? 'bg-primary text-primary-foreground' : 'bg-muted-foreground/20 text-muted-foreground'
            }`}
          >
            <Send size={15} />
          </button>
        </div>
        <p className="text-[10px] text-muted-foreground text-center mt-2">
          Lumi answers using Texas Tech campus data. Full conversational AI coming soon.
        </p>
      </div>
    </div>
  );
}
