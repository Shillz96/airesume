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
      className={`rounded-lg border transition-all cursor-pointer overflow-hidden ${
        selected 
          ? "border-cosmic-accent ring-2 ring-cosmic-accent/30" 
          : "border-cosmic-border hover:border-cosmic-accent/50"
      }`}
      onClick={onClick}
      style={{ transition: 'var(--transition-standard)' }}
    >
      <div className="aspect-[8.5/11] bg-cosmic-card-secondary relative">
        <div className="absolute inset-0 p-2" style={{ padding: 'var(--space-2)' }}>
          {preview}
        </div>
        
        {selected && (
          <div className="absolute top-2 right-2 bg-cosmic-accent text-white rounded-full p-1" style={{ padding: 'var(--space-1)', top: 'var(--space-2)', right: 'var(--space-2)' }}>
            <Check className="h-3 w-3" />
          </div>
        )}
      </div>
      
      <div className="p-3 bg-cosmic-card-secondary border-t border-cosmic-border" style={{ padding: 'var(--space-3)' }}>
        <h4 className="font-medium text-cosmic-text text-sm">{name}</h4>
        <p className="text-cosmic-text-secondary text-xs mt-1" style={{ marginTop: 'var(--space-1)' }}>{description}</p>
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
      description: "Clean and traditional layout for most industries",
      preview: <TemplatePreviewProfessional />
    },
    {
      id: "creative",
      name: "Creative",
      description: "Modern design for creative fields with colorful accents",
      preview: <TemplatePreviewCreative />
    },
    {
      id: "executive",
      name: "Executive",
      description: "Elegant and formal template for senior professionals",
      preview: <TemplatePreviewExecutive />
    },
    {
      id: "modern",
      name: "Modern",
      description: "Contemporary design with sidebar and accent colors",
      preview: <TemplatePreviewModern />
    },
    {
      id: "minimal",
      name: "Minimal",
      description: "Simple, clean layout focusing on content",
      preview: <TemplatePreviewMinimal />
    },
    {
      id: "industry",
      name: "Industry",
      description: "Industry-focused template highlighting competencies",
      preview: <TemplatePreviewIndustry />
    },
    {
      id: "bold",
      name: "Bold",
      description: "Strong visual impact with bold headers and colors",
      preview: <TemplatePreviewBold />
    }
  ];

  return (
    <div className="space-y-6">
      <div className="cosmic-card border border-white/10 bg-black/30 p-6 rounded-lg">
        <h2 className="text-lg font-medium mb-2 text-white">Choose a Template</h2>
        <p className="text-gray-300 mb-6">
          Select a template that best showcases your skills and matches your target industry. Your content will automatically adapt to the new design.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
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
      </div>
    </div>
  );
}