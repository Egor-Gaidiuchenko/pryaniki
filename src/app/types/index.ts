export type DocumentProps = {
    companySigDate: string;
    companySignatureName: string;
    documentName: string;
    documentStatus: string;
    documentType: string;
    employeeNumber: string;
    employeeSigDate: string;
    employeeSignatureName: string;
    id: string;
}
  
export type EditDocumentProps = {
  document: DocumentProps;
  onCancel: () => void;
  token: string;
}

export type ModalProps = {
  open: boolean;
  onClose: () => void;
  onConfirm?: () => void;
  title?: string;
  children: React.ReactNode;
  confirmText?: string;
  cancelText?: string;
}

export type TableProps<T> = {
  data: T[];
  onDelete: (id: string) => void;
  onEdit: (item: T) => void;
}