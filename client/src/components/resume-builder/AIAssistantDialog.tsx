import React from "react";
import AIAssistant from "@/components/ai-assistant";
import { Button } from "@/components/ui/button";
import { Cpu, X } from "lucide-react";

interface AIAssistantDialogProps {
  resumeId?: string;
  isOpen: boolean;
  onClose: () => void;
  onApplySummary?: (summary: string) => void;
  onApplyBulletPoint?: (bulletPoint: string) => void;
  onApplySkill?: (skill: string) => void;
  resume?: any;
  activeTab?: string;
}

export default function AIAssistantDialog({
  resumeId,
  isOpen,
  onClose,
  onApplySummary,
  onApplyBulletPoint,
  onApplySkill,
  resume,
  activeTab
}: AIAssistantDialogProps) {
  if (!isOpen) return null;
  
  return (
    <div className="fixed bottom-24 right-6 z-50 w-96 max-w-full shadow-xl rounded-lg overflow-hidden transition-all duration-300 ease-in-out">
      <div className="bg-gradient-to-r from-blue-900 to-purple-900 p-3 flex justify-between items-center border-b border-blue-500/30">
        <div className="flex items-center">
          <Cpu className="h-5 w-5 text-blue-300 mr-2" />
          <h3 className="text-white font-medium">AI Resume Assistant</h3>
        </div>
        <Button
          variant="ghost"
          onClick={onClose}
          className="h-7 w-7 p-0 text-blue-300 hover:text-blue-100 hover:bg-blue-800/50"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
      <div className="bg-black/90 border-x border-blue-500/30 border-b p-4 h-96 overflow-y-auto">
        <AIAssistant
          resumeId={resumeId?.toString()}
          onApplySummary={onApplySummary}
          onApplyBulletPoint={onApplyBulletPoint}
          onApplySkill={onApplySkill}
          resume={resume}
          activeTab={activeTab}
        />
      </div>
    </div>
  );
}