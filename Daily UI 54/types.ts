
export type DialogVariant = 'default' | 'danger' | 'success' | 'warning' | 'info';
export type DialogSize = 'sm' | 'md' | 'lg' | 'xl';

export interface ConfirmationDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmButtonText?: string;
  cancelButtonText?: string;
  variant?: DialogVariant;
  size?: DialogSize;
  isLoading?: boolean;
}

export interface Scenario {
  id: string;
  title: string;
  description: string;
  variant: DialogVariant;
  actionLabel: string;
}
