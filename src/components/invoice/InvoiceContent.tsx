
import { InvoiceItem, InvoiceDetails } from "@/types/invoice";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface InvoiceContentProps {
  details: InvoiceDetails;
  items: InvoiceItem[];
}

const InvoiceContent = ({ details, items }: InvoiceContentProps) => {
  const calculateTotal = () => {
    return items.reduce((sum, item) => sum + (item.quantity * item.price), 0);
  };

  return (
    <div className="space-y-6 p-6">
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold">From:</h3>
            <p>{details.companyName}</p>
          </div>
          <div>
            <p>Invoice #: {details.invoiceNumber}</p>
            <p>Date: {details.date}</p>
            <p>Due Date: {details.dueDate}</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <h3 className="font-semibold">Bill To:</h3>
            <p>{details.clientName}</p>
            <p>{details.clientEmail}</p>
            <p>{details.clientAddress}</p>
          </div>
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Description</TableHead>
            <TableHead className="w-24">Quantity</TableHead>
            <TableHead className="w-32">Price</TableHead>
            <TableHead className="w-32">Total</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item) => (
            <TableRow key={item.id}>
              <TableCell>{item.description}</TableCell>
              <TableCell>{item.quantity}</TableCell>
              <TableCell>${item.price.toFixed(2)}</TableCell>
              <TableCell>${(item.quantity * item.price).toFixed(2)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="flex justify-end">
        <div className="w-32">
          <div className="flex justify-between font-semibold">
            <span>Total:</span>
            <span>${calculateTotal().toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceContent;
