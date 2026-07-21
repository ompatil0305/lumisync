import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router';
import { useFaculty, useBuildings } from '../hooks/useUniversity';
import {
  Search, X, User, Mail, Phone, MapPin, Building2,
  GraduationCap, ChevronRight, Filter, BookOpen,
  Microscope, ExternalLink, Check
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { facultyDepartments } from '../data/facultyDirectory';

const deptIcons: Record<string, typeof GraduationCap> = {
  'Computer Science': Microscope,
  'Mathematics & Statistics': BookOpen,
  'Rawls College of Business': Building2,
  'Physics': Microscope,
  'English': BookOpen,
  'University Library': BookOpen,
};

export default function FacultyDirectory() {
  const navigate = useNavigate();
  const { data: faculty = [], isLoading } = useFaculty();
  const { data: buildings = [] } = useBuildings();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState<string | null>(null);
  const [selectedFaculty, setSelectedFaculty] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  // Faculty issue reporting states
  const [reportFacultyId, setReportFacultyId] = useState<string | null>(null);
  const [facultyIssueText, setFacultyIssueText] = useState('');
  const [facultyContactInfo, setFacultyContactInfo] = useState('');
  const [facultySubmitting, setFacultySubmitting] = useState(false);
  const [facultySubmitSuccess, setFacultySubmitSuccess] = useState(false);

  const handleSubmitFacultyIssue = async (fId: string) => {
    if (!facultyIssueText.trim()) return;
    setFacultySubmitting(true);
    try {
      const response = await fetch('https://lumisync-backend-production.up.railway.app/api/v1/issues', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          entity_type: 'faculty',
          entity_id: fId,
          issue_description: facultyIssueText,
          reporter_contact: facultyContactInfo
        })
      });
      if (response.ok) {
        setFacultySubmitSuccess(true);
        setFacultyIssueText('');
        setFacultyContactInfo('');
        setTimeout(() => {
          setFacultySubmitSuccess(false);
          setReportFacultyId(null);
        }, 3000);
      }
    } catch (err) {
      console.error('Failed to submit faculty issue:', err);
    } finally {
      setFacultySubmitting(false);
    }
  };

  const departments = useMemo(() => {
    const depts = new Set<string>();
    faculty.forEach((f) => {
      if (f.department) {
        depts.add(f.department);
      }
    });
    // Fallback if empty
    return depts.size > 0 ? Array.from(depts).sort() : facultyDepartments;
  }, [faculty]);

  // Filter faculty
  const filteredFaculty = useMemo(() => {
    let filtered = faculty;
    if (selectedDept) {
      filtered = filtered.filter((f) => f.department === selectedDept);
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (f) =>
          f.fullName.toLowerCase().includes(q) ||
          f.department.toLowerCase().includes(q) ||
          f.position.toLowerCase().includes(q) ||
          f.researchInterests?.some((r) => r.toLowerCase().includes(q))
      );
    }
    return filtered;
  }, [faculty, selectedDept, searchQuery]);

  const selectedFacultyMember = faculty.find((f) => f.id === selectedFaculty);
  const officeBuilding = selectedFacultyMember?.officeBuildingId
    ? buildings.find((b) => b.id === selectedFacultyMember.officeBuildingId)
    : null;

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-3 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-background">
      {/* Header */}
      <div className="shrink-0 px-4 pt-4 pb-3 bg-background z-10">
        <h1 className="text-2xl font-bold mb-3">Faculty Directory</h1>

        {/* Search */}
        <div className="flex gap-2 mb-3">
          <div className="flex-1 flex items-center bg-muted rounded-xl px-3 h-11">
            <Search size={18} className="text-muted-foreground shrink-0" />
            <input
              type="text"
              placeholder="Search by name, department, research..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 ml-2.5 bg-transparent outline-none text-sm placeholder:text-muted-foreground"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')}>
                <X size={16} className="text-muted-foreground" />
              </button>
            )}
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`w-11 h-11 rounded-xl flex items-center justify-center transition-colors ${
              selectedDept ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
            }`}
          >
            <Filter size={18} />
          </button>
        </div>

        {/* Department Filters */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="flex flex-wrap gap-1.5 pb-3">
                <button
                  onClick={() => setSelectedDept(null)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                    !selectedDept ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                  }`}
                >
                  All Departments
                </button>
                {departments.map((dept) => (
                  <button
                    key={dept}
                    onClick={() => setSelectedDept(selectedDept === dept ? null : dept)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                      selectedDept === dept ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    {dept}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results count */}
        <div className="text-xs text-muted-foreground">
          {filteredFaculty.length} faculty member{filteredFaculty.length !== 1 ? 's' : ''}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-4 pb-4">
        {/* Faculty List */}
        <div className="space-y-3">
          {filteredFaculty.map((f, i) => {
            const Icon = deptIcons[f.department] || GraduationCap;
            const isSelected = selectedFaculty === f.id;
            return (
              <motion.div
                key={f.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
                onClick={() => setSelectedFaculty(isSelected ? null : f.id)}
                className={`bg-card rounded-2xl border overflow-hidden transition-all cursor-pointer ${
                  isSelected ? 'border-primary shadow-md' : 'border-border'
                }`}
              >
                {/* Card Header */}
                <div className="p-4 flex items-start gap-3">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                    <Icon size={22} className="text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-sm truncate">{f.fullName}</h3>
                    <p className="text-xs text-muted-foreground truncate">{f.position}</p>
                    <p className="text-xs text-primary truncate">{f.department}</p>
                  </div>
                  <ChevronRight
                    size={18}
                    className={`text-muted-foreground shrink-0 transition-transform ${isSelected ? 'rotate-90' : ''}`}
                  />
                </div>

                {/* Expanded Details */}
                <AnimatePresence>
                  {isSelected && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="px-4 pb-4 border-t border-border pt-3">
                        {/* Contact Info */}
                        <div className="space-y-2 mb-3">
                          {f.email && (
                            <div className="flex items-center gap-2 text-sm">
                              <Mail size={14} className="text-muted-foreground shrink-0" />
                              <span className="text-muted-foreground">{f.email}</span>
                            </div>
                          )}
                          {f.officePhone && (
                            <div className="flex items-center gap-2 text-sm">
                              <Phone size={14} className="text-muted-foreground shrink-0" />
                              <span className="text-muted-foreground">{f.officePhone}</span>
                            </div>
                          )}
                          {f.officeBuildingId && officeBuilding && (
                            <div className="flex items-center gap-2 text-sm">
                              <MapPin size={14} className="text-muted-foreground shrink-0" />
                              <span className="text-muted-foreground">
                                {officeBuilding.name} {f.officeRoom && `Room ${f.officeRoom}`}
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Research Interests */}
                        {f.researchInterests && f.researchInterests.length > 0 && (
                          <div className="mb-3">
                            <h4 className="text-xs font-semibold mb-1.5 text-muted-foreground uppercase tracking-wider">
                              Research Interests
                            </h4>
                            <div className="flex flex-wrap gap-1.5">
                              {f.researchInterests.map((interest) => (
                                <span
                                  key={interest}
                                  className="px-2 py-0.5 bg-primary/10 text-primary rounded-md text-xs"
                                >
                                  {interest}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Biography */}
                        {f.biography && (
                          <p className="text-xs text-muted-foreground leading-relaxed mb-3">
                            {f.biography}
                          </p>
                        )}

                        {/* Courses */}
                        {f.coursesTaught && f.coursesTaught.length > 0 && (
                          <div className="mb-3">
                            <h4 className="text-xs font-semibold mb-1.5 text-muted-foreground uppercase tracking-wider">
                              Courses
                            </h4>
                            <div className="space-y-1">
                              {f.coursesTaught.map((course) => (
                                <div key={course} className="text-xs text-muted-foreground flex items-center gap-1.5">
                                  <BookOpen size={12} />
                                  {course}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Actions */}
                        <div className="flex gap-2 mt-3">
                          {f.website && (
                            <a
                              href={f.website}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex-1 py-2.5 bg-primary text-primary-foreground rounded-xl font-medium text-xs flex items-center justify-center gap-1.5 hover:bg-primary/90 transition-colors"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <ExternalLink size={14} />
                              Faculty Page
                            </a>
                          )}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate('/map');
                            }}
                            className="flex-1 py-2.5 bg-muted text-foreground rounded-xl font-medium text-xs flex items-center justify-center gap-1.5 hover:bg-muted/80 transition-colors"
                          >
                            <MapPin size={14} />
                            View on Map
                          </button>
                        </div>

                        {/* Data Source */}
                        <div className="flex justify-center mt-2">
                          <span className="text-[10px] text-muted-foreground/50 uppercase tracking-wider">
                            {f.dataSource === 'official-directory' ? 'Official Public Directory' : f.dataSource}
                          </span>
                        </div>

                        {/* Report Issue Button/Form */}
                        <div className="mt-3 border-t border-border/50 pt-2.5">
                          {reportFacultyId === f.id ? (
                            <div className="space-y-2 bg-muted/40 p-2.5 rounded-xl border border-border mt-1">
                              {facultySubmitSuccess ? (
                                <div className="text-[11px] font-bold text-emerald-500 flex items-center justify-center gap-1.5 py-1">
                                  <Check size={13} /> Saved! Thank you for the correction.
                                </div>
                              ) : (
                                <>
                                  <span className="block text-[9px] font-bold uppercase text-muted-foreground">Report Info Discrepancy</span>
                                  <textarea
                                    placeholder="Explain what is incorrect (e.g. office moved to Room 302, incorrect email)."
                                    value={facultyIssueText}
                                    onChange={(e) => setFacultyIssueText(e.target.value)}
                                    className="w-full bg-muted border border-border rounded-lg p-2 text-xs outline-none focus:border-primary resize-none h-14 text-foreground"
                                    onClick={(e) => e.stopPropagation()}
                                  />
                                  <div className="flex gap-1.5">
                                    <input
                                      type="text"
                                      placeholder="Contact (Optional)"
                                      value={facultyContactInfo}
                                      onChange={(e) => setFacultyContactInfo(e.target.value)}
                                      className="flex-1 bg-muted border border-border rounded-lg px-2 py-1 text-[11px] outline-none focus:border-primary text-foreground"
                                      onClick={(e) => e.stopPropagation()}
                                    />
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleSubmitFacultyIssue(f.id);
                                      }}
                                      disabled={facultySubmitting || !facultyIssueText.trim()}
                                      className="bg-primary text-primary-foreground font-bold text-[10px] px-3 py-1 rounded-lg disabled:opacity-50"
                                    >
                                      Submit
                                    </button>
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setReportFacultyId(null);
                                      }}
                                      className="bg-muted text-muted-foreground font-bold text-[10px] px-2 py-1 rounded-lg border"
                                    >
                                      Cancel
                                    </button>
                                  </div>
                                </>
                              )}
                            </div>
                          ) : (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setReportFacultyId(f.id);
                              }}
                              className="text-[10px] text-muted-foreground/60 hover:text-primary font-medium hover:underline block mx-auto mt-1"
                            >
                              Report incorrect information
                            </button>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>

        {filteredFaculty.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
            <User size={48} className="mb-3 opacity-30" />
            <p className="text-sm font-medium">No faculty found</p>
            <p className="text-xs mt-1">Try adjusting your search or filters</p>
          </div>
        )}
      </div>
    </div>
  );
}
