/**
 * Resume Templates
 * 
 * This file contains various resume template components used in the resume builder.
 * Each template has its own unique style and layout while using the same data structure.
 */
import React from "react";
import { Resume } from "@/hooks/use-resume-data";

interface ResumeTemplateProps {
  resume: Resume;
}

// Helper function to format dates for display
const formatDisplayDate = (dateString: string): string => {
  if (!dateString) return '';
  if (dateString === 'Present') return 'Present';
  
  try {
    const [year, month] = dateString.split('-');
    const date = new Date(parseInt(year), parseInt(month) - 1);
    return new Intl.DateTimeFormat('en-US', { month: 'short', year: 'numeric' }).format(date);
  } catch (error) {
    return dateString;
  }
};

/**
 * Professional Template - Clean, traditional layout with a professional appearance
 */
export function ProfessionalTemplate({ resume }: ResumeTemplateProps) {
  return (
    <div className="bg-white text-gray-800 font-sans p-6 min-h-full">
      {/* Header with Name and Contact Info */}
      <header className="mb-6 pb-4 border-b-2 border-gray-300">
        <h1 className="text-3xl font-bold text-gray-900 mb-1">
          {resume.personalInfo.firstName} {resume.personalInfo.lastName}
        </h1>
        <h2 className="text-xl text-blue-600 mb-3">{resume.personalInfo.headline}</h2>
        <div className="flex flex-wrap gap-4 text-sm">
          <div>{resume.personalInfo.email}</div>
          <div>{resume.personalInfo.phone}</div>
        </div>
      </header>
      
      {/* Summary */}
      {resume.personalInfo.summary && (
        <section className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Summary</h3>
          <p className="text-gray-700">{resume.personalInfo.summary}</p>
        </section>
      )}
      
      {/* Experience */}
      {resume.experience.length > 0 && (
        <section className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Experience</h3>
          {resume.experience.map((exp, index) => (
            <div key={exp.id} className={`mb-4 ${index !== resume.experience.length - 1 ? 'pb-4 border-b border-gray-200' : ''}`}>
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-medium text-gray-900">{exp.title}</h4>
                  <div className="text-gray-600">{exp.company}</div>
                </div>
                <div className="text-gray-500 text-sm">
                  {formatDisplayDate(exp.startDate)} - {formatDisplayDate(exp.endDate)}
                </div>
              </div>
              <p className="mt-2 text-gray-700 whitespace-pre-line">{exp.description}</p>
            </div>
          ))}
        </section>
      )}
      
      {/* Education */}
      {resume.education.length > 0 && (
        <section className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Education</h3>
          {resume.education.map((edu, index) => (
            <div key={edu.id} className={`mb-4 ${index !== resume.education.length - 1 ? 'pb-4 border-b border-gray-200' : ''}`}>
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-medium text-gray-900">{edu.degree}</h4>
                  <div className="text-gray-600">{edu.institution}</div>
                </div>
                <div className="text-gray-500 text-sm">
                  {formatDisplayDate(edu.startDate)} - {formatDisplayDate(edu.endDate)}
                </div>
              </div>
              {edu.description && (
                <p className="mt-2 text-gray-700">{edu.description}</p>
              )}
            </div>
          ))}
        </section>
      )}
      
      {/* Skills */}
      {resume.skills.length > 0 && (
        <section className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Skills</h3>
          <div className="flex flex-wrap gap-2">
            {resume.skills.map(skill => (
              <div key={skill.id} className="bg-gray-100 text-gray-800 px-3 py-1 rounded">
                {skill.name}
              </div>
            ))}
          </div>
        </section>
      )}
      
      {/* Projects */}
      {resume.projects.length > 0 && (
        <section className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Projects</h3>
          {resume.projects.map((project, index) => (
            <div key={project.id} className={`mb-4 ${index !== resume.projects.length - 1 ? 'pb-4 border-b border-gray-200' : ''}`}>
              <h4 className="font-medium text-gray-900">{project.title}</h4>
              <p className="mt-1 text-gray-700">{project.description}</p>
              {project.technologies.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1">
                  {project.technologies.map((tech, i) => (
                    <span key={i} className="text-sm text-blue-600">{tech}{i < project.technologies.length - 1 ? ', ' : ''}</span>
                  ))}
                </div>
              )}
              {project.link && (
                <a href={project.link} className="mt-1 block text-sm text-blue-600" target="_blank" rel="noopener noreferrer">
                  View Project
                </a>
              )}
            </div>
          ))}
        </section>
      )}
    </div>
  );
}

/**
 * Creative Template - Modern design for creative fields
 */
