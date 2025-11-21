"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "../../../components/Sidebar";
import DashboardContent from "../../../components/DashboardContent";
import Pagination from "../../../components/Pagination";
import SearchIcon from "@mui/icons-material/Search";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddButton from "../../../components/AddButton";
import PaymentIcon from "@mui/icons-material/Payment";
import DollarSignIcon from "@mui/icons-material/AttachMoney";
import PendingIcon from "@mui/icons-material/Pending";
import WarningIcon from "@mui/icons-material/Warning";
import { payments } from "@/src/data/payments";
import { Payment } from "@/src/definitions/interfaces/payments";
import { cn } from "@/lib/utils";
import { useGenericModal } from "@/src/contexts/GenericModalContext";
import AddPaymentModal from "./components/AddPaymentModal";
import EditPaymentModal from "./components/EditPaymentModal";

type PaymentFormData = Omit<Payment, "id">;

const PaymentsPage = () => {
  const router = useRouter();
  const { openModal } = useGenericModal();
  const [searchStudentName, setSearchStudentName] = useState("");
  const [searchSchool, setSearchSchool] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterPaymentMethod, setFilterPaymentMethod] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const itemsPerPage = 5;

  const handleAddSubmit = (data: PaymentFormData) => {
    // Handle add payment logic here
    console.log("Adding payment:", data);
  };

  const handleEdit = (payment: Payment) => {
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

  const handleEditSubmit = (data: PaymentFormData) => {
    // Handle edit payment logic here
    console.log("Editing payment:", data);
  };

  // Filter payments
  const filteredPayments = payments.filter((payment) => {
    const matchesStudentName = payment.studentName
      .toLowerCase()
      .includes(searchStudentName.toLowerCase());
    const matchesSchool = payment.school
      .toLowerCase()
      .includes(searchSchool.toLowerCase());
    const matchesStatus =
      filterStatus === "all" || payment.status === filterStatus;
    const matchesPaymentMethod =
      filterPaymentMethod === "all" || payment.paymentMethod === filterPaymentMethod;
    return matchesStudentName && matchesSchool && matchesStatus && matchesPaymentMethod;
  });

  // Pagination
  const totalPages = Math.ceil(filteredPayments.length / itemsPerPage);
  const paginatedPayments = filteredPayments.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

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
        return 'Transfer';
      case 'card':
        return 'Card';
      case 'mobile':
        return 'Mobile';
      default:
        return method;
    }
  };

  // Format number with consistent locale
  const formatCurrency = (amount: number) => {
    return amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  // Calculate payment statistics
  const paymentStats = {
    totalPayments: filteredPayments.length,
    totalPaid: filteredPayments.filter(p => p.status === 'paid').length,
    totalPending: filteredPayments.filter(p => p.status === 'pending').length,
    totalOverdue: filteredPayments.filter(p => p.status === 'overdue').length,
    totalRevenue: filteredPayments.filter(p => p.status === 'paid').reduce((sum, p) => sum + p.amount, 0),
    pendingAmount: filteredPayments.filter(p => p.status === 'pending').reduce((sum, p) => sum + p.amount, 0),
    overdueAmount: filteredPayments.filter(p => p.status === 'overdue').reduce((sum, p) => sum + p.amount, 0),
    paymentRate: filteredPayments.length > 0 
      ? ((filteredPayments.filter(p => p.status === 'paid').length / filteredPayments.length) * 100).toFixed(1)
      : '0'
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />

      <DashboardContent>
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="font-heading text-2xl font-bold text-gray-900 mb-1">
              Payments Management
            </h1>
            <p className="text-sm text-gray-600">Track and manage student payments</p>
          </div>
          <AddButton
            label="Add Payment"
            icon={PaymentIcon}
            onClick={() =>
              openModal({
                title: "Add New Payment",
                size: "2xl",
                content: (
                  <AddPaymentModal
                    onSubmit={handleAddSubmit}
                  />
                ),
              })
            }
            bgColor="#33CC00"
          />
        </div>

        {/* Payment Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <StatCard
            title="Total Payments"
            value={paymentStats.totalPayments}
            icon={PaymentIcon}
            trend={`${paymentStats.totalPaid} paid`}
            color="pink"
            subtitle={`${paymentStats.totalPending} pending, ${paymentStats.totalOverdue} overdue`}
          />
          <StatCard
            title="Total Revenue"
            value={`$${formatCurrency(paymentStats.totalRevenue)}`}
            icon={DollarSignIcon}
            trend={`${paymentStats.paymentRate}% payment rate`}
            color="green"
            subtitle={`$${formatCurrency(paymentStats.pendingAmount)} pending`}
          />
          <StatCard
            title="Pending Payments"
            value={paymentStats.totalPending}
            icon={PendingIcon}
            trend={`$${formatCurrency(paymentStats.pendingAmount)}`}
            color="yellow"
            subtitle={`${paymentStats.totalPayments > 0 ? ((paymentStats.totalPending / paymentStats.totalPayments) * 100).toFixed(1) : 0}% of total`}
          />
          <StatCard
            title="Overdue Payments"
            value={paymentStats.totalOverdue}
            icon={WarningIcon}
            trend={`$${formatCurrency(paymentStats.overdueAmount)}`}
            color="purple"
            subtitle={`Requires immediate attention`}
          />
        </div>

        {/* Search and Filters */}
        <div className="mb-4 bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="relative">
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by student name..."
                value={searchStudentName}
                onChange={(e) => setSearchStudentName(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF0098] focus:border-transparent"
              />
            </div>
            <div className="relative">
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by school..."
                value={searchSchool}
                onChange={(e) => setSearchSchool(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF0098] focus:border-transparent"
              />
            </div>
            <div className="relative">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF0098] focus:border-transparent text-gray-700"
              >
                <option value="all">All Status</option>
                <option value="paid">Paid</option>
                <option value="pending">Pending</option>
                <option value="overdue">Overdue</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
            <div className="relative">
              <div className="h-full rounded-lg border border-gray-300 overflow-hidden flex">
                <button
                  onClick={() => setFilterPaymentMethod("all")}
                  className={cn(
                    "flex-1 px-3 py-2 text-sm font-medium transition-colors",
                    filterPaymentMethod === "all"
                      ? "bg-gray-200 text-gray-700"
                      : "bg-white text-gray-700 hover:bg-gray-50"
                  )}
                >
                  All
                </button>
                <button
                  onClick={() => setFilterPaymentMethod("cash")}
                  className={cn(
                    "flex-1 px-3 py-2 text-sm font-medium transition-colors",
                    filterPaymentMethod === "cash"
                      ? "bg-[#FF0098]/10 text-[#FF0098]"
                      : "bg-white text-gray-700 hover:bg-[#FF0098]/5"
                  )}
                >
                  Cash
                </button>
                <button
                  onClick={() => setFilterPaymentMethod("transfer")}
                  className={cn(
                    "flex-1 px-3 py-2 text-sm font-medium transition-colors",
                    filterPaymentMethod === "transfer"
                      ? "bg-[#33CC00]/10 text-[#33CC00]"
                      : "bg-white text-gray-700 hover:bg-[#33CC00]/5"
                  )}
                >
                  Transfer
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Payments Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                    ID
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                    Student
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                    Amount
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                    Date
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                    Due Date
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                    Method
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {isLoading ? (
                  <tr>
                    <td colSpan={8} className="px-6 py-8 text-center">
                      <div className="flex flex-col items-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#FF0098] mb-4"></div>
                        <p className="text-gray-600">Loading payments...</p>
                      </div>
                    </td>
                  </tr>
                ) : paginatedPayments.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-6 py-8 text-center">
                      <div className="flex flex-col items-center">
                        <PaymentIcon className="w-12 h-12 text-gray-400 mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                          No Payments Found
                        </h3>
                        <p className="text-gray-600">
                          {searchStudentName || searchSchool || filterStatus !== "all" || filterPaymentMethod !== "all"
                            ? "Try adjusting your search filters"
                            : "Start by adding your first payment"}
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  paginatedPayments.map((payment) => (
                    <tr key={payment.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <p className="font-medium text-gray-900 text-sm">
                        #{payment.id}
                      </p>
                    </td>
                    <td className="px-4 py-3">
                      <div>
                        <p className="font-medium text-gray-900 text-sm">
                          {payment.studentName}
                        </p>
                        <p className="text-xs text-gray-500">
                          {payment.school}
                        </p>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-semibold text-gray-900 text-sm">
                        ${payment.amount.toFixed(2)}
                      </p>
                      <p className="text-xs text-gray-500">{payment.currency}</p>
                    </td>
                    <td className="px-4 py-3 text-gray-600 text-sm">
                      {new Date(payment.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </td>
                    <td className="px-4 py-3 text-gray-600 text-sm">
                      {new Date(payment.dueDate).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={cn(
                          "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium",
                          getStatusColor(payment.status)
                        )}
                      >
                        {getStatusLabel(payment.status)}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-gray-600 text-sm">
                        {getPaymentMethodLabel(payment.paymentMethod)}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => router.push(`/dashboard/payments/${payment.id}`)}
                          className="text-[#FF0098] hover:text-[#FF0098]/80 transition-colors"
                          title="View details"
                        >
                          <VisibilityIcon fontSize="small" />
                        </button>
                        <button
                          onClick={() => handleEdit(payment)}
                          className="text-gray-500 hover:text-gray-700 transition-colors"
                          title="Edit"
                        >
                          <EditIcon fontSize="small" />
                        </button>
                        <button
                          className="text-gray-500 hover:text-red-600 transition-colors"
                          title="Delete"
                        >
                          <DeleteIcon fontSize="small" />
                        </button>
                      </div>
                    </td>
                  </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {!isLoading && paginatedPayments.length > 0 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              totalItems={filteredPayments.length}
              itemsPerPage={itemsPerPage}
            />
          )}
        </div>
      </DashboardContent>
    </div>
  );
};

// StatCard component for payment statistics
interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ElementType;
  trend: string;
  color: 'pink' | 'green' | 'yellow' | 'purple';
  subtitle?: string;
}

function StatCard({ title, value, icon: Icon, trend, color, subtitle }: StatCardProps) {
  const bgColorClasses = {
    pink: '#FF0098',
    green: '#33CC00',
    yellow: '#f2bf3c',
    purple: '#9000d9'
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 hover:shadow-lg transition-all hover:scale-105" style={{ fontFamily: 'var(--font-poppins)' }}>
      <div className="flex items-center justify-between mb-2">
        <div
          className="w-10 h-10 rounded-lg flex items-center justify-center"
          style={{ backgroundColor: bgColorClasses[color] }}
        >
          <Icon className="w-5 h-5 text-white" />
        </div>
        <span className="text-xs font-semibold text-gray-600" style={{ fontFamily: 'var(--font-poppins)' }}>
          {trend}
        </span>
      </div>
      <p className="text-xs text-gray-600 mb-1" style={{ fontFamily: 'var(--font-poppins)' }}>{title}</p>
      <p className="text-2xl font-bold mb-1" style={{ color: bgColorClasses[color], fontFamily: 'var(--font-montserrat)' }}>
        {value}
      </p>
      {subtitle && (
        <p className="text-xs text-gray-500" style={{ fontFamily: 'var(--font-poppins)' }}>{subtitle}</p>
      )}
    </div>
  );
}

export default PaymentsPage;
