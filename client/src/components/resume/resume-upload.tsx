import React, { useState } from "react";
import { Upload, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { useMutation } from "@tanstack/react-query";
import { Resume } from "@/components/resume-template";

interface ResumeUploadProps {
  onUploadSuccess: (resumeData: Partial<Resume>) => void;
}

export default function ResumeUpload({ onUploadSuccess }: ResumeUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const uploadMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      return apiRequest("POST", "/api/resumes/upload", formData, {
        // Don't set Content-Type header as FormData will set it with boundary
      });
    },
    onSuccess: (data: any) => {
      toast({
        title: "Resume uploaded successfully",
        description: "Your resume has been parsed and data extracted.",
      });
      
      // Clear the file input
      setFile(null);
      
      // Pass the parsed resume data to the parent component
      if (data && typeof data === 'object') {
        onUploadSuccess(data as Partial<Resume>);
      }
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to upload resume",
        description: error.message || "There was an error uploading your resume. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      toast({
        title: "No file selected",
        description: "Please select a file to upload.",
        variant: "destructive",
      });
      return;
    }

    // Check file type
    const validFileTypes = [
      "application/pdf", 
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // docx
      "application/msword", // doc
      "text/plain" // txt
    ];
    
    if (!validFileTypes.includes(file.type)) {
      toast({
        title: "Invalid file type",
        description: "Please upload a PDF, Word document, or text file.",
        variant: "destructive",
      });
      return;
    }

    // Check file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB in bytes
    if (file.size > maxSize) {
      toast({
        title: "File too large",
        description: "Please upload a file smaller than 5MB.",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    
    try {
      const formData = new FormData();
      formData.append("resumeFile", file);
      
      await uploadMutation.mutateAsync(formData);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Card className="w-full bg-[rgba(10,15,40,0.5)] backdrop-blur-sm border border-indigo-900/30">
      <CardHeader>
        <CardTitle className="text-lg text-blue-300">Upload Resume</CardTitle>
        <CardDescription className="text-gray-400">
          Upload an existing resume to get started
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4">
          <div className="border-2 border-dashed border-blue-800/50 rounded-lg p-6 text-center hover:border-blue-600/50 transition-colors">
            <Input
              type="file"
              id="resume-file"
              className="hidden"
              accept=".pdf,.doc,.docx,.txt"
              onChange={handleFileChange}
            />
            <label
              htmlFor="resume-file"
              className="cursor-pointer flex flex-col items-center gap-2"
            >
              <Upload size={32} className="text-blue-400" />
              <p className="text-blue-300">
                {file ? file.name : "Click to select a file"}
              </p>
              <p className="text-xs text-gray-400">
                Supported formats: PDF, Word, Text
              </p>
            </label>
          </div>

          {file && (
            <div className="flex items-center gap-2 text-sm text-blue-300 bg-blue-900/20 p-2 rounded-md">
              <AlertCircle size={16} />
              <span>
                Resume will be processed automatically. You can then edit and
                refine the content.
              </span>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter>
        <Button
          onClick={handleUpload}
          disabled={!file || isUploading}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
        >
          {isUploading ? "Processing..." : "Upload & Parse Resume"}
        </Button>
      </CardFooter>
    </Card>
  );
}