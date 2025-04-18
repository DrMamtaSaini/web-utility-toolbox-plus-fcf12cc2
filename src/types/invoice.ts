
export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  price: number;
}

export interface InvoiceDetails {
  invoiceNumber: string;
  date: string;
  dueDate: string;
  companyName: string;
  clientName: string;
  clientEmail: string;
  clientAddress: string;
}
