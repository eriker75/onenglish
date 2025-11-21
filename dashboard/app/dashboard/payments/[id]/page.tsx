"use client";

import { useParams, useRouter } from "next/navigation";
import Sidebar from "../../../../components/Sidebar";
import DashboardContent from "../../../../components/DashboardContent";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { payments } from "@/src/data/payments";
import { cn } from "@/lib/utils";
import { useGenericModal } from "@/src/contexts/GenericModalContext";
import EditPaymentModal from "../components/EditPaymentModal";
import { Payment } from "@/src/definitions/interfaces/payments";

type PaymentFormData = Omit<Payment, "id">;

const PaymentDetailPage = () => {
  const params = useParams();
  const router = useRouter();
  const { openModal } = useGenericModal();
  const paymentId = parseInt(params.id as string);

  const payment = payments.find((p) => p.id === paymentId);

  const handleEditSubmit = (data: PaymentFormData) => {
    // Handle edit payment logic here
    console.log("Editing payment:", data);
  };

  const handleEdit = () => {
    if (!payment) return;
    openModal({
      title: `Edit Payment #${payment.id}`,
      size: "2xl",
      content: (
        <EditPaymentModal
          payment={payment}
          onSubmit={handleEditSubmit}
        />
      ),
    });
  };

  if (!payment) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Sidebar />
        <DashboardContent>
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Payment Not Found
            </h2>
            <p className="text-gray-600 mb-6">
              The payment you're looking for doesn't exist.
            </p>
            <button
              onClick={() => router.push("/dashboard/payments")}
              className="px-6 py-2 bg-[#FF0098] text-white rounded-lg hover:bg-[#FF0098]/90 transition-colors"
            >
              Back to Payments
            </button>
          </div>
        </DashboardContent>
      </div>
    );
  }

  // Get status badge color
  const getStatusColor = (status: Payment['status']) => {
    switch (status) {
      case 'paid':
        return 'bg-[#33CC00]/10 text-[#33CC00]';
      case 'pending':
        return 'bg-yellow-100 text-yellow-700';
      case 'overdue':
        return 'bg-red-100 text-red-700';
      case 'cancelled':
        return 'bg-gray-100 text-gray-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  // Get status label
  const getStatusLabel = (status: Payment['status']) => {
    switch (status) {
      case 'paid':
        return 'Paid';
      case 'pending':
        return 'Pending';
      case 'overdue':
        return 'Overdue';
      case 'cancelled':
        return 'Cancelled';
      default:
        return status;
    }
  };

  // Get payment method label
  const getPaymentMethodLabel = (method: Payment['paymentMethod']) => {
    switch (method) {
      case 'cash':
        return 'Cash';
      case 'transfer':
        return 'Bank Transfer';
      case 'card':
        return 'Credit/Debit Card';
      case 'mobile':
        return 'Mobile Payment';
      default:
        return method;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />

      <DashboardContent>
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.push("/dashboard/payments")}
            className="flex items-center gap-2 text-[#FF0098] hover:text-[#FF0098]/80 mb-4 transition-colors"
          >
            <ArrowBackIcon fontSize="small" />
            <span>Back to Payments</span>
          </button>

          <div className="flex items-start justify-between">
            <div>
              <h1 className="font-heading text-3xl font-bold text-gray-900 mb-2">
                Payment #{payment.id}
              </h1>
              <p className="text-gray-600">
                Payment details and transaction information
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleEdit}
                className="flex items-center gap-2 px-4 py-2 bg-[#FF0098] text-white rounded-lg hover:bg-[#FF0098]/90 transition-colors"
              >
                <EditIcon fontSize="small" />
                Edit
              </button>
              <button className="flex items-center gap-2 px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors">
                <DeleteIcon fontSize="small" />
                Delete
              </button>
            </div>
          </div>
        </div>

        {/* Payment Information Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Payment Status Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Payment Status
            </h2>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600 mb-1">Status</p>
                <span
                  className={cn(
                    "inline-flex items-center px-3 py-1 rounded-full text-sm font-medium",
                    getStatusColor(payment.status)
                  )}
                >
                  {getStatusLabel(payment.status)}
                </span>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Amount</p>
                <p className="text-2xl font-bold text-gray-900">
                  ${payment.amount.toFixed(2)} {payment.currency}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Payment Method</p>
                <p className="text-gray-900 font-medium">
                  {getPaymentMethodLabel(payment.paymentMethod)}
                </p>
              </div>
              {payment.reference && (
                <div>
                  <p className="text-sm text-gray-600 mb-1">Reference Number</p>
                  <p className="text-gray-900 font-mono text-sm">
                    {payment.reference}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Student Information Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Student Information
            </h2>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600 mb-1">Student Name</p>
                <p className="text-gray-900 font-medium">{payment.studentName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Student ID</p>
                <p className="text-gray-900">#{payment.studentId}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">School</p>
                <p className="text-gray-900">{payment.school}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Grade</p>
                <p className="text-gray-900">{payment.grade}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Date Information Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Date Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-gray-600 mb-1">Payment Date</p>
              <p className="text-gray-900 font-medium">
                {new Date(payment.date).toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Due Date</p>
              <p className="text-gray-900 font-medium">
                {new Date(payment.dueDate).toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>
          </div>
        </div>

        {/* Notes Card */}
        {payment.notes && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Notes</h2>
            <p className="text-gray-700 whitespace-pre-wrap">{payment.notes}</p>
          </div>
        )}
      </DashboardContent>
    </div>
  );
};

export default PaymentDetailPage;
