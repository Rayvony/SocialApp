export interface ToastMessage {
  id?: number;
  severity: ToastSeverity;
  summary: string;
  detail?: string;
  duration?: number; // milisegundos, ej: 5000
}

export type ToastSeverity = 'success' | 'info' | 'warn' | 'danger';
