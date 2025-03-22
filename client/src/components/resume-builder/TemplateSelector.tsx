import React from "react";
import {
  TemplatePreviewProfessional,
  TemplatePreviewCreative,
  TemplatePreviewExecutive,
  TemplatePreviewModern,
  TemplatePreviewMinimal,
  TemplatePreviewIndustry,
  TemplatePreviewBold
} from "@/components/resume-template";
import { Check } from "lucide-react";

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
      className={`relative group cursor-pointer overflow-hidden rounded-md border transition-all ${
        selected
          ? "border-blue-500 bg-blue-500/10"
          : "border-blue-500/20 hover:border-blue-500/50 bg-slate-900/50"
      }`}
      onClick={onClick}
    >
      <div className="p-3 bg-gradient-to-r from-blue-900/30 to-indigo-900/30 border-b border-blue-500/20">
        <div className="flex justify-between items-center">
          <h3 className="font-medium text-blue-100">{name}</h3>
          {selected && (
            <span className="bg-blue-500 text-white p-1 rounded-full">
              <Check className="h-3 w-3" />
            </span>
          )}
        </div>
        <p className="text-xs text-blue-300 mt-1">{description}</p>
      </div>
      <div className="p-2 aspect-[3/4] overflow-hidden bg-white flex items-center justify-center">
        {preview}
      </div>
    </div>
  );
}

interface TemplateSelectorProps {
  selectedTemplate: string;
  onTemplateChange: (template: string) => void;
}

export default function TemplateSelector({ 
  selectedTemplate, 
  onTemplateChange 
}: TemplateSelectorProps) {
  const templates = [
    {
      id: "professional",
      name: "Professional",
      description: "Clean and traditional layout for corporate roles",
      preview: <TemplatePreviewProfessional />,
    },
    {
      id: "modern",
      name: "Modern",
      description: "Contemporary design with a fresh layout",
      preview: <TemplatePreviewModern />,
    },
    {
      id: "creative",
      name: "Creative",
      description: "Unique design for creative industries",
      preview: <TemplatePreviewCreative />,
    },
    {
      id: "executive",
      name: "Executive",
      description: "Sophisticated layout for senior positions",
      preview: <TemplatePreviewExecutive />,
    },
    {
      id: "minimal",
      name: "Minimal",
      description: "Simple, clean design with focus on content",
      preview: <TemplatePreviewMinimal />,
    },
    {
      id: "industry",
      name: "Industry",
      description: "Specialized format for technical roles",
      preview: <TemplatePreviewIndustry />,
    },
    {
      id: "bold",
      name: "Bold",
      description: "High-impact design that stands out",
      preview: <TemplatePreviewBold />,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-4">
      {templates.map((template) => (
        <TemplateOption
          key={template.id}
          name={template.name}
          description={template.description}
          preview={template.preview}
          selected={selectedTemplate === template.id}
          onClick={() => onTemplateChange(template.id)}
        />
      ))}
    </div>
  );
}