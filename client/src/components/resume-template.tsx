import React from 'react';
import { Resume } from '@/hooks/use-resume-data';
import { Button } from "@/components/ui/modern-button";
import { Download, Mail, Phone, Globe, MapPin } from 'lucide-react';

interface ResumeTemplateProps {
  resume: Resume;
  onDownload?: () => void;
}

/**
 * Modern styled resume template component for displaying the formatted resume
 */
export default function ResumeTemplate({ resume, onDownload }: ResumeTemplateProps) {
  const { personalInfo, experience, education, skills, projects } = resume;

  // Function to strip HTML tags for plain text representation
  const stripHtml = (html: string) => {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    return doc.body.textContent || '';
  };

  return (
    <div className="relative bg-card border border-border rounded-lg overflow-hidden shadow-sm">
      {/* Template header with download button */}
      <div className="p-4 border-b border-border flex justify-between items-center bg-muted/30">
        <h3 className="font-medium text-foreground">Resume Preview</h3>
        {onDownload && (
          <Button
            variant="outline"
            size="sm"
            onClick={onDownload}
            iconLeft={<Download className="h-4 w-4" />}
          >
            Download
          </Button>
        )}
      </div>

      {/* Resume content */}
      <div className="p-6 space-y-6 bg-white text-black">
        {/* Personal information section */}
        <header className="border-b border-gray-200 pb-4">
          <h1 className="text-2xl font-bold mb-1">
            {personalInfo?.firstName} {personalInfo?.lastName}
          </h1>
          <p className="text-gray-700 mb-2">{personalInfo?.headline}</p>
          
          <div className="flex flex-wrap gap-3 text-sm text-gray-600">
            {personalInfo?.email && (
              <div className="flex items-center">
                <Mail className="h-4 w-4 mr-1" />
                <span>{personalInfo.email}</span>
              </div>
            )}
            
            {personalInfo?.phone && (
              <div className="flex items-center">
                <Phone className="h-4 w-4 mr-1" />
                <span>{personalInfo.phone}</span>
              </div>
            )}
          </div>
          
          {personalInfo?.summary && (
            <p className="mt-3 text-sm leading-relaxed">
              {stripHtml(personalInfo.summary)}
            </p>
          )}
        </header>

        {/* Experience section */}
        {experience && experience.length > 0 && (
          <section className="space-y-4">
            <h2 className="text-lg font-bold border-b border-gray-200 pb-1">Experience</h2>
            {experience.map((exp) => (
              <div key={exp.id} className="space-y-1">
                <div className="flex justify-between items-start">
                  <h3 className="font-bold">{exp.title}</h3>
                  <span className="text-sm text-gray-600">{exp.startDate} - {exp.endDate}</span>
                </div>
                <div className="text-sm font-medium text-gray-700">{exp.company}</div>
                <p className="text-sm">{stripHtml(exp.description)}</p>
              </div>
            ))}
          </section>
        )}

        {/* Education section */}
        {education && education.length > 0 && (
          <section className="space-y-4">
            <h2 className="text-lg font-bold border-b border-gray-200 pb-1">Education</h2>
            {education.map((edu) => (
              <div key={edu.id} className="space-y-1">
                <div className="flex justify-between items-start">
                  <h3 className="font-bold">{edu.degree}</h3>
                  <span className="text-sm text-gray-600">{edu.startDate} - {edu.endDate}</span>
                </div>
                <div className="text-sm font-medium text-gray-700">{edu.institution}</div>
                <p className="text-sm">{stripHtml(edu.description)}</p>
              </div>
            ))}
          </section>
        )}

        {/* Skills section */}
        {skills && skills.length > 0 && (
          <section className="space-y-2">
            <h2 className="text-lg font-bold border-b border-gray-200 pb-1">Skills</h2>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill) => (
                <span 
                  key={skill.id} 
                  className="px-2 py-1 bg-gray-100 text-gray-800 text-sm rounded-md"
                >
                  {skill.name}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* Projects section */}
        {projects && projects.length > 0 && (
          <section className="space-y-4">
            <h2 className="text-lg font-bold border-b border-gray-200 pb-1">Projects</h2>
            {projects.map((project) => (
              <div key={project.id} className="space-y-1">
                <h3 className="font-bold">{project.title}</h3>
                {project.technologies && project.technologies.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-1">
                    {project.technologies.map((tech, index) => (
                      <span 
                        key={index} 
                        className="px-1.5 py-0.5 bg-gray-100 text-gray-700 text-xs rounded"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                )}
                <p className="text-sm">{stripHtml(project.description)}</p>
                {project.link && (
                  <a 
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer" 
                    className="text-sm text-blue-600 hover:underline inline-flex items-center"
                  >
                    <Globe className="h-3 w-3 mr-1" />
                    View Project
                  </a>
                )}
              </div>
            ))}
          </section>
        )}
      </div>
    </div>
  );
}