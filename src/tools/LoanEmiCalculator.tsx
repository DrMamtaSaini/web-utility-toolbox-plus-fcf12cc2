
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

interface EMIDetails {
  emi: number;
  totalPayment: number;
  totalInterest: number;
}

const LoanEmiCalculator = () => {
  const [loanAmount, setLoanAmount] = useState('');
  const [interestRate, setInterestRate] = useState('');
  const [loanTerm, setLoanTerm] = useState('');
  const [emiDetails, setEmiDetails] = useState<EMIDetails | null>(null);
  const { toast } = useToast();

  const calculateEMI = () => {
    if (!loanAmount || !interestRate || !loanTerm) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    const principal = parseFloat(loanAmount);
    const ratePerMonth = parseFloat(interestRate) / (12 * 100);
    const timeInMonths = parseFloat(loanTerm) * 12;

    const emi =
      (principal * ratePerMonth * Math.pow(1 + ratePerMonth, timeInMonths)) /
      (Math.pow(1 + ratePerMonth, timeInMonths) - 1);

    const totalPayment = emi * timeInMonths;
    const totalInterest = totalPayment - principal;

    setEmiDetails({
      emi,
      totalPayment,
      totalInterest,
    });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="loanAmount">Loan Amount</Label>
        <Input
          id="loanAmount"
          type="number"
          placeholder="Enter loan amount"
          value={loanAmount}
          onChange={(e) => setLoanAmount(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="interestRate">Interest Rate (% per annum)</Label>
        <Input
          id="interestRate"
          type="number"
          step="0.1"
          placeholder="Enter interest rate"
          value={interestRate}
          onChange={(e) => setInterestRate(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="loanTerm">Loan Term (in years)</Label>
        <Input
          id="loanTerm"
          type="number"
          placeholder="Enter loan term"
          value={loanTerm}
          onChange={(e) => setLoanTerm(e.target.value)}
        />
      </div>

      <Button onClick={calculateEMI} className="w-full">
        Calculate EMI
      </Button>

      {emiDetails && (
        <div className="space-y-4 p-4 bg-muted rounded-lg">
          <div>
            <Label>Monthly EMI</Label>
            <p className="text-2xl font-semibold">
              ₹ {emiDetails.emi.toFixed(2)}
            </p>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Total Payment</Label>
              <p className="text-lg">₹ {emiDetails.totalPayment.toFixed(2)}</p>
            </div>
            <div>
              <Label>Total Interest</Label>
              <p className="text-lg">₹ {emiDetails.totalInterest.toFixed(2)}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoanEmiCalculator;
