import { 
  Card, 
  CardHeader, 
  CardContent 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export interface PersonalInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  headline: string;
  summary: string;
}

export interface Resume {
  id?: string;
  title: string;
  personalInfo: PersonalInfo;
  experience: any[];
  education: any[];
  skills: any[];
  projects: any[];
  template: string;
}

interface TemplateOptionProps {
  name: string;
  description: string;
  preview: React.ReactNode;
  selected: boolean;
  onClick: () => void;
}

function TemplateOption({ name, description, preview, selected, onClick }: TemplateOptionProps) {
  return (
    <div
      onClick={onClick}
      className={`cursor-pointer relative rounded-lg border ${
        selected ? "ring-2 ring-offset-2 ring-primary-500 border-primary-400" : "border-secondary-300"
      } bg-white px-6 py-5 shadow-sm flex items-center space-x-3 hover:border-primary-400 focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary-500`}
    >
      <div className="flex-shrink-0 h-40 w-full">{preview}</div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-secondary-900">{name}</p>
        <p className="text-sm text-secondary-500 truncate">{description}</p>
      </div>
    </div>
  );
}

export function ProfessionalTemplate({ resume }: { resume: Resume }) {
  const { personalInfo, experience, education, skills } = resume;
  const fullName = `${personalInfo?.firstName || ''} ${personalInfo?.lastName || ''}`.trim();
  
  return (
    <div className="p-6 bg-white">
      <div className="text-center py-4 border-b border-gray-200 mb-6">
        <h1 className="text-2xl font-bold text-gray-900">{fullName || "Your Name"}</h1>
        <p className="text-gray-600 mt-1">{personalInfo?.headline || "Professional Headline"}</p>
        <div className="flex justify-center gap-4 mt-2 text-sm text-gray-500">
          {personalInfo?.email && <span>{personalInfo.email}</span>}
          {personalInfo?.phone && <span>{personalInfo.phone}</span>}
        </div>
      </div>
      
      {personalInfo?.summary && (
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Professional Summary</h2>
          <p className="text-gray-700">{personalInfo.summary}</p>
        </div>
      )}
      
      {experience && experience.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Experience</h2>
          {experience.map((job, index) => (
            <div key={index} className="mb-4">
              <div className="flex justify-between">
                <h3 className="font-semibold">{job.title || "Position Title"}</h3>
                <span className="text-gray-500 text-sm">{job.startDate} - {job.endDate}</span>
              </div>
              <p className="text-gray-600">{job.company || "Company Name"}</p>
              <p className="text-gray-700 mt-1 whitespace-pre-line">{job.description}</p>
            </div>
          ))}
        </div>
      )}
      
      {education && education.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Education</h2>
          {education.map((edu, index) => (
            <div key={index} className="mb-4">
              <div className="flex justify-between">
                <h3 className="font-semibold">{edu.degree || "Degree"}</h3>
                <span className="text-gray-500 text-sm">{edu.startDate} - {edu.endDate}</span>
              </div>
              <p className="text-gray-600">{edu.institution || "Institution"}</p>
              {edu.description && <p className="text-gray-700 mt-1">{edu.description}</p>}
            </div>
          ))}
        </div>
      )}
      
      {skills && skills.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Skills</h2>
          <div className="flex flex-wrap gap-2">
            {skills.map((skill, index) => (
              <span key={index} className="px-2 py-1 bg-gray-100 rounded-md text-gray-700 text-sm">
                {skill.name}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export function CreativeTemplate({ resume }: { resume: Resume }) {
  const { personalInfo, experience, education, skills } = resume;
  const fullName = `${personalInfo?.firstName || ''} ${personalInfo?.lastName || ''}`.trim();
  
  return (
    <div className="p-6 bg-white flex">
      <div className="w-1/3 bg-accent-100 p-6 rounded-l-lg">
        <div className="mb-8 text-center">
          <h1 className="text-xl font-bold text-accent-900">{fullName || "Your Name"}</h1>
          <p className="text-accent-700 mt-1 text-sm">{personalInfo?.headline || "Professional Headline"}</p>
        </div>
        
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-accent-900 mb-2 border-b border-accent-200 pb-1">Contact</h2>
          <div className="text-sm space-y-2 text-accent-800">
            {personalInfo?.email && <p>{personalInfo.email}</p>}
            {personalInfo?.phone && <p>{personalInfo.phone}</p>}
          </div>
        </div>
        
        {skills && skills.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold text-accent-900 mb-2 border-b border-accent-200 pb-1">Skills</h2>
            <div className="space-y-2">
              {skills.map((skill, index) => (
                <div key={index} className="text-sm text-accent-800">
                  <span>{skill.name}</span>
                  <div className="w-full h-1 bg-accent-200 rounded-full mt-1">
                    <div 
                      className="h-1 bg-accent-500 rounded-full" 
                      style={{ width: `${Math.min(skill.proficiency * 20, 100)}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      
      <div className="w-2/3 p-6">
        {personalInfo?.summary && (
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-2 border-b border-gray-200 pb-1">About Me</h2>
            <p className="text-gray-700">{personalInfo.summary}</p>
          </div>
        )}
        
        {experience && experience.length > 0 && (
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-2 border-b border-gray-200 pb-1">Experience</h2>
            {experience.map((job, index) => (
              <div key={index} className="mb-4">
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold">{job.title || "Position Title"}</h3>
                  <span className="text-gray-500 text-sm">{job.startDate} - {job.endDate}</span>
                </div>
                <p className="text-gray-600 italic">{job.company || "Company Name"}</p>
                <p className="text-gray-700 mt-1 whitespace-pre-line">{job.description}</p>
              </div>
            ))}
          </div>
        )}
        
        {education && education.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-2 border-b border-gray-200 pb-1">Education</h2>
            {education.map((edu, index) => (
              <div key={index} className="mb-4">
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold">{edu.degree || "Degree"}</h3>
                  <span className="text-gray-500 text-sm">{edu.startDate} - {edu.endDate}</span>
                </div>
                <p className="text-gray-600 italic">{edu.institution || "Institution"}</p>
                {edu.description && <p className="text-gray-700 mt-1">{edu.description}</p>}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export function ExecutiveTemplate({ resume }: { resume: Resume }) {
  const { personalInfo, experience, education, skills } = resume;
  const fullName = `${personalInfo?.firstName || ''} ${personalInfo?.lastName || ''}`.trim();
  
  return (
    <div className="p-6 bg-white">
      <div className="bg-primary-600 text-white p-6 rounded-t-lg">
        <h1 className="text-2xl font-bold">{fullName || "Your Name"}</h1>
        <p className="text-primary-100 mt-1">{personalInfo?.headline || "Professional Headline"}</p>
        <div className="flex gap-4 mt-3 text-sm text-primary-100">
          {personalInfo?.email && <span>{personalInfo.email}</span>}
          {personalInfo?.phone && <span>{personalInfo.phone}</span>}
        </div>
      </div>
      
      <div className="p-6">
        {personalInfo?.summary && (
          <div className="mb-6">
            <h2 className="text-lg font-bold text-primary-900 mb-2">Executive Summary</h2>
            <p className="text-gray-700 border-l-2 border-primary-300 pl-4">{personalInfo.summary}</p>
          </div>
        )}
        
        {experience && experience.length > 0 && (
          <div className="mb-6">
            <h2 className="text-lg font-bold text-primary-900 mb-2">Professional Experience</h2>
            {experience.map((job, index) => (
              <div key={index} className="mb-4">
                <div className="flex justify-between items-baseline">
                  <h3 className="font-bold text-gray-900">{job.title || "Position Title"}</h3>
                  <span className="text-primary-600 font-medium text-sm">{job.startDate} - {job.endDate}</span>
                </div>
                <p className="text-primary-700 font-semibold">{job.company || "Company Name"}</p>
                <p className="text-gray-700 mt-1 whitespace-pre-line">{job.description}</p>
              </div>
            ))}
          </div>
        )}
        
        <div className="grid grid-cols-2 gap-6">
          {education && education.length > 0 && (
            <div>
              <h2 className="text-lg font-bold text-primary-900 mb-2">Education</h2>
              {education.map((edu, index) => (
                <div key={index} className="mb-4">
                  <h3 className="font-bold text-gray-900">{edu.degree || "Degree"}</h3>
                  <p className="text-primary-700">{edu.institution || "Institution"}</p>
                  <p className="text-gray-500 text-sm">{edu.startDate} - {edu.endDate}</p>
                </div>
              ))}
            </div>
          )}
          
          {skills && skills.length > 0 && (
            <div>
              <h2 className="text-lg font-bold text-primary-900 mb-2">Core Competencies</h2>
              <div className="grid grid-cols-2 gap-2">
                {skills.map((skill, index) => (
                  <div key={index} className="text-gray-700 flex items-center">
                    <span className="w-2 h-2 bg-primary-500 rounded-full mr-2"></span>
                    <span>{skill.name}</span>
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

export function TemplatePreviewProfessional() {
  return (
    <div className="h-full w-full bg-secondary-100 rounded flex flex-col p-3">
      <div className="text-center py-2 border-b border-secondary-200">
        <div className="h-2 bg-secondary-300 rounded w-1/2 mx-auto mb-1"></div>
        <div className="h-2 bg-secondary-300 rounded w-3/4 mx-auto"></div>
      </div>
      <div className="flex-1 flex flex-col justify-around py-2">
        <div className="space-y-1">
          <div className="h-2 bg-secondary-300 rounded w-full"></div>
          <div className="h-2 bg-secondary-300 rounded w-5/6"></div>
        </div>
        <div className="space-y-1">
          <div className="h-2 bg-secondary-300 rounded w-full"></div>
          <div className="h-2 bg-secondary-300 rounded w-4/6"></div>
        </div>
      </div>
    </div>
  );
}

export function TemplatePreviewCreative() {
  return (
    <div className="h-full w-full bg-accent-100 rounded flex p-3">
      <div className="w-1/3 bg-accent-200 rounded-l"></div>
      <div className="w-2/3 flex flex-col p-2">
        <div className="text-center py-1">
          <div className="h-2 bg-accent-300 rounded w-1/2 mx-auto mb-1"></div>
          <div className="h-2 bg-accent-300 rounded w-3/4 mx-auto"></div>
        </div>
        <div className="flex-1 flex flex-col justify-around py-2">
          <div className="space-y-1">
            <div className="h-2 bg-accent-300 rounded w-full"></div>
            <div className="h-2 bg-accent-300 rounded w-5/6"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function TemplatePreviewExecutive() {
  return (
    <div className="h-full w-full bg-secondary-100 rounded flex flex-col p-3">
      <div className="bg-primary-600 text-center py-2 rounded-t">
        <div className="h-2 bg-white bg-opacity-70 rounded w-1/2 mx-auto mb-1"></div>
        <div className="h-2 bg-white bg-opacity-70 rounded w-3/4 mx-auto"></div>
      </div>
      <div className="flex-1 flex flex-col justify-around py-2">
        <div className="space-y-1">
          <div className="h-2 bg-secondary-300 rounded w-full"></div>
          <div className="h-2 bg-secondary-300 rounded w-5/6"></div>
        </div>
        <div className="space-y-1">
          <div className="h-2 bg-secondary-300 rounded w-full"></div>
          <div className="h-2 bg-secondary-300 rounded w-4/6"></div>
        </div>
      </div>
    </div>
  );
}

export function TemplatePreviewModern() {
  return (
    <div className="h-full w-full bg-secondary-100 rounded flex flex-col p-3">
      <div className="bg-blue-500 h-2 w-full rounded-t"></div>
      <div className="flex-1 flex flex-col p-2">
        <div className="flex justify-between">
          <div className="h-3 bg-secondary-200 rounded w-1/3"></div>
          <div className="h-3 bg-secondary-200 rounded w-1/3"></div>
        </div>
        <div className="mt-3 space-y-1">
          <div className="h-2 bg-secondary-300 rounded w-full"></div>
          <div className="h-2 bg-secondary-300 rounded w-5/6"></div>
        </div>
      </div>
    </div>
  );
}

export function TemplatePreviewMinimal() {
  return (
    <div className="h-full w-full bg-white rounded flex flex-col p-3">
      <div className="border-b pb-2">
        <div className="h-3 bg-gray-200 rounded w-1/2 mb-1"></div>
      </div>
      <div className="flex-1 flex flex-col justify-around py-2">
        <div className="space-y-1">
          <div className="h-2 bg-gray-200 rounded w-full"></div>
          <div className="h-2 bg-gray-200 rounded w-5/6"></div>
        </div>
      </div>
    </div>
  );
}

export function TemplatePreviewIndustry() {
  return (
    <div className="h-full w-full bg-slate-100 rounded flex flex-col p-3">
      <div className="bg-slate-700 text-center py-2 rounded-t">
        <div className="h-2 bg-white bg-opacity-70 rounded w-1/2 mx-auto mb-1"></div>
      </div>
      <div className="flex-1 flex flex-col justify-around py-2">
        <div className="space-y-1">
          <div className="h-2 bg-slate-300 rounded w-full"></div>
          <div className="h-2 bg-slate-300 rounded w-5/6"></div>
        </div>
      </div>
    </div>
  );
}

export function TemplatePreviewBold() {
  return (
    <div className="h-full w-full bg-secondary-100 rounded flex flex-col p-3">
      <div className="bg-pink-600 text-center py-2 rounded-t">
        <div className="h-3 bg-white bg-opacity-70 rounded w-1/2 mx-auto mb-1"></div>
      </div>
      <div className="flex-1 flex flex-col justify-around py-2">
        <div className="space-y-1">
          <div className="h-2 bg-secondary-300 rounded w-full"></div>
          <div className="h-2 bg-secondary-300 rounded w-5/6"></div>
        </div>
      </div>
    </div>
  );
}

export function ModernTemplate({ resume }: { resume: Resume }) {
  const { personalInfo, experience, education, skills } = resume;
  const fullName = `${personalInfo?.firstName || ''} ${personalInfo?.lastName || ''}`.trim();
  
  return (
    <div className="p-6 bg-white">
      {/* Header with blue accent */}
      <div className="border-t-4 border-blue-500 pt-4 mb-6">
        <h1 className="text-2xl font-bold text-gray-900">{fullName || "Your Name"}</h1>
        <p className="text-blue-600 font-medium">{personalInfo?.headline || "Professional Headline"}</p>
        <div className="flex flex-wrap gap-4 mt-2 text-sm text-gray-600">
          {personalInfo?.email && <span className="flex items-center"><span className="mr-1">✉</span> {personalInfo.email}</span>}
          {personalInfo?.phone && <span className="flex items-center"><span className="mr-1">☎</span> {personalInfo.phone}</span>}
        </div>
      </div>
      
      {personalInfo?.summary && (
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-1 mb-2">Profile</h2>
          <p className="text-gray-700">{personalInfo.summary}</p>
        </div>
      )}
      
      {experience && experience.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-1 mb-2">Experience</h2>
          {experience.map((job, index) => (
            <div key={index} className="mb-4">
              <div className="flex flex-wrap justify-between items-baseline">
                <h3 className="font-bold text-gray-800">{job.title || "Position Title"}</h3>
                <span className="text-gray-500 text-sm">{job.startDate} - {job.endDate}</span>
              </div>
              <p className="text-blue-600 font-medium">{job.company || "Company Name"}</p>
              <p className="text-gray-700 mt-1 whitespace-pre-line">{job.description}</p>
            </div>
          ))}
        </div>
      )}
      
      {education && education.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-1 mb-2">Education</h2>
          {education.map((edu, index) => (
            <div key={index} className="mb-4">
              <div className="flex flex-wrap justify-between items-baseline">
                <h3 className="font-bold text-gray-800">{edu.degree || "Degree"}</h3>
                <span className="text-gray-500 text-sm">{edu.startDate} - {edu.endDate}</span>
              </div>
              <p className="text-blue-600 font-medium">{edu.institution || "Institution"}</p>
              {edu.description && <p className="text-gray-700 mt-1">{edu.description}</p>}
            </div>
          ))}
        </div>
      )}
      
      {skills && skills.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-1 mb-2">Skills</h2>
          <div className="flex flex-wrap gap-2">
            {skills.map((skill, index) => (
              <span key={index} className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm">
                {skill.name}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export function MinimalTemplate({ resume }: { resume: Resume }) {
  const { personalInfo, experience, education, skills } = resume;
  const fullName = `${personalInfo?.firstName || ''} ${personalInfo?.lastName || ''}`.trim();
  
  return (
    <div className="p-6 bg-white">
      {/* Simple minimal header */}
      <div className="text-center mb-6">
        <h1 className="text-2xl font-normal text-gray-900">{fullName || "Your Name"}</h1>
        <p className="text-gray-600 mt-1">{personalInfo?.headline || "Professional Headline"}</p>
        <div className="flex justify-center gap-4 mt-2 text-sm text-gray-500">
          {personalInfo?.email && <span>{personalInfo.email}</span>}
          {personalInfo?.phone && <span>{personalInfo.phone}</span>}
        </div>
      </div>
      
      <div className="max-w-2xl mx-auto">
        {personalInfo?.summary && (
          <div className="mb-6">
            <p className="text-gray-700 italic">{personalInfo.summary}</p>
            <hr className="my-4 border-gray-200" />
          </div>
        )}
        
        {experience && experience.length > 0 && (
          <div className="mb-6">
            <h2 className="text-md uppercase tracking-wider text-gray-500 mb-3">Experience</h2>
            {experience.map((job, index) => (
              <div key={index} className="mb-4">
                <h3 className="font-medium text-gray-900">{job.title || "Position Title"} • {job.company || "Company Name"}</h3>
                <p className="text-gray-500 text-sm mb-1">{job.startDate} - {job.endDate}</p>
                <p className="text-gray-700">{job.description}</p>
              </div>
            ))}
          </div>
        )}
        
        {education && education.length > 0 && (
          <div className="mb-6">
            <h2 className="text-md uppercase tracking-wider text-gray-500 mb-3">Education</h2>
            {education.map((edu, index) => (
              <div key={index} className="mb-4">
                <h3 className="font-medium text-gray-900">{edu.degree || "Degree"} • {edu.institution || "Institution"}</h3>
                <p className="text-gray-500 text-sm mb-1">{edu.startDate} - {edu.endDate}</p>
                {edu.description && <p className="text-gray-700">{edu.description}</p>}
              </div>
            ))}
          </div>
        )}
        
        {skills && skills.length > 0 && (
          <div>
            <h2 className="text-md uppercase tracking-wider text-gray-500 mb-3">Skills</h2>
            <p className="text-gray-700">
              {skills.map((skill, i) => (
                <span key={i}>
                  {skill.name}{i < skills.length - 1 ? " • " : ""}
                </span>
              ))}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export function IndustryTemplate({ resume }: { resume: Resume }) {
  const { personalInfo, experience, education, skills } = resume;
  const fullName = `${personalInfo?.firstName || ''} ${personalInfo?.lastName || ''}`.trim();
  
  return (
    <div className="p-0 bg-white">
      {/* Industry-specific header with color bar */}
      <div className="bg-slate-800 text-white p-6">
        <h1 className="text-2xl font-bold">{fullName || "Your Name"}</h1>
        <p className="text-slate-300 mt-1">{personalInfo?.headline || "Industry Professional"}</p>
        <div className="flex gap-4 mt-3 text-sm text-slate-300">
          {personalInfo?.email && <span>{personalInfo.email}</span>}
          {personalInfo?.phone && <span>{personalInfo.phone}</span>}
        </div>
      </div>
      
      <div className="p-6">
        {personalInfo?.summary && (
          <div className="mb-6">
            <h2 className="text-lg font-bold text-slate-800 mb-2">Professional Summary</h2>
            <div className="bg-slate-50 p-4 border-l-4 border-slate-400">
              <p className="text-slate-700">{personalInfo.summary}</p>
            </div>
          </div>
        )}
        
        {experience && experience.length > 0 && (
          <div className="mb-6">
            <h2 className="text-lg font-bold text-slate-800 mb-3">Industry Experience</h2>
            {experience.map((job, index) => (
              <div key={index} className="mb-4 pb-4 border-b border-slate-200">
                <div className="flex justify-between items-baseline">
                  <h3 className="font-semibold text-slate-800">{job.title || "Position Title"}</h3>
                  <span className="text-slate-500 text-sm">{job.startDate} - {job.endDate}</span>
                </div>
                <p className="text-slate-600 font-medium mb-2">{job.company || "Company Name"}</p>
                <p className="text-slate-700">{job.description}</p>
              </div>
            ))}
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {education && education.length > 0 && (
            <div>
              <h2 className="text-lg font-bold text-slate-800 mb-3">Education</h2>
              {education.map((edu, index) => (
                <div key={index} className="mb-4">
                  <h3 className="font-semibold text-slate-800">{edu.degree || "Degree"}</h3>
                  <p className="text-slate-600">{edu.institution || "Institution"}</p>
                  <p className="text-slate-500 text-sm">{edu.startDate} - {edu.endDate}</p>
                  {edu.description && <p className="text-slate-700 mt-1">{edu.description}</p>}
                </div>
              ))}
            </div>
          )}
          
          {skills && skills.length > 0 && (
            <div>
              <h2 className="text-lg font-bold text-slate-800 mb-3">Industry Skills</h2>
              <div className="grid grid-cols-2 gap-2">
                {skills.map((skill, index) => (
                  <div key={index} className="flex items-center">
                    <span className="w-2 h-2 bg-slate-400 rounded-full mr-2"></span>
                    <span className="text-slate-700">{skill.name}</span>
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

export function BoldTemplate({ resume }: { resume: Resume }) {
  const { personalInfo, experience, education, skills } = resume;
  const fullName = `${personalInfo?.firstName || ''} ${personalInfo?.lastName || ''}`.trim();
  
  return (
    <div className="p-0 bg-white">
      {/* Bold accent header */}
      <div className="bg-gradient-to-r from-pink-600 to-purple-600 text-white p-6">
        <h1 className="text-3xl font-bold">{fullName || "Your Name"}</h1>
        <p className="text-white mt-1 text-xl">{personalInfo?.headline || "Professional Headline"}</p>
        <div className="flex gap-4 mt-3 text-sm">
          {personalInfo?.email && <span>{personalInfo.email}</span>}
          {personalInfo?.phone && <span>{personalInfo.phone}</span>}
        </div>
      </div>
      
      <div className="p-6">
        {personalInfo?.summary && (
          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-2">About Me</h2>
            <p className="text-gray-700 border-l-4 border-pink-500 pl-4 py-1">{personalInfo.summary}</p>
          </div>
        )}
        
        {experience && experience.length > 0 && (
          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-3">Work Experience</h2>
            {experience.map((job, index) => (
              <div key={index} className="mb-5">
                <div className="flex flex-wrap justify-between items-baseline">
                  <h3 className="font-bold text-pink-600 text-lg">{job.title || "Position Title"}</h3>
                  <span className="text-gray-600 font-medium">{job.startDate} - {job.endDate}</span>
                </div>
                <p className="text-gray-800 font-bold">{job.company || "Company Name"}</p>
                <p className="text-gray-700 mt-2">{job.description}</p>
              </div>
            ))}
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {education && education.length > 0 && (
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-3">Education</h2>
              {education.map((edu, index) => (
                <div key={index} className="mb-4">
                  <h3 className="font-bold text-gray-800">{edu.degree || "Degree"}</h3>
                  <p className="text-pink-600 font-semibold">{edu.institution || "Institution"}</p>
                  <p className="text-gray-600">{edu.startDate} - {edu.endDate}</p>
                </div>
              ))}
            </div>
          )}
          
          {skills && skills.length > 0 && (
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-3">Skills & Expertise</h2>
              <div className="flex flex-wrap gap-2">
                {skills.map((skill, index) => (
                  <span key={index} className="px-3 py-1 bg-pink-100 text-pink-700 font-medium rounded-full">
                    {skill.name}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

interface ResumeTemplateProps {
  resume: Resume;
  onTemplateChange: (template: string) => void;
}

export default function ResumeTemplate({ resume, onTemplateChange }: ResumeTemplateProps) {
  const renderTemplate = () => {
    switch (resume.template) {
      case 'professional':
        return <ProfessionalTemplate resume={resume} />;
      case 'creative':
        return <CreativeTemplate resume={resume} />;
      case 'executive':
        return <ExecutiveTemplate resume={resume} />;
      case 'modern':
        return <ModernTemplate resume={resume} />;
      case 'minimal':
        return <MinimalTemplate resume={resume} />;
      case 'industry':
        return <IndustryTemplate resume={resume} />;
      case 'bold':
        return <BoldTemplate resume={resume} />;
      default:
        return <ProfessionalTemplate resume={resume} />;
    }
  };

  return (
    <Card>
      <CardHeader className="border-b border-secondary-200 px-4 py-4 sm:px-6 flex justify-between items-center">
        <h2 className="text-lg font-medium text-secondary-900">{resume.title || "Untitled Resume"}</h2>
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="text-xs"
            onClick={() => {
              // Create a form to post data
              const form = document.createElement('form');
              form.method = 'POST';
              form.action = '/api/generate-pdf';
              form.target = '_blank';
              
              // Add resume data as hidden input
              const resumeInput = document.createElement('input');
              resumeInput.type = 'hidden';
              resumeInput.name = 'resumeData';
              resumeInput.value = JSON.stringify(resume);
              form.appendChild(resumeInput);
              
              // Add template as hidden input
              const templateInput = document.createElement('input');
              templateInput.type = 'hidden';
              templateInput.name = 'template';
              templateInput.value = resume.template || 'professional';
              form.appendChild(templateInput);
              
              // Append to body, submit and remove
              document.body.appendChild(form);
              form.submit();
              document.body.removeChild(form);
            }}
          >
            <Download className="h-3 w-3 mr-1" /> Download PDF
          </Button>
          
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="text-xs">
                <Download className="h-3 w-3 mr-1" /> DOCX
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Export as DOCX</DialogTitle>
              </DialogHeader>
              <div className="py-4">
                <p className="text-secondary-600">
                  This would export your resume as a DOCX file in a real implementation.
                </p>
              </div>
            </DialogContent>
          </Dialog>
          
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="text-xs">
                Templates
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl">
              <DialogHeader>
                <DialogTitle>Choose a Resume Template</DialogTitle>
              </DialogHeader>
              <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                <TemplateOption
                  name="Professional"
                  description="Clean and modern"
                  preview={<TemplatePreviewProfessional />}
                  selected={resume.template === 'professional'}
                  onClick={() => onTemplateChange('professional')}
                />
                
                <TemplateOption
                  name="Creative"
                  description="Stand out with style"
                  preview={<TemplatePreviewCreative />}
                  selected={resume.template === 'creative'}
                  onClick={() => onTemplateChange('creative')}
                />
                
                <TemplateOption
                  name="Executive"
                  description="Elegant and professional"
                  preview={<TemplatePreviewExecutive />}
                  selected={resume.template === 'executive'}
                  onClick={() => onTemplateChange('executive')}
                />
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {renderTemplate()}
      </CardContent>
    </Card>
  );
}
