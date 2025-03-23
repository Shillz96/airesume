import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/ui/core/Card';
import { Button } from '@/ui/core/Button';
import { Skeleton } from '@/components/ui/skeleton';
import { useMutation, useQuery } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { Badge } from '@/components/ui/badge';
import { CareerPath, CareerSpecificAdvice, CareerDetectionResponse } from '../types';

interface CareerPathDetectionProps {
  resumeId?: number | string;
  onAdviceReceived?: (careerPath: CareerPath, advice: CareerSpecificAdvice) => void;
}

/**
 * CareerPathDetection component
 * Detects the likely career path from a resume and provides career-specific advice
 */
export default function CareerPathDetection({ resumeId, onAdviceReceived }: CareerPathDetectionProps) {
  const [showAdvice, setShowAdvice] = useState(false);
  
  // Query for resume data if resumeId is provided
  const resumeQuery = useQuery({
    queryKey: resumeId ? ['/api/resumes', resumeId] : null,
    enabled: !!resumeId
  });
  
  // Mutation to detect career path from resume
  const detectCareerMutation = useMutation({
    mutationFn: async () => {
      if (resumeId) {
        // If resumeId is provided, use the API endpoint that takes a saved resume
        return apiRequest<CareerDetectionResponse>(`/api/resumes/${resumeId}/career-path`, {
          method: 'GET'
        });
      } else if (resumeQuery.data) {
        // Otherwise use the direct detection endpoint with resume data
        return apiRequest<CareerDetectionResponse>('/api/careers/detect', {
          method: 'POST',
          body: JSON.stringify({ resume: resumeQuery.data })
        });
      }
      throw new Error('No resume data available for career detection');
    },
    onSuccess: (data) => {
      if (data.success && onAdviceReceived) {
        onAdviceReceived(data.careerPath, data.advice);
      }
      setShowAdvice(true);
    }
  });
  
  // Function to format career path for display
  const formatCareerPath = (path: string) => {
    return path
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };
  
  // Handler for detecting career path
  const handleDetectCareer = () => {
    detectCareerMutation.mutate();
  };
  
  const isLoading = resumeQuery.isLoading || detectCareerMutation.isPending;
  const hasDetected = detectCareerMutation.isSuccess && detectCareerMutation.data?.success;
  const careerPath = hasDetected ? detectCareerMutation.data.careerPath : '';
  const advice = hasDetected ? detectCareerMutation.data.advice : null;
  
  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl">Career Path Analysis</CardTitle>
        <CardDescription>
          Analyze your resume to detect your career path and get tailored advice
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-8 w-1/2" />
          </div>
        ) : !hasDetected ? (
          <div className="text-center py-8">
            <p className="mb-6">
              Click the button below to analyze your resume and identify your career path. 
              This will provide you with tailored advice specific to your profession.
            </p>
            <Button 
              onClick={handleDetectCareer} 
              disabled={isLoading || !resumeId}
              className="w-full sm:w-auto"
            >
              {isLoading ? 'Analyzing...' : 'Analyze My Career Path'}
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="text-center mb-4">
              <h3 className="text-xl font-medium mb-2">Your Detected Career Path</h3>
              <Badge variant="outline" className="text-lg py-1 px-3">
                {formatCareerPath(careerPath)}
              </Badge>
            </div>
            
            {showAdvice && advice && (
              <div className="space-y-6">
                <div>
                  <h4 className="text-lg font-medium mb-2">About This Career Path</h4>
                  <p className="text-muted-foreground">{advice.careerPathDescription}</p>
                </div>
                
                <div>
                  <h4 className="text-lg font-medium mb-2">Suggested Skills</h4>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {advice.suggestedSkills.map((skill, index) => (
                      <Badge key={index} variant="secondary" className="py-1">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="text-lg font-medium mb-2">Resume Tips</h4>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                    {advice.resumeTips.map((tip, index) => (
                      <li key={index}>{tip}</li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h4 className="text-lg font-medium mb-2">Valuable Certifications</h4>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {advice.certifications.map((cert, index) => (
                      <Badge key={index} variant="outline" className="py-1">
                        {cert}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="text-lg font-medium mb-2">Industry Keywords</h4>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {advice.industryKeywords.map((keyword, index) => (
                      <Badge key={index} variant="default" className="py-1 bg-accent text-accent-foreground">
                        {keyword}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
      
      <CardFooter className="flex justify-between">
        {hasDetected && (
          <Button 
            variant="outline" 
            onClick={() => {
              detectCareerMutation.reset();
              setShowAdvice(false);
            }}
          >
            Start Over
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}