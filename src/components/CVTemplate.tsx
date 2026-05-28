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
}

export const CVTemplate = React.forwardRef<HTMLDivElement, CVTemplateProps>(({ data }, ref) => {
  const templateId = data.templateId || "modern";

  if (templateId === "executive") {
    return (
      <div ref={ref} className="bg-white text-black p-12 font-serif" style={{ width: '100%', minHeight: '100%', maxWidth: '210mm', margin: '0 auto' }}>
        <div className="text-center mb-8 border-b-2 border-slate-900 pb-6">
          <h1 className="text-4xl font-bold uppercase tracking-widest text-slate-900 mb-3">{data.personal.fullName || "Your Name"}</h1>
          <div className="text-sm flex flex-wrap justify-center gap-3 text-slate-700">
            {data.personal.phone && <span>{data.personal.phone}</span>}
            {data.personal.phone && data.personal.email && <span>•</span>}
            {data.personal.email && <span>{data.personal.email}</span>}
            {(data.personal.phone || data.personal.email) && data.personal.location && <span>•</span>}
            {data.personal.location && <span>{data.personal.location}</span>}
            {data.personal.linkedin && <span>•</span>}
            {data.personal.linkedin && <span>{data.personal.linkedin}</span>}
          </div>
        </div>

        {data.objective && (
          <div className="mb-6">
            <h2 className="text-xl font-bold uppercase text-slate-900 mb-2">Professional Summary</h2>
            <p className="text-sm leading-relaxed">{data.objective}</p>
          </div>
        )}

        {data.experience.length > 0 && (
          <div className="mb-6">
            <h2 className="text-xl font-bold uppercase text-slate-900 mb-4 border-b border-slate-300 pb-1">Professional Experience</h2>
            <div className="space-y-5">
              {data.experience.map((exp) => (
                <div key={exp.id}>
                  <div className="flex justify-between items-baseline mb-1">
                    <h3 className="font-bold text-lg text-slate-900">{exp.role}</h3>
                    <span className="text-sm font-medium text-slate-700">{exp.startDate} - {exp.endDate || "Present"}</span>
                  </div>
                  <div className="font-bold text-sm text-slate-800 mb-2 italic">{exp.company}</div>
                  <div className="text-sm text-slate-800 whitespace-pre-wrap leading-relaxed ml-4">
                    {exp.description}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {data.education.length > 0 && (
          <div className="mb-6">
            <h2 className="text-xl font-bold uppercase text-slate-900 mb-4 border-b border-slate-300 pb-1">Education</h2>
            <div className="space-y-4">
              {data.education.map((edu) => (
                <div key={edu.id}>
                  <div className="flex justify-between items-baseline mb-1">
                    <h3 className="font-bold text-md text-slate-900">{edu.institution}</h3>
                    <span className="text-sm font-medium text-slate-700">{edu.year}</span>
                  </div>
                  <div className="text-sm text-slate-800">
                    {edu.degree} {edu.gpa && <span className="text-slate-600">| GPA: {edu.gpa}</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {data.skills && (
          <div className="mb-6">
            <h2 className="text-xl font-bold uppercase text-slate-900 mb-3 border-b border-slate-300 pb-1">Core Competencies</h2>
            <p className="text-sm leading-relaxed">{data.skills}</p>
          </div>
        )}

        {data.certifications && (
          <div className="mb-6">
            <h2 className="text-xl font-bold uppercase text-slate-900 mb-3 border-b border-slate-300 pb-1">Certifications</h2>
            <p className="text-sm leading-relaxed whitespace-pre-wrap">{data.certifications}</p>
          </div>
        )}

        {data.referees.length > 0 && (
          <div className="mb-6">
            <h2 className="text-xl font-bold uppercase text-slate-900 mb-4 border-b border-slate-300 pb-1">References</h2>
            <div className="grid grid-cols-2 gap-6">
              {data.referees.map((ref, idx) => (
                <div key={ref.id || idx} className="text-sm">
                  <div className="font-bold text-slate-900">{ref.name}</div>
                  <div className="italic text-slate-700">{ref.position}</div>
                  <div className="text-slate-800">{ref.organization}</div>
                  <div className="text-slate-800">{ref.contact}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  if (templateId === "minimalist") {
    return (
      <div ref={ref} className="bg-white text-slate-800 p-12 font-sans" style={{ width: '100%', minHeight: '100%', maxWidth: '210mm', margin: '0 auto' }}>
        <div className="mb-10">
          <h1 className="text-4xl font-light tracking-tight text-slate-900 mb-4">{data.personal.fullName || "Your Name"}</h1>
          <div className="text-sm flex flex-col gap-1 text-slate-500">
            {data.personal.phone && <span>{data.personal.phone}</span>}
            {data.personal.email && <span>{data.personal.email}</span>}
            {data.personal.location && <span>{data.personal.location}</span>}
            {data.personal.linkedin && <span>{data.personal.linkedin}</span>}
          </div>
        </div>

        <div className="grid grid-cols-12 gap-8">
          <div className="col-span-4">
            {data.skills && (
              <div className="mb-8">
                <h2 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-3">Skills</h2>
                <p className="text-sm leading-relaxed text-slate-700">{data.skills}</p>
              </div>
            )}
            {data.education.length > 0 && (
              <div className="mb-8">
                <h2 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-3">Education</h2>
                <div className="space-y-4">
                  {data.education.map((edu) => (
                    <div key={edu.id}>
                      <div className="text-sm font-medium text-slate-900">{edu.degree}</div>
                      <div className="text-sm text-slate-600">{edu.institution}</div>
                      <div className="text-xs text-slate-400 mt-1">{edu.year}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {data.certifications && (
              <div className="mb-8">
                <h2 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-3">Certifications</h2>
                <p className="text-sm leading-relaxed text-slate-700 whitespace-pre-wrap">{data.certifications}</p>
              </div>
            )}
          </div>

          <div className="col-span-8">
            {data.objective && (
              <div className="mb-8">
                <h2 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-3">Profile</h2>
                <p className="text-sm leading-relaxed text-slate-700">{data.objective}</p>
              </div>
            )}

            {data.experience.length > 0 && (
              <div className="mb-8">
                <h2 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-4">Experience</h2>
                <div className="space-y-6">
                  {data.experience.map((exp) => (
                    <div key={exp.id}>
                      <div className="flex justify-between items-baseline mb-1">
                        <h3 className="font-medium text-base text-slate-900">{exp.role}</h3>
                        <span className="text-xs text-slate-400">{exp.startDate} - {exp.endDate || "Present"}</span>
                      </div>
                      <div className="text-sm text-slate-500 mb-2">{exp.company}</div>
                      <div className="text-sm text-slate-700 whitespace-pre-wrap leading-relaxed">
                        {exp.description}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {data.referees.length > 0 && (
              <div className="mb-8">
                <h2 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-4">References</h2>
                <div className="grid grid-cols-2 gap-4">
                  {data.referees.map((ref, idx) => (
                    <div key={ref.id || idx} className="text-sm">
                      <div className="font-medium text-slate-900">{ref.name}</div>
                      <div className="text-slate-500">{ref.position} • {ref.organization}</div>
                      <div className="text-slate-500">{ref.contact}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // default: modern
  return (
    <div ref={ref} className="bg-white text-black p-10 font-sans" style={{ width: '100%', minHeight: '100%', maxWidth: '210mm', margin: '0 auto' }}>
      <div className="text-center mb-6 pb-4">
        <h1 className="text-4xl font-bold tracking-tight text-green-700 mb-2">{data.personal.fullName || "Your Name"}</h1>
        <div className="text-sm flex flex-wrap justify-center gap-2 text-slate-600">
          {data.personal.phone && <span>{data.personal.phone}</span>}
          {data.personal.phone && data.personal.email && <span>|</span>}
          {data.personal.email && <span>{data.personal.email}</span>}
          {(data.personal.phone || data.personal.email) && data.personal.location && <span>|</span>}
          {data.personal.location && <span>{data.personal.location}</span>}
          {data.personal.linkedin && <span>|</span>}
          {data.personal.linkedin && <span>{data.personal.linkedin}</span>}
        </div>
      </div>

      {data.objective && (
        <div className="mb-6">
          <h2 className="text-lg font-bold text-green-700 uppercase tracking-wider mb-2">Professional Summary</h2>
          <div className="w-8 h-1 bg-green-600 mb-3"></div>
          <p className="text-sm leading-relaxed text-slate-700">{data.objective}</p>
        </div>
      )}

      {data.experience.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-bold text-green-700 uppercase tracking-wider mb-2">Work Experience</h2>
          <div className="w-8 h-1 bg-green-600 mb-4"></div>
          <div className="space-y-5">
            {data.experience.map((exp) => (
              <div key={exp.id} className="relative pl-4 border-l-2 border-green-200">
                <div className="absolute w-2 h-2 bg-green-600 rounded-full -left-[5px] top-1.5"></div>
                <div className="flex justify-between items-baseline mb-1">
                  <h3 className="font-bold text-md text-slate-900">{exp.role}</h3>
                  <span className="text-sm font-semibold text-green-700 bg-green-50 px-2 py-0.5 rounded">{exp.startDate} - {exp.endDate || "Present"}</span>
                </div>
                <div className="font-medium text-sm text-slate-600 mb-2">{exp.company}</div>
                <div className="text-sm text-slate-700 whitespace-pre-wrap leading-relaxed">
                  {exp.description}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {data.education.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-bold text-green-700 uppercase tracking-wider mb-2">Education</h2>
          <div className="w-8 h-1 bg-green-600 mb-4"></div>
          <div className="space-y-4">
            {data.education.map((edu) => (
              <div key={edu.id}>
                <div className="flex justify-between items-baseline mb-1">
                  <h3 className="font-bold text-md text-slate-900">{edu.institution}</h3>
                  <span className="text-sm font-semibold text-green-700">{edu.year}</span>
                </div>
                <div className="text-sm text-slate-700">
                  {edu.degree} {edu.gpa && <span className="text-slate-400">| GPA: {edu.gpa}</span>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 gap-8 mb-6">
        {data.skills && (
          <div>
            <h2 className="text-lg font-bold text-green-700 uppercase tracking-wider mb-2">Skills</h2>
            <div className="w-8 h-1 bg-green-600 mb-3"></div>
            <p className="text-sm leading-relaxed text-slate-700">{data.skills}</p>
          </div>
        )}

        {data.certifications && (
          <div>
            <h2 className="text-lg font-bold text-green-700 uppercase tracking-wider mb-2">Certifications</h2>
            <div className="w-8 h-1 bg-green-600 mb-3"></div>
            <p className="text-sm leading-relaxed text-slate-700 whitespace-pre-wrap">{data.certifications}</p>
          </div>
        )}
      </div>

      {data.referees.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-bold text-green-700 uppercase tracking-wider mb-2">Referees</h2>
          <div className="w-8 h-1 bg-green-600 mb-4"></div>
          <div className="grid grid-cols-2 gap-4">
            {data.referees.map((ref, idx) => (
              <div key={ref.id || idx} className="text-sm">
                <div className="font-bold text-slate-900">{ref.name}</div>
                <div className="text-slate-600">{ref.position}</div>
                <div className="text-slate-600">{ref.organization}</div>
                <div className="text-slate-600">{ref.contact}</div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
});

CVTemplate.displayName = "CVTemplate";
