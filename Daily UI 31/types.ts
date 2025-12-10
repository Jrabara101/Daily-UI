export enum FileStatus {
  IDLE = 'IDLE',
  UPLOADING = 'UPLOADING', // The "Trapping" phase
  ANALYZING = 'ANALYZING', // The "PKE Meter" phase
  COMPLETED = 'COMPLETED', // "Contained"
  ERROR = 'ERROR'
}

export interface UploadedFile {
  id: string;
  file: File;
  previewUrl?: string;
  status: FileStatus;
  progress: number;
  analysis?: string; // Gemini result
  type: string;
  size: number;
}

export interface AnalysisStats {
  totalSize: number;
  typeDistribution: { name: string; value: number }[];
}

export interface DragState {
  isDragging: boolean;
}