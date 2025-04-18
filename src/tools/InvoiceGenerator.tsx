import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { FileText, Plus, Printer, Save, Trash } from "lucide-react";
import { InvoiceItem, InvoiceDetails } from "@/types/invoice";
import { useToast } from "@/hooks/use-toast";
import InvoiceContent from "@/components/invoice/InvoiceContent";

const InvoiceGenerator = () => {
  const [items, setItems] = useState<InvoiceItem[]>([]);
  const [details, setDetails] = useState<InvoiceDetails>({
    invoiceNumber: "",
    date: new Date().toISOString().split('T')[0],
    dueDate: "",
    companyName: "",
    clientName: "",
    clientEmail: "",
    clientAddress: "",
  });
  const { toast } = useToast();

  const addItem = () => {
    const newItem: InvoiceItem = {
      id: Math.random().toString(36).substring(7),
      description: "",
      quantity: 1,
      price: 0,
    };
    setItems([...items, newItem]);
  };

  const updateItem = (id: string, field: keyof InvoiceItem, value: string | number) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  const removeItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  const calculateTotal = () => {
    return items.reduce((sum, item) => sum + (item.quantity * item.price), 0);
  };

  const invoiceRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    if (!details.invoiceNumber || !details.clientName) {
      toast({
        variant: "destructive",
        title: "Missing Information",
        description: "Please fill in the invoice number and client name before printing.",
      });
      return;
    }

    const content = document.createElement('div');
    if (invoiceRef.current) {
      content.innerHTML = invoiceRef.current.innerHTML;
      const originalContent = document.body.innerHTML;
      document.body.innerHTML = content.innerHTML;
      window.print();
      document.body.innerHTML = originalContent;
      window.location.reload();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center print:hidden">
        <div className="flex items-center gap-2">
          <FileText className="h-10 w-10 text-primary" />
          <h1 className="text-2xl font-bold">Invoice Generator</h1>
        </div>
        <div className="space-x-2">
          <Button variant="outline" onClick={handlePrint}>
            <Printer className="mr-2 h-4 w-4" />
            Print
          </Button>
          <Button onClick={() => {
            toast({
              title: "Invoice Saved",
              description: "Your invoice has been saved successfully.",
            });
          }}>
            <Save className="mr-2 h-4 w-4" />
            Save
          </Button>
        </div>
      </div>

      <div className="space-y-6 print:hidden">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-4">
            <div>
              <Label>Company Name</Label>
              <Input
                value={details.companyName}
                onChange={(e) => setDetails({ ...details, companyName: e.target.value })}
                placeholder="Your Company Name"
              />
            </div>
            <div>
              <Label>Invoice Number</Label>
              <Input
                value={details.invoiceNumber}
                onChange={(e) => setDetails({ ...details, invoiceNumber: e.target.value })}
                placeholder="INV-001"
              />
            </div>
            <div>
              <Label>Date</Label>
              <Input
                type="date"
                value={details.date}
                onChange={(e) => setDetails({ ...details, date: e.target.value })}
              />
            </div>
            <div>
              <Label>Due Date</Label>
              <Input
                type="date"
                value={details.dueDate}
                onChange={(e) => setDetails({ ...details, dueDate: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <Label>Client Name</Label>
              <Input
                value={details.clientName}
                onChange={(e) => setDetails({ ...details, clientName: e.target.value })}
                placeholder="Client Name"
              />
            </div>
            <div>
              <Label>Client Email</Label>
              <Input
                type="email"
                value={details.clientEmail}
                onChange={(e) => setDetails({ ...details, clientEmail: e.target.value })}
                placeholder="client@example.com"
              />
            </div>
            <div>
              <Label>Client Address</Label>
              <Input
                value={details.clientAddress}
                onChange={(e) => setDetails({ ...details, clientAddress: e.target.value })}
                placeholder="Client Address"
              />
            </div>
          </div>
        </div>

        <Separator />

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold">Items</h2>
            <Button variant="outline" onClick={addItem} className="print:hidden">
              <Plus className="mr-2 h-4 w-4" />
              Add Item
            </Button>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Description</TableHead>
                <TableHead className="w-24">Quantity</TableHead>
                <TableHead className="w-32">Price</TableHead>
                <TableHead className="w-32">Total</TableHead>
                <TableHead className="w-16 print:hidden"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <Input
                      value={item.description}
                      onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                      placeholder="Item description"
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) => updateItem(item.id, 'quantity', parseInt(e.target.value) || 0)}
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      min="0"
                      step="0.01"
                      value={item.price}
                      onChange={(e) => updateItem(item.id, 'price', parseFloat(e.target.value) || 0)}
                    />
                  </TableCell>
                  <TableCell className="font-medium">
                    ${(item.quantity * item.price).toFixed(2)}
                  </TableCell>
                  <TableCell className="print:hidden">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeItem(item.id)}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </TableCell>
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
      </div>

      {/* Invoice Preview - This is what gets printed */}
      <div ref={invoiceRef} className="border rounded-lg mt-8">
        <InvoiceContent details={details} items={items} />
      </div>
    </div>
  );
};

export default InvoiceGenerator;
