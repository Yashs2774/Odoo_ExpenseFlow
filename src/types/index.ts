// User related types
export interface User {
  id: number;
  name: string;
  email: string;
  role: 'Admin' | 'Manager' | 'Employee';
  manager?: string;
  isActive: boolean;
  createdAt?: string;
}

// Approval flow types
export interface ApprovalStep {
  stepOrder: number;
  approverUserId: number;
  approverName: string;
  isRequired: boolean;
}

export interface ApprovalRule {
  id: number;
  name: string;
  description: string;
  isManagerDefaultApprover: boolean;
  minApprovalPercentage: number | null;
  steps: ApprovalStep[];
  createdAt?: string;
}

// Company related types
export interface Company {
  id: number;
  name: string;
  baseCurrencyCode: string;
  country: string;
  createdAt: string;
}

// Expense related types (for future use)
export interface Expense {
  id: number;
  userId: number;
  category: string;
  description: string;
  expenseDate: string;
  originalAmount: number;
  originalCurrencyCode: string;
  convertedAmount: number;
  status: 'Draft' | 'Pending' | 'Approved' | 'Rejected';
  remarks?: string;
  submittedAt?: string;
  createdAt: string;
  updatedAt: string;
}

// Form types
export interface UserFormData {
  name: string;
  email: string;
  role: 'Admin' | 'Manager' | 'Employee';
  manager?: string;
}

export interface ApprovalRuleFormData {
  name: string;
  description: string;
  isManagerDefaultApprover: boolean;
  minApprovalPercentage?: number;
}

// API response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}