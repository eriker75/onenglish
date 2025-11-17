export interface Payment {
  id: number;
  studentId: number;
  studentName: string;
  amount: number;
  currency: string;
  date: string;
  dueDate: string;
  status: 'paid' | 'pending' | 'overdue' | 'cancelled';
  paymentMethod: 'cash' | 'transfer' | 'card' | 'mobile';
  reference?: string;
  notes?: string;
  school: string;
  grade: string;
}