export function CreativeTemplate({ resume }: ResumeTemplateProps) {
  return (
    <div className="bg-white text-gray-800 font-sans p-6 min-h-full">
      {/* Header with colorful accent */}
      <header className="mb-6 pb-4 relative">
        <div className="absolute top-0 left-0 right-0 h-3 bg-gradient-to-r from-purple-500 via-pink-500 to-red-500"></div>
        <div className="pt-6">
          <h1 className="text-3xl font-bold mb-1 text-gray-900">
            {resume.personalInfo.firstName} {resume.personalInfo.lastName}
          </h1>
          <h2 className="text-xl text-purple-600 font-medium mb-3">{resume.personalInfo.headline}</h2>
          <div className="flex flex-wrap gap-4 text-sm">
            <div className="flex items-center gap-1">
              <span className="text-purple-500">●</span> 
              {resume.personalInfo.email}
            </div>
            <div className="flex items-center gap-1">
              <span className="text-pink-500">●</span> 
              {resume.personalInfo.phone}
            </div>
          </div>
        </div>
      </header>
      
      {/* Two-column layout for main content */}
      <div className="flex flex-col md:flex-row gap-6">
        {/* Left column */}
        <div className="md:w-1/3 space-y-6">
          {/* Summary */}
          {resume.personalInfo.summary && (
            <section>
              <h3 className="text-lg font-bold text-purple-600 mb-2 uppercase tracking-wider">About Me</h3>
              <p className="text-gray-700">{resume.personalInfo.summary}</p>
            </section>
          )}
          
          {/* Skills */}
          {resume.skills.length > 0 && (
            <section>
              <h3 className="text-lg font-bold text-purple-600 mb-3 uppercase tracking-wider">Skills</h3>
              <div className="space-y-2">
                {resume.skills.map(skill => (
                  <div key={skill.id} className="flex items-center">
                    <div className="text-gray-800 font-medium">{skill.name}</div>
                    <div className="ml-auto flex">
                      {[...Array(5)].map((_, i) => (
                        <div 
                          key={i} 
                          className={`w-2 h-2 rounded-full mx-0.5 ${
                            i < skill.proficiency 
                              ? 'bg-gradient-to-r from-purple-500 to-pink-500' 
                              : 'bg-gray-200'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
          
          {/* Education */}
          {resume.education.length > 0 && (
            <section>
              <h3 className="text-lg font-bold text-purple-600 mb-3 uppercase tracking-wider">Education</h3>
              {resume.education.map(edu => (
                <div key={edu.id} className="mb-4">
                  <h4 className="font-semibold text-gray-900">{edu.degree}</h4>
                  <div className="text-gray-600">{edu.institution}</div>
                  <div className="text-sm text-purple-500">
                    {formatDisplayDate(edu.startDate)} - {formatDisplayDate(edu.endDate)}
                  </div>
                </div>
              ))}
            </section>
          )}
        </div>
        
        {/* Right column */}
        <div className="md:w-2/3 md:border-l md:border-purple-200 md:pl-6 space-y-6">
          {/* Experience */}
          {resume.experience.length > 0 && (
            <section>
              <h3 className="text-lg font-bold text-purple-600 mb-3 uppercase tracking-wider">Experience</h3>
              {resume.experience.map(exp => (
                <div key={exp.id} className="mb-5 relative pl-4">
                  <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-gradient-to-b from-purple-500 to-pink-500"></div>
                  <h4 className="font-semibold text-gray-900">{exp.title}</h4>
                  <div className="text-gray-600">{exp.company}</div>
                  <div className="text-sm text-purple-500 mb-2">
                    {formatDisplayDate(exp.startDate)} - {formatDisplayDate(exp.endDate)}
                  </div>
                  <p className="text-gray-700 whitespace-pre-line">{exp.description}</p>
                </div>
              ))}
            </section>
          )}
          
          {/* Projects */}
          {resume.projects.length > 0 && (
            <section>
              <h3 className="text-lg font-bold text-purple-600 mb-3 uppercase tracking-wider">Projects</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {resume.projects.map(project => (
                  <div key={project.id} className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-900">{project.title}</h4>
                    <p className="mt-1 text-gray-700 text-sm">{project.description}</p>
                    {project.technologies.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {project.technologies.map((tech, i) => (
                          <span key={i} className="inline-block text-xs px-2 py-1 bg-purple-100 text-purple-600 rounded">
                            {tech}
                          </span>
                        ))}
                      </div>
                    )}
                    {project.link && (
                      <a href={project.link} className="mt-2 block text-xs text-purple-600 hover:underline" target="_blank" rel="noopener noreferrer">
                        View Project ↗
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * Executive Template - Elegant and formal template for senior professionals
 */
export function ExecutiveTemplate({ resume }: ResumeTemplateProps) {
  return (
    <div className="bg-white text-gray-800 font-serif p-6 min-h-full">
      {/* Elegant header with name and title */}
      <header className="text-center mb-8 border-b border-gray-300 pb-6">
        <h1 className="text-3xl font-bold uppercase tracking-wider text-gray-900 mb-2">
          {resume.personalInfo.firstName} {resume.personalInfo.lastName}
        </h1>
        <h2 className="text-xl text-gray-600 font-medium mb-4">{resume.personalInfo.headline}</h2>
        <div className="flex justify-center gap-6 text-sm">
          <div>{resume.personalInfo.email}</div>
          <div>{resume.personalInfo.phone}</div>
        </div>
      </header>
      
      {/* Summary */}
      {resume.personalInfo.summary && (
        <section className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-2 text-center uppercase border-b border-gray-200 pb-1">Profile</h3>
          <p className="text-gray-700 text-center leading-relaxed">{resume.personalInfo.summary}</p>
        </section>
      )}
      
      {/* Experience */}
      {resume.experience.length > 0 && (
        <section className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center uppercase border-b border-gray-200 pb-1">Professional Experience</h3>
          {resume.experience.map(exp => (
            <div key={exp.id} className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <h4 className="font-bold text-gray-900">{exp.title}</h4>
                <div className="text-gray-600 text-sm">
                  {formatDisplayDate(exp.startDate)} - {formatDisplayDate(exp.endDate)}
                </div>
              </div>
              <div className="font-semibold text-gray-700 mb-2">{exp.company}</div>
              <p className="text-gray-700 whitespace-pre-line">{exp.description}</p>
            </div>
          ))}
        </section>
      )}
      
      {/* Two-column layout for Education and Skills */}
      <div className="flex flex-col md:flex-row gap-8">
        {/* Education */}
        {resume.education.length > 0 && (
          <section className="md:w-1/2">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center uppercase border-b border-gray-200 pb-1">Education</h3>
            {resume.education.map(edu => (
              <div key={edu.id} className="mb-4">
                <h4 className="font-bold text-gray-900">{edu.degree}</h4>
                <div className="font-semibold text-gray-700">{edu.institution}</div>
                <div className="text-gray-600 text-sm">
                  {formatDisplayDate(edu.startDate)} - {formatDisplayDate(edu.endDate)}
                </div>
                {edu.description && (
                  <p className="mt-1 text-gray-700">{edu.description}</p>
                )}
              </div>
            ))}
          </section>
        )}
        
        {/* Skills */}
        {resume.skills.length > 0 && (
          <section className="md:w-1/2">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center uppercase border-b border-gray-200 pb-1">Areas of Expertise</h3>
            <div className="grid grid-cols-2 gap-x-4 gap-y-2">
              {resume.skills.map(skill => (
                <div key={skill.id} className="flex items-center">
                  <div className="w-2 h-2 bg-gray-800 rounded-full mr-2"></div>
                  <span className="text-gray-800">{skill.name}</span>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
      
      {/* Projects */}
      {resume.projects.length > 0 && (
        <section className="mt-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center uppercase border-b border-gray-200 pb-1">Notable Projects</h3>
          {resume.projects.map(project => (
            <div key={project.id} className="mb-4">
              <h4 className="font-bold text-gray-900">{project.title}</h4>
              <p className="text-gray-700">{project.description}</p>
              {project.technologies.length > 0 && (
                <div className="mt-1 text-gray-600">
                  <span className="font-semibold">Technologies: </span>
                  {project.technologies.join(', ')}
                </div>
              )}
            </div>
          ))}
        </section>
      )}
    </div>
  );
}

/**
 * Modern Template - Contemporary and clean design with accent colors
 */
export function ModernTemplate({ resume }: ResumeTemplateProps) {
  return (
    <div className="bg-white text-gray-800 font-sans p-6 min-h-full">
      {/* Modern header with sidebar */}
      <div className="flex flex-col md:flex-row gap-6">
        {/* Left sidebar */}
        <div className="md:w-1/3 bg-blue-50 rounded-lg p-5">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-1">
              {resume.personalInfo.firstName}<br/>{resume.personalInfo.lastName}
            </h1>
            <h2 className="text-lg text-blue-600 font-medium">{resume.personalInfo.headline}</h2>
          </div>
          
          <div className="space-y-1 mb-6">
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
              </svg>
              <span className="text-sm">{resume.personalInfo.email}</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
              </svg>
              <span className="text-sm">{resume.personalInfo.phone}</span>
            </div>
          </div>
          
          {/* Skills with progress bars */}
          {resume.skills.length > 0 && (
            <section className="mb-6">
              <h3 className="text-base font-bold text-blue-600 mb-3 uppercase border-b border-blue-200 pb-1">Skills</h3>
              <div className="space-y-3">
                {resume.skills.map(skill => (
                  <div key={skill.id}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-medium">{skill.name}</span>
                      <span>{skill.proficiency * 20}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${skill.proficiency * 20}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
          
          {/* Education */}
          {resume.education.length > 0 && (
            <section>
              <h3 className="text-base font-bold text-blue-600 mb-3 uppercase border-b border-blue-200 pb-1">Education</h3>
              {resume.education.map(edu => (
                <div key={edu.id} className="mb-4">
                  <h4 className="font-semibold text-gray-900 text-sm">{edu.degree}</h4>
                  <div className="text-gray-600 text-sm">{edu.institution}</div>
                  <div className="text-xs text-blue-600">
                    {formatDisplayDate(edu.startDate)} - {formatDisplayDate(edu.endDate)}
                  </div>
                </div>
              ))}
            </section>
          )}
        </div>
        
        {/* Main content area */}
        <div className="md:w-2/3">
          {/* Summary */}
          {resume.personalInfo.summary && (
            <section className="mb-6">
              <h3 className="text-lg font-bold text-blue-600 mb-2 uppercase border-b border-blue-200 pb-1">Profile</h3>
              <p className="text-gray-700">{resume.personalInfo.summary}</p>
            </section>
          )}
          
          {/* Experience */}
          {resume.experience.length > 0 && (
            <section className="mb-6">
              <h3 className="text-lg font-bold text-blue-600 mb-3 uppercase border-b border-blue-200 pb-1">Experience</h3>
              {resume.experience.map(exp => (
                <div key={exp.id} className="mb-5">
                  <div className="flex justify-between items-start mb-1">
                    <h4 className="font-semibold text-gray-900">{exp.title}</h4>
                    <div className="text-sm text-blue-600 font-medium">
                      {formatDisplayDate(exp.startDate)} - {formatDisplayDate(exp.endDate)}
                    </div>
                  </div>
                  <div className="text-gray-600 font-medium mb-2">{exp.company}</div>
                  <p className="text-gray-700 text-sm whitespace-pre-line">{exp.description}</p>
                </div>
              ))}
            </section>
          )}
          
          {/* Projects */}
          {resume.projects.length > 0 && (
            <section>
              <h3 className="text-lg font-bold text-blue-600 mb-3 uppercase border-b border-blue-200 pb-1">Projects</h3>
              <div className="space-y-4">
                {resume.projects.map(project => (
                  <div key={project.id} className="border-l-2 border-blue-300 pl-4">
                    <h4 className="font-semibold text-gray-900">{project.title}</h4>
                    <p className="text-gray-700 text-sm">{project.description}</p>
                    {project.technologies.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {project.technologies.map((tech, i) => (
                          <span key={i} className="inline-block text-xs px-2 py-0.5 bg-blue-100 text-blue-800 rounded">
                            {tech}
                          </span>
                        ))}
                      </div>
                    )}
                    {project.link && (
                      <a href={project.link} className="mt-1 block text-xs text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">
                        View Project →
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * Minimal Template - Simple, clean and focused on content
 */
export function MinimalTemplate({ resume }: ResumeTemplateProps) {
  return (
    <div className="bg-white text-gray-800 font-sans p-6 min-h-full max-w-4xl mx-auto">
      {/* Minimal header */}
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">
          {resume.personalInfo.firstName} {resume.personalInfo.lastName}
        </h1>
        <h2 className="text-lg text-gray-600 mb-2">{resume.personalInfo.headline}</h2>
        <div className="flex flex-wrap gap-3 text-sm text-gray-500">
          <div>{resume.personalInfo.email}</div>
          <div className="hidden md:block">•</div>
          <div>{resume.personalInfo.phone}</div>
        </div>
      </header>
      
      <hr className="border-gray-200 mb-6" />
      
      {/* Summary */}
      {resume.personalInfo.summary && (
        <section className="mb-6">
          <p className="text-gray-700 leading-relaxed">{resume.personalInfo.summary}</p>
        </section>
      )}
      
      {/* Experience */}
      {resume.experience.length > 0 && (
        <section className="mb-8">
          <h3 className="text-base font-bold text-gray-900 mb-4 uppercase tracking-wider">Experience</h3>
          {resume.experience.map(exp => (
            <div key={exp.id} className="mb-5">
              <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-1">
                <h4 className="font-semibold text-gray-900">{exp.title}</h4>
                <div className="text-sm text-gray-500">
                  {formatDisplayDate(exp.startDate)} - {formatDisplayDate(exp.endDate)}
                </div>
              </div>
              <div className="text-gray-600 mb-2">{exp.company}</div>
              <p className="text-gray-700 text-sm whitespace-pre-line">{exp.description}</p>
            </div>
          ))}
        </section>
      )}
      
      {/* Education */}
      {resume.education.length > 0 && (
        <section className="mb-8">
          <h3 className="text-base font-bold text-gray-900 mb-4 uppercase tracking-wider">Education</h3>
          {resume.education.map(edu => (
            <div key={edu.id} className="mb-4">
              <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-1">
                <h4 className="font-semibold text-gray-900">{edu.degree}</h4>
                <div className="text-sm text-gray-500">
                  {formatDisplayDate(edu.startDate)} - {formatDisplayDate(edu.endDate)}
                </div>
              </div>
              <div className="text-gray-600">{edu.institution}</div>
              {edu.description && (
                <p className="mt-1 text-gray-700 text-sm">{edu.description}</p>
              )}
            </div>
          ))}
        </section>
      )}
      
      {/* Skills */}
      {resume.skills.length > 0 && (
        <section className="mb-8">
          <h3 className="text-base font-bold text-gray-900 mb-3 uppercase tracking-wider">Skills</h3>
          <div className="flex flex-wrap gap-x-1 gap-y-2">
            {resume.skills.map((skill, index) => (
              <React.Fragment key={skill.id}>
                <span className="text-gray-800">{skill.name}</span>
                {index < resume.skills.length - 1 && <span className="text-gray-400">•</span>}
              </React.Fragment>
            ))}
          </div>
        </section>
      )}
      
      {/* Projects */}
      {resume.projects.length > 0 && (
        <section>
          <h3 className="text-base font-bold text-gray-900 mb-4 uppercase tracking-wider">Projects</h3>
          {resume.projects.map(project => (
            <div key={project.id} className="mb-4">
              <h4 className="font-semibold text-gray-900">{project.title}</h4>
              <p className="text-gray-700 text-sm">{project.description}</p>
              {project.technologies.length > 0 && (
                <div className="mt-1 text-sm text-gray-500">
                  <span className="font-medium">Technologies: </span>
                  {project.technologies.join(', ')}
                </div>
              )}
              {project.link && (
                <a href={project.link} className="mt-1 block text-sm text-gray-600 hover:underline" target="_blank" rel="noopener noreferrer">
                  {project.link}
                </a>
              )}
            </div>
          ))}
        </section>
      )}
    </div>
  );
}

/**
 * Industry Template - Industry-focused template with skills emphasis
 */
export function IndustryTemplate({ resume }: ResumeTemplateProps) {
  return (
    <div className="bg-white text-gray-800 font-sans p-6 min-h-full">
      {/* Header with contact info */}
      <header className="mb-6 pb-4 border-b-2 border-gray-200">
        <h1 className="text-2xl font-bold text-gray-900 mb-1 uppercase tracking-wide">
          {resume.personalInfo.firstName} {resume.personalInfo.lastName}
        </h1>
        <h2 className="text-lg text-gray-600 mb-3">{resume.personalInfo.headline}</h2>
        <div className="flex flex-wrap gap-4 text-sm">
          <div className="flex items-center gap-1">
            <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
            </svg>
            <span>{resume.personalInfo.email}</span>
          </div>
          <div className="flex items-center gap-1">
            <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
            </svg>
            <span>{resume.personalInfo.phone}</span>
          </div>
        </div>
      </header>
      
      {/* Summary */}
      {resume.personalInfo.summary && (
        <section className="mb-6">
          <h3 className="text-lg font-bold text-gray-900 mb-2 uppercase tracking-wide bg-gray-100 p-1">Professional Summary</h3>
          <p className="text-gray-700">{resume.personalInfo.summary}</p>
        </section>
      )}
      
      {/* Skills - emphasized in this template */}
      {resume.skills.length > 0 && (
        <section className="mb-6">
          <h3 className="text-lg font-bold text-gray-900 mb-2 uppercase tracking-wide bg-gray-100 p-1">Core Competencies</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {resume.skills.map(skill => (
              <div key={skill.id} className="flex items-start">
                <svg className="w-4 h-4 text-gray-600 mt-0.5 mr-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <span className="text-gray-800">{skill.name}</span>
              </div>
            ))}
          </div>
        </section>
      )}
      
      {/* Experience */}
      {resume.experience.length > 0 && (
        <section className="mb-6">
          <h3 className="text-lg font-bold text-gray-900 mb-2 uppercase tracking-wide bg-gray-100 p-1">Work Experience</h3>
          {resume.experience.map(exp => (
            <div key={exp.id} className="mb-5">
              <div className="flex justify-between items-baseline">
                <h4 className="font-bold text-gray-900">{exp.title}</h4>
                <div className="text-sm text-gray-600">
                  {formatDisplayDate(exp.startDate)} - {formatDisplayDate(exp.endDate)}
                </div>
              </div>
              <div className="font-semibold text-gray-700 mb-2">{exp.company}</div>
              <p className="text-gray-700 whitespace-pre-line">{exp.description}</p>
            </div>
          ))}
        </section>
      )}
      
      {/* Education */}
      {resume.education.length > 0 && (
        <section className="mb-6">
          <h3 className="text-lg font-bold text-gray-900 mb-2 uppercase tracking-wide bg-gray-100 p-1">Education & Certifications</h3>
          {resume.education.map(edu => (
            <div key={edu.id} className="mb-4">
              <div className="flex justify-between items-baseline">
                <h4 className="font-bold text-gray-900">{edu.degree}</h4>
                <div className="text-sm text-gray-600">
                  {formatDisplayDate(edu.startDate)} - {formatDisplayDate(edu.endDate)}
                </div>
              </div>
              <div className="text-gray-700 mb-1">{edu.institution}</div>
              {edu.description && (
                <p className="text-gray-600 text-sm">{edu.description}</p>
              )}
            </div>
          ))}
        </section>
      )}
      
      {/* Projects */}
      {resume.projects.length > 0 && (
        <section>
          <h3 className="text-lg font-bold text-gray-900 mb-2 uppercase tracking-wide bg-gray-100 p-1">Key Projects</h3>
          {resume.projects.map(project => (
            <div key={project.id} className="mb-4">
              <h4 className="font-bold text-gray-900">{project.title}</h4>
              <p className="text-gray-700">{project.description}</p>
              {project.technologies.length > 0 && (
                <div className="mt-1">
                  <span className="font-semibold text-gray-700">Technologies: </span>
                  <span className="text-gray-600">{project.technologies.join(', ')}</span>
                </div>
              )}
            </div>
          ))}
        </section>
      )}
    </div>
  );
}

/**
 * Bold Template - Strong visual impact with bold headers
 */
export function BoldTemplate({ resume }: ResumeTemplateProps) {
  return (
    <div className="bg-white text-gray-800 font-sans p-6 min-h-full">
      {/* Bold header with accent color */}
      <header className="mb-8">
        <div className="bg-indigo-700 text-white p-4 rounded-lg">
          <h1 className="text-3xl font-bold mb-1">
            {resume.personalInfo.firstName} {resume.personalInfo.lastName}
          </h1>
          <h2 className="text-xl opacity-90">{resume.personalInfo.headline}</h2>
        </div>
        <div className="flex flex-wrap gap-4 mt-4 text-sm">
          <div className="flex items-center gap-1 text-indigo-700">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
              <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
            </svg>
            <span>{resume.personalInfo.email}</span>
          </div>
          <div className="flex items-center gap-1 text-indigo-700">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
            </svg>
            <span>{resume.personalInfo.phone}</span>
          </div>
        </div>
      </header>
      
      {/* Summary */}
      {resume.personalInfo.summary && (
        <section className="mb-8">
          <h3 className="text-lg font-bold text-white bg-indigo-700 p-2 rounded-md mb-3">PROFESSIONAL SUMMARY</h3>
          <p className="text-gray-700 leading-relaxed">{resume.personalInfo.summary}</p>
        </section>
      )}
      
      {/* Experience */}
      {resume.experience.length > 0 && (
        <section className="mb-8">
          <h3 className="text-lg font-bold text-white bg-indigo-700 p-2 rounded-md mb-3">EXPERIENCE</h3>
          {resume.experience.map(exp => (
            <div key={exp.id} className="mb-6 border-l-4 border-indigo-200 pl-4">
              <h4 className="font-bold text-indigo-800 text-lg">{exp.title}</h4>
              <div className="flex justify-between items-baseline">
                <div className="font-medium text-gray-700">{exp.company}</div>
                <div className="text-indigo-600 text-sm font-medium">
                  {formatDisplayDate(exp.startDate)} - {formatDisplayDate(exp.endDate)}
                </div>
              </div>
              <p className="mt-2 text-gray-700 whitespace-pre-line">{exp.description}</p>
            </div>
          ))}
        </section>
      )}
      
      {/* Two-column layout for the bottom sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left column */}
        <div>
          {/* Education */}
          {resume.education.length > 0 && (
            <section className="mb-6">
              <h3 className="text-lg font-bold text-white bg-indigo-700 p-2 rounded-md mb-3">EDUCATION</h3>
              {resume.education.map(edu => (
                <div key={edu.id} className="mb-4">
                  <h4 className="font-bold text-indigo-800">{edu.degree}</h4>
                  <div className="text-gray-700">{edu.institution}</div>
                  <div className="text-indigo-600 text-sm">
                    {formatDisplayDate(edu.startDate)} - {formatDisplayDate(edu.endDate)}
                  </div>
                  {edu.description && (
                    <p className="mt-1 text-gray-600 text-sm">{edu.description}</p>
                  )}
                </div>
              ))}
            </section>
          )}
        </div>
        
        {/* Right column */}
        <div>
          {/* Skills */}
          {resume.skills.length > 0 && (
            <section className="mb-6">
              <h3 className="text-lg font-bold text-white bg-indigo-700 p-2 rounded-md mb-3">SKILLS</h3>
              <div className="flex flex-wrap gap-2">
                {resume.skills.map(skill => (
                  <div key={skill.id} className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm font-medium">
                    {skill.name}
                  </div>
                ))}
              </div>
            </section>
          )}
          
          {/* Projects */}
          {resume.projects.length > 0 && (
            <section>
              <h3 className="text-lg font-bold text-white bg-indigo-700 p-2 rounded-md mb-3">PROJECTS</h3>
              {resume.projects.map(project => (
                <div key={project.id} className="mb-4">
                  <h4 className="font-bold text-indigo-800">{project.title}</h4>
                  <p className="text-gray-700 text-sm">{project.description}</p>
                  {project.technologies.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {project.technologies.map((tech, i) => (
                        <span key={i} className="bg-indigo-50 text-indigo-700 px-2 py-0.5 text-xs rounded">
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </section>
          )}
        </div>
      </div>
    </div>
  );
}

// Preview components for template selection (smaller versions of the templates)
export function TemplatePreviewProfessional() {
  return (
    <div className="w-full h-full bg-white text-black p-2 text-[6px] overflow-hidden">
      <div className="border-b border-gray-300 pb-1 mb-1">
        <div className="text-[8px] font-bold">John Doe</div>
        <div className="text-[6px] text-blue-600">Frontend Developer</div>
      </div>
      <div className="mb-1">
        <div className="font-semibold mb-0.5">Experience</div>
        <div className="pl-1">
          <div className="font-medium">Web Developer</div>
          <div className="text-[5px]">Company Name • 2020-Present</div>
        </div>
      </div>
      <div className="mb-1">
        <div className="font-semibold mb-0.5">Education</div>
        <div className="pl-1">
          <div className="font-medium">Computer Science</div>
          <div className="text-[5px]">University Name • 2016-2020</div>
        </div>
      </div>
      <div>
        <div className="font-semibold mb-0.5">Skills</div>
        <div className="flex flex-wrap gap-0.5">
          <div className="bg-gray-100 px-0.5 text-[5px]">React</div>
          <div className="bg-gray-100 px-0.5 text-[5px]">JavaScript</div>
          <div className="bg-gray-100 px-0.5 text-[5px]">CSS</div>
        </div>
      </div>
    </div>
  );
}

export function TemplatePreviewCreative() {
  return (
    <div className="w-full h-full bg-white text-black p-2 text-[6px] overflow-hidden">
      <div className="h-0.5 bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 -mt-2 -mx-2 mb-1"></div>
      <div className="mb-1">
        <div className="text-[8px] font-bold">John Doe</div>
        <div className="text-[6px] text-purple-600">Frontend Developer</div>
      </div>
      <div className="flex gap-1">
        <div className="w-1/3">
          <div className="text-[7px] font-bold text-purple-600 uppercase mb-0.5">Skills</div>
          <div className="text-[5px]">
            <div>React</div>
            <div>JavaScript</div>
            <div>CSS</div>
          </div>
        </div>
        <div className="w-2/3 border-l border-purple-200 pl-1">
          <div className="text-[7px] font-bold text-purple-600 uppercase mb-0.5">Experience</div>
          <div className="mb-1">
            <div className="font-medium">Web Developer</div>
            <div className="text-[5px]">Company Name • 2020-Present</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function TemplatePreviewExecutive() {
  return (
    <div className="w-full h-full bg-white text-black p-2 text-[6px] overflow-hidden font-serif">
      <div className="text-center mb-1 pb-0.5 border-b border-gray-200">
        <div className="text-[8px] font-bold uppercase">John Doe</div>
        <div className="text-[6px] text-gray-600">Senior Executive</div>
      </div>
      <div className="mb-1">
        <div className="text-[7px] font-semibold text-center uppercase border-b border-gray-200 pb-0.5 mb-0.5">Experience</div>
        <div>
          <div className="flex justify-between text-[6px]">
            <div className="font-bold">Executive Director</div>
            <div>2020-Present</div>
          </div>
          <div className="font-semibold text-[5px]">Company Name</div>
        </div>
      </div>
      <div className="flex gap-1">
        <div className="w-1/2">
          <div className="text-[7px] font-semibold text-center uppercase border-b border-gray-200 pb-0.5 mb-0.5">Education</div>
          <div className="text-[5px]">
            <div className="font-bold">MBA</div>
            <div>University Name</div>
          </div>
        </div>
        <div className="w-1/2">
          <div className="text-[7px] font-semibold text-center uppercase border-b border-gray-200 pb-0.5 mb-0.5">Skills</div>
          <div className="grid grid-cols-2 gap-x-1 text-[5px]">
            <div>Leadership</div>
            <div>Strategy</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function TemplatePreviewModern() {
  return (
    <div className="w-full h-full bg-white text-black p-2 text-[6px] overflow-hidden">
      <div className="flex gap-1">
        <div className="w-1/3 bg-blue-50 p-1 rounded">
          <div className="text-center mb-1">
            <div className="text-[7px] font-bold">John Doe</div>
            <div className="text-[5px] text-blue-600">Developer</div>
          </div>
          <div className="text-[6px] font-bold text-blue-600 uppercase border-b border-blue-200 pb-0.5 mb-0.5">Skills</div>
          <div className="text-[5px]">
            <div>React</div>
            <div>JavaScript</div>
          </div>
        </div>
        <div className="w-2/3">
          <div className="text-[6px] font-bold text-blue-600 uppercase border-b border-blue-200 pb-0.5 mb-0.5">Experience</div>
          <div className="mb-1">
            <div className="font-medium">Web Developer</div>
            <div className="text-[5px]">Company • 2020-Present</div>
          </div>
          <div className="text-[6px] font-bold text-blue-600 uppercase border-b border-blue-200 pb-0.5 mb-0.5">Projects</div>
          <div className="text-[5px] border-l border-blue-300 pl-0.5">
            <div className="font-medium">Portfolio Website</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function TemplatePreviewMinimal() {
  return (
    <div className="w-full h-full bg-white text-black p-2 text-[6px] overflow-hidden">
      <div className="mb-1">
        <div className="text-[8px] font-bold">John Doe</div>
        <div className="text-[6px] text-gray-600">Developer</div>
      </div>
      <div className="border-t border-gray-200 mb-1 pt-1">
        <div className="text-[7px] font-bold uppercase mb-0.5">Experience</div>
        <div className="mb-0.5">
          <div className="flex justify-between">
            <div className="font-medium">Web Developer</div>
            <div className="text-[5px] text-gray-500">2020-Present</div>
          </div>
          <div className="text-[5px]">Company Name</div>
        </div>
      </div>
      <div className="mb-1">
        <div className="text-[7px] font-bold uppercase mb-0.5">Skills</div>
        <div className="flex flex-wrap gap-x-0.5 text-[5px]">
          <span>React</span><span>•</span>
          <span>JavaScript</span><span>•</span>
          <span>CSS</span>
        </div>
      </div>
    </div>
  );
}

export function TemplatePreviewIndustry() {
  return (
    <div className="w-full h-full bg-white text-black p-2 text-[6px] overflow-hidden">
      <div className="border-b border-gray-200 pb-1 mb-1">
        <div className="text-[8px] font-bold uppercase">John Doe</div>
        <div className="text-[6px]">IT Professional</div>
      </div>
      <div className="mb-1">
        <div className="text-[7px] font-bold bg-gray-100 p-0.5 uppercase mb-0.5">Core Skills</div>
        <div className="grid grid-cols-2 gap-0.5 text-[5px]">
          <div className="flex items-start">
            <span className="mr-0.5">✓</span>
            <span>Project Management</span>
          </div>
          <div className="flex items-start">
            <span className="mr-0.5">✓</span>
            <span>System Analysis</span>
          </div>
        </div>
      </div>
      <div>
        <div className="text-[7px] font-bold bg-gray-100 p-0.5 uppercase mb-0.5">Experience</div>
        <div className="text-[5px]">
          <div className="font-bold">IT Manager</div>
          <div className="flex justify-between">
            <div>Company Name</div>
            <div>2018-Present</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function TemplatePreviewBold() {
  return (
    <div className="w-full h-full bg-white text-black p-2 text-[6px] overflow-hidden">
      <div className="bg-indigo-700 text-white p-1 rounded mb-1">
        <div className="text-[7px] font-bold">John Doe</div>
        <div className="text-[5px] opacity-90">Developer</div>
      </div>
      <div className="mb-1">
        <div className="text-[7px] font-bold text-white bg-indigo-700 p-0.5 rounded mb-0.5">EXPERIENCE</div>
        <div className="border-l-2 border-indigo-200 pl-0.5">
          <div className="font-bold text-indigo-800">Web Developer</div>
          <div className="text-[5px]">Company • 2020-Present</div>
        </div>
      </div>
      <div>
        <div className="text-[7px] font-bold text-white bg-indigo-700 p-0.5 rounded mb-0.5">SKILLS</div>
        <div className="flex flex-wrap gap-0.5">
          <div className="bg-indigo-100 text-indigo-800 px-0.5 rounded-full text-[5px]">React</div>
          <div className="bg-indigo-100 text-indigo-800 px-0.5 rounded-full text-[5px]">JS</div>
        </div>
      </div>
    </div>
  );
}