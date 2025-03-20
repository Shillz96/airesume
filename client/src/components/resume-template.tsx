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
      default:
        return <ProfessionalTemplate resume={resume} />;
    }
  };

  return (
    <Card>
      <CardHeader className="border-b border-secondary-200 px-4 py-4 sm:px-6 flex justify-between items-center">
        <h2 className="text-lg font-medium text-secondary-900">{resume.title || "Untitled Resume"}</h2>
        <div className="flex space-x-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="text-xs">
                <Download className="h-3 w-3 mr-1" /> PDF
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Export as PDF</DialogTitle>
              </DialogHeader>
              <div className="py-4">
                <p className="text-secondary-600">
                  This would export your resume as a PDF file in a real implementation.
                </p>
              </div>
            </DialogContent>
          </Dialog>
          
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
