import React from "react";

export type CVData = {
  templateId?: "modern" | "executive" | "minimalist";
  personal: {
    fullName: string;
    email: string;
    phone: string;
    location: string;
    linkedin: string;
  };
  objective: string;
  education: Array<{
    id: string;
    institution: string;
    degree: string;
    year: string;
    gpa: string;
  }>;
  experience: Array<{
    id: string;
    company: string;
    role: string;
    startDate: string;
    endDate: string;
    description: string;
  }>;
  skills: string;
  certifications: string;
  referees: Array<{
    id: string;
    name: string;
    position: string;
    contact: string;
    organization: string;
  }>;
};

interface CVTemplateProps {
  data: CVData;
  isPremium?: boolean;
}

/* ── Watermark (shared) ───────────────────────────────────────── */
function Watermark({ isPremium, uppercase = false }: { isPremium: boolean; uppercase?: boolean }) {
  if (isPremium) return null;
  return (
    <div className="absolute bottom-4 left-0 right-0 text-center opacity-40 select-none pointer-events-none">
      <span className={`text-xs font-bold tracking-widest text-slate-400 ${uppercase ? "uppercase" : ""}`}>
        Made with JengaCV
      </span>
    </div>
  );
}

/* ── Modern: section label = small square bullet + eyebrow + trailing hairline ── */
function ModernHeading({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2.5 mb-3.5">
      <span className="w-1.5 h-1.5 rounded-[2px] bg-green-600 shrink-0" />
      <h2 className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500 whitespace-nowrap">{children}</h2>
      <span className="flex-1 h-px bg-slate-200" />
    </div>
  );
}

/* ── Executive: small-caps label + full hairline in navy ── */
function ExecutiveHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-[13px] font-bold uppercase tracking-[0.22em] text-[#1c3350] mb-3 pb-2 border-b border-[#1c3350]/25">
      {children}
    </h2>
  );
}

/* ── Minimalist: quiet uppercase label, no rule (restraint is the signature) ── */
function MinimalistHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-400 mb-3">{children}</h2>
  );
}

