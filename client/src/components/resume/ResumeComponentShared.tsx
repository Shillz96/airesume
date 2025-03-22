import React from 'react';
import { IconType } from 'react-icons';
import { 
  PlusIcon, 
  InfoIcon, 
  BriefcaseIcon, 
  GraduationCapIcon, 
  WrenchIcon, 
  FolderIcon,
  Trash2Icon,
  EditIcon,
  EyeIcon,
  SaveIcon,
  CopyIcon
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CosmicButton } from '@/components/cosmic-button-refactored';
import { useTheme } from '@/contexts/ThemeContext';

/**
 * Common section header component for resume sections
 */
export interface SectionHeaderProps {
  title: string;
  icon?: React.ReactNode;
  onAdd?: () => void;
  addButtonText?: string;
  className?: string;
}

export function SectionHeader({ title, icon, onAdd, addButtonText = 'Add', className = '' }: SectionHeaderProps) {
  const { isDarkMode } = useTheme();
  
  return (
    <div className={`cosmic-section-header ${className}`}>
      {icon && <span className="icon text-primary text-xl">{icon}</span>}
      <h3 className="font-semibold text-lg flex-1">{title}</h3>
      {onAdd && (
        <CosmicButton
          size="sm"
          variant="outline"
          onClick={onAdd}
          iconLeft={<PlusIcon className="w-4 h-4" />}
          withGlow
        >
          {addButtonText}
        </CosmicButton>
      )}
    </div>
  );
}

/**
 * Section card component for wrapping resume section items
 */
export interface SectionCardProps {
  children: React.ReactNode;
  className?: string;
  isEditing?: boolean;
  withHoverEffect?: boolean;
}

export function SectionCard({ 
  children, 
  className = '', 
  isEditing = false, 
  withHoverEffect = true 
}: SectionCardProps) {
  return (
    <div 
      className={`cosmic-card p-4 mb-4 ${withHoverEffect ? 'cosmic-card-hoverable' : ''} ${
        isEditing ? 'border-primary/30 bg-primary/5' : ''
      } ${className}`}
    >
      {children}
    </div>
  );
}

/**
 * Action buttons for section items (edit/delete)
 */
export interface ItemActionsProps {
  onEdit?: () => void;
  onDelete?: () => void;
  onCopy?: () => void;
  onSave?: () => void;
  isEditing?: boolean;
  className?: string;
}

export function ItemActions({ 
  onEdit, 
  onDelete, 
  onCopy, 
  onSave, 
  isEditing = false,
  className = '' 
}: ItemActionsProps) {
  return (
    <div className={`flex gap-2 ${className}`}>
      {!isEditing && onEdit && (
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onEdit} 
          className="h-8 w-8 p-0"
          title="Edit"
        >
          <EditIcon className="h-4 w-4" />
        </Button>
      )}
      
      {isEditing && onSave && (
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onSave} 
          className="h-8 w-8 p-0"
          title="Save changes"
        >
          <SaveIcon className="h-4 w-4" />
        </Button>
      )}
      
      {onCopy && (
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onCopy} 
          className="h-8 w-8 p-0"
          title="Duplicate"
        >
          <CopyIcon className="h-4 w-4" />
        </Button>
      )}
      
      {onDelete && (
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onDelete} 
          className="h-8 w-8 p-0 hover:bg-destructive/10 hover:text-destructive"
          title="Delete"
        >
          <Trash2Icon className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}

/**
 * Get section icon by section type
 */
export function getSectionIcon(section: string): React.ReactNode {
  switch (section.toLowerCase()) {
    case 'personal':
    case 'personalinfo':
      return <InfoIcon />;
    case 'experience':
    case 'workexperience':
      return <BriefcaseIcon />;
    case 'education':
      return <GraduationCapIcon />;
    case 'skills':
      return <WrenchIcon />;
    case 'projects':
      return <FolderIcon />;
    default:
      return <InfoIcon />;
  }
}

/**
 * Format date for display in resume
 */
export function formatDate(dateString: string | undefined): string {
  if (!dateString) return '';
  
  if (dateString === 'Present') return 'Present';
  
  try {
    // Handle just year-month format (YYYY-MM)
    if (/^\d{4}-\d{2}$/.test(dateString)) {
      const [year, month] = dateString.split('-');
      return `${getMonthName(parseInt(month))} ${year}`;
    }
    
    // Handle full date format (YYYY-MM-DD)
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
      const date = new Date(dateString);
      return `${getMonthName(date.getMonth() + 1)} ${date.getFullYear()}`;
    }
    
    // Return as is if it doesn't match expected patterns
    return dateString;
  } catch (error) {
    console.error('Error formatting date:', error);
    return dateString;
  }
}

/**
 * Get month name from month number
 */
function getMonthName(month: number): string {
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  
  return months[month - 1] || '';
}