export const CVTemplate = React.forwardRef<HTMLDivElement, CVTemplateProps>(({ data, isPremium = false }, ref) => {
  const templateId = data.templateId || "modern";

  const initials = (data.personal.fullName || "")
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join("");

  /* ══════════════════════════════ EXECUTIVE ══════════════════════════════ */
  if (templateId === "executive") {
    return (
      <div
        ref={ref}
        className="bg-white text-[#1a1a1a] p-12 font-serif relative"
        style={{ width: "100%", minHeight: "100%", maxWidth: "210mm", margin: "0 auto" }}
      >
        {/* Corner monogram — a quiet letterhead touch */}
        {initials && (
          <div className="absolute top-10 right-12 w-11 h-11 rounded-full border border-[#1c3350]/40 flex items-center justify-center">
            <span className="text-[11px] font-bold tracking-widest text-[#1c3350]">{initials}</span>
          </div>
        )}

        <div className="mb-9">
          <h1 className="text-[34px] font-bold uppercase tracking-[0.12em] text-[#1a1a1a] mb-3 leading-tight">
            {data.personal.fullName || "Your Name"}
          </h1>
          {/* Double rule — a letterhead device */}
          <div className="h-[2.5px] bg-[#1c3350] mb-[3px]" />
          <div className="h-px bg-[#1c3350]/40 mb-4" />
          <div className="text-[13px] flex flex-wrap gap-x-3 gap-y-1 text-[#3a3a3a] tracking-wide">
            {data.personal.phone && <span>{data.personal.phone}</span>}
            {data.personal.phone && data.personal.email && <span className="text-[#1c3350]/50">·</span>}
            {data.personal.email && <span>{data.personal.email}</span>}
            {(data.personal.phone || data.personal.email) && data.personal.location && <span className="text-[#1c3350]/50">·</span>}
            {data.personal.location && <span>{data.personal.location}</span>}
            {data.personal.linkedin && <span className="text-[#1c3350]/50">·</span>}
            {data.personal.linkedin && <span>{data.personal.linkedin}</span>}
          </div>
        </div>

        {data.objective && (
          <div className="mb-7">
            <ExecutiveHeading>Professional Summary</ExecutiveHeading>
            <p className="text-[13.5px] leading-[1.7] text-[#2a2a2a]">{data.objective}</p>
          </div>
        )}

        {data.experience.length > 0 && (
          <div className="mb-7">
            <ExecutiveHeading>Professional Experience</ExecutiveHeading>
            <div className="space-y-5">
              {data.experience.map((exp) => (
                <div key={exp.id}>
                  <div className="flex justify-between items-baseline gap-4 mb-0.5">
                    <h3 className="font-bold text-[16px] text-[#1a1a1a]">{exp.role}</h3>
                    <span className="text-[11.5px] font-medium text-[#1c3350] tabular-nums whitespace-nowrap tracking-wide">
                      {exp.startDate} – {exp.endDate || "Present"}
                    </span>
                  </div>
                  <div className="font-semibold text-[13px] text-[#3a3a3a] italic mb-2">{exp.company}</div>
                  <div className="text-[13px] text-[#2a2a2a] whitespace-pre-wrap leading-[1.65] ml-0.5">
                    {exp.description}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {data.education.length > 0 && (
          <div className="mb-7">
            <ExecutiveHeading>Education</ExecutiveHeading>
            <div className="space-y-3.5">
              {data.education.map((edu) => (
                <div key={edu.id}>
                  <div className="flex justify-between items-baseline gap-4 mb-0.5">
                    <h3 className="font-bold text-[14px] text-[#1a1a1a]">{edu.institution}</h3>
                    <span className="text-[11.5px] font-medium text-[#1c3350] tabular-nums whitespace-nowrap tracking-wide">{edu.year}</span>
                  </div>
                  <div className="text-[13px] text-[#3a3a3a]">
                    {edu.degree} {edu.gpa && <span className="text-[#6b6b6b]">· GPA {edu.gpa}</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {data.skills && (
          <div className="mb-7">
            <ExecutiveHeading>Core Competencies</ExecutiveHeading>
            <p className="text-[13.5px] leading-[1.7] text-[#2a2a2a]">{data.skills}</p>
          </div>
        )}

        {data.certifications && (
          <div className="mb-7">
            <ExecutiveHeading>Certifications</ExecutiveHeading>
            <p className="text-[13.5px] leading-[1.7] text-[#2a2a2a] whitespace-pre-wrap">{data.certifications}</p>
          </div>
        )}

        {data.referees.length > 0 && (
          <div className="mb-2">
            <ExecutiveHeading>References</ExecutiveHeading>
            <div className="grid grid-cols-2 gap-x-8 gap-y-4">
              {data.referees.map((ref, idx) => (
                <div key={ref.id || idx} className="text-[13px]">
                  <div className="font-bold text-[#1a1a1a]">{ref.name}</div>
                  <div className="italic text-[#3a3a3a]">{ref.position}</div>
                  <div className="text-[#3a3a3a]">{ref.organization}</div>
                  <div className="text-[#3a3a3a]">{ref.contact}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        <Watermark isPremium={isPremium} />
      </div>
    );
  }

  /* ══════════════════════════════ MINIMALIST ══════════════════════════════ */
  if (templateId === "minimalist") {
    return (
      <div
        ref={ref}
        className="bg-white text-slate-800 p-12 font-sans relative"
        style={{ width: "100%", minHeight: "100%", maxWidth: "210mm", margin: "0 auto" }}
      >
        {/* Masthead — name left, contact right, quiet short rule beneath */}
        <div className="flex items-start justify-between gap-8 mb-10">
          <div>
            <h1 className="text-[32px] font-light tracking-tight text-slate-900 mb-2.5 leading-none">
              {data.personal.fullName || "Your Name"}
            </h1>
            <div className="w-10 h-px bg-slate-900" />
          </div>
          <div className="text-[12px] flex flex-col items-end gap-1 text-slate-400 pt-1.5 text-right shrink-0">
            {data.personal.email && <span>{data.personal.email}</span>}
            {data.personal.phone && <span>{data.personal.phone}</span>}
            {data.personal.location && <span>{data.personal.location}</span>}
            {data.personal.linkedin && <span>{data.personal.linkedin}</span>}
          </div>
        </div>

        <div className="grid grid-cols-12 gap-10">
          <div className="col-span-4 border-r border-slate-100 pr-8">
            {data.skills && (
              <div className="mb-9">
                <MinimalistHeading>Skills</MinimalistHeading>
                <p className="text-[13px] leading-relaxed text-slate-600">{data.skills}</p>
              </div>
            )}
            {data.education.length > 0 && (
              <div className="mb-9">
                <MinimalistHeading>Education</MinimalistHeading>
                <div className="space-y-4">
                  {data.education.map((edu) => (
                    <div key={edu.id}>
                      <div className="text-[13px] font-medium text-slate-900 leading-snug">{edu.degree}</div>
                      <div className="text-[13px] text-slate-500 leading-snug">{edu.institution}</div>
                      <div className="text-[11px] text-slate-400 mt-1 tabular-nums">{edu.year}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {data.certifications && (
              <div className="mb-9">
                <MinimalistHeading>Certifications</MinimalistHeading>
                <p className="text-[13px] leading-relaxed text-slate-600 whitespace-pre-wrap">{data.certifications}</p>
              </div>
            )}
          </div>

          <div className="col-span-8">
            {data.objective && (
              <div className="mb-9">
                <MinimalistHeading>Profile</MinimalistHeading>
                <p className="text-[13.5px] leading-relaxed text-slate-600">{data.objective}</p>
              </div>
            )}

            {data.experience.length > 0 && (
              <div className="mb-9">
                <MinimalistHeading>Experience</MinimalistHeading>
                <div className="space-y-6">
                  {data.experience.map((exp) => (
                    <div key={exp.id}>
                      <div className="flex justify-between items-baseline gap-3 mb-1">
                        <h3 className="font-medium text-[14.5px] text-slate-900">{exp.role}</h3>
                        <span className="text-[11px] text-slate-400 tabular-nums whitespace-nowrap">
                          {exp.startDate} – {exp.endDate || "Present"}
                        </span>
                      </div>
                      <div className="text-[13px] text-slate-400 mb-2">{exp.company}</div>
                      <div className="text-[13.5px] text-slate-600 whitespace-pre-wrap leading-relaxed">
                        {exp.description}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {data.referees.length > 0 && (
              <div className="mb-9">
                <MinimalistHeading>References</MinimalistHeading>
                <div className="grid grid-cols-2 gap-4">
                  {data.referees.map((ref, idx) => (
                    <div key={ref.id || idx} className="text-[13px]">
                      <div className="font-medium text-slate-900">{ref.name}</div>
                      <div className="text-slate-500">{ref.position} · {ref.organization}</div>
                      <div className="text-slate-500">{ref.contact}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <Watermark isPremium={isPremium} uppercase />
      </div>
    );
  }

  /* ══════════════════════════════ MODERN (default) ══════════════════════════════ */
  return (
    <div
      ref={ref}
      className="bg-white text-black min-h-full font-sans relative border-l-[6px] border-green-600"
      style={{ width: "100%", minHeight: "100%", maxWidth: "210mm", margin: "0 auto" }}
    >
      <div className="pl-9 pr-11 py-11">
        <div className="mb-7">
          <h1 className="text-[32px] font-bold tracking-tight text-slate-900 mb-2 leading-tight">
            {data.personal.fullName || "Your Name"}
          </h1>
          <div className="text-[13px] flex flex-wrap gap-x-2 gap-y-1 text-slate-500">
            {data.personal.phone && <span>{data.personal.phone}</span>}
            {data.personal.phone && data.personal.email && <span className="text-green-600">•</span>}
            {data.personal.email && <span>{data.personal.email}</span>}
            {(data.personal.phone || data.personal.email) && data.personal.location && <span className="text-green-600">•</span>}
            {data.personal.location && <span>{data.personal.location}</span>}
            {data.personal.linkedin && <span className="text-green-600">•</span>}
            {data.personal.linkedin && <span>{data.personal.linkedin}</span>}
          </div>
        </div>

        {data.objective && (
          <div className="mb-6">
            <ModernHeading>Professional Summary</ModernHeading>
            <p className="text-[13.5px] leading-relaxed text-slate-700">{data.objective}</p>
          </div>
        )}

        {data.experience.length > 0 && (
          <div className="mb-6">
            <ModernHeading>Work Experience</ModernHeading>
            <div className="space-y-6">
              {data.experience.map((exp) => (
                <div key={exp.id} className="relative pl-5 border-l-2 border-green-200">
                  <div className="absolute w-2 h-2 bg-green-600 rounded-full -left-[5px] top-1.5" />
                  <div className="flex justify-between items-baseline gap-3 mb-1">
                    <h3 className="font-bold text-[15px] text-slate-900">{exp.role}</h3>
                    <span className="text-[11.5px] font-semibold text-green-700 bg-green-50 px-2 py-0.5 rounded tabular-nums whitespace-nowrap">
                      {exp.startDate} – {exp.endDate || "Present"}
                    </span>
                  </div>
                  <div className="font-medium text-[13px] text-slate-500 mb-2">{exp.company}</div>
                  <div className="text-[13.5px] text-slate-700 whitespace-pre-wrap leading-relaxed">
                    {exp.description}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {data.education.length > 0 && (
          <div className="mb-6">
            <ModernHeading>Education</ModernHeading>
            <div className="space-y-4">
              {data.education.map((edu) => (
                <div key={edu.id}>
                  <div className="flex justify-between items-baseline gap-3 mb-0.5">
                    <h3 className="font-bold text-[14px] text-slate-900">{edu.institution}</h3>
                    <span className="text-[11.5px] font-semibold text-green-700 tabular-nums whitespace-nowrap">{edu.year}</span>
                  </div>
                  <div className="text-[13px] text-slate-700">
                    {edu.degree} {edu.gpa && <span className="text-slate-400">· GPA {edu.gpa}</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 gap-8 mb-6">
          {data.skills && (
            <div>
              <ModernHeading>Skills</ModernHeading>
              <p className="text-[13.5px] leading-relaxed text-slate-700">{data.skills}</p>
            </div>
          )}

          {data.certifications && (
            <div>
              <ModernHeading>Certifications</ModernHeading>
              <p className="text-[13.5px] leading-relaxed text-slate-700 whitespace-pre-wrap">{data.certifications}</p>
            </div>
          )}
        </div>

        {data.referees.length > 0 && (
          <div className="mb-2">
            <ModernHeading>Referees</ModernHeading>
            <div className="grid grid-cols-2 gap-4">
              {data.referees.map((ref, idx) => (
                <div key={ref.id || idx} className="text-[13px]">
                  <div className="font-bold text-slate-900">{ref.name}</div>
                  <div className="text-slate-500">{ref.position}</div>
                  <div className="text-slate-500">{ref.organization}</div>
                  <div className="text-slate-500">{ref.contact}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <Watermark isPremium={isPremium} />
    </div>
  );
});

CVTemplate.displayName = "CVTemplate";
