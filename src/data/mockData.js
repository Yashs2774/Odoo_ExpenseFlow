// Mock current manager user
export const currentManager = {
  id: 2,
  name: 'Jane Smith',
  email: 'jane.smith@company.com',
  role: 'Manager',
  isActive: true,
  createdAt: '2025-01-01T00:00:00Z'
};

// Mock team members
export const teamMembers = [
  {
    id: 1,
    name: 'John Doe',
    email: 'john.doe@company.com',
    role: 'Employee',
    manager: 'Jane Smith',
    isActive: true,
    createdAt: '2025-01-15T00:00:00Z'
  },
  {
    id: 4,
    name: 'Alice Johnson',
    email: 'alice.johnson@company.com',
    role: 'Employee',
    manager: 'Jane Smith',
    isActive: true,
    createdAt: '2025-02-01T00:00:00Z'
  },
  {
    id: 5,
    name: 'Bob Wilson',
    email: 'bob.wilson@company.com',
    role: 'Employee',
    manager: 'Jane Smith',
    isActive: true,
    createdAt: '2025-02-15T00:00:00Z'
  }
];

// Mock expenses requiring approval
export const mockExpensesForApproval = [
  {
    id: 1,
    userId: 1,
    userName: 'John Doe',
    userEmail: 'john.doe@company.com',
    category: 'Travel',
    description: 'Flight tickets for business conference',
    expenseDate: '2025-09-30',
    originalAmount: 1250.00,
    originalCurrencyCode: 'USD',
    convertedAmount: 1250.00,
    baseCurrencyCode: 'USD',
    status: 'Pending',
    remarks: 'Annual tech conference in San Francisco. Round trip tickets.',
    submittedAt: '2025-10-01T09:15:00Z',
    createdAt: '2025-10-01T09:15:00Z',
    updatedAt: '2025-10-01T09:15:00Z',
    receiptUrl: '/receipts/flight_receipt_001.pdf',
    currentApprovalStep: 1,
    approvalHistory: [
      {
        stepOrder: 1,
        approverUserId: 2,
        approverName: 'Jane Smith',
        isRequired: true,
        status: 'Pending'
      }
    ],
    canCurrentUserApprove: true
  },
  {
    id: 2,
    userId: 4,
    userName: 'Alice Johnson',
    userEmail: 'alice.johnson@company.com',
    category: 'Food',
    description: 'Team lunch with clients',
    expenseDate: '2025-10-02',
    originalAmount: 156.80,
    originalCurrencyCode: 'USD',
    convertedAmount: 156.80,
    baseCurrencyCode: 'USD',
    status: 'Pending',
    remarks: 'Lunch meeting with ABC Corp representatives to discuss partnership',
    submittedAt: '2025-10-02T14:22:00Z',
    createdAt: '2025-10-02T14:22:00Z',
    updatedAt: '2025-10-02T14:22:00Z',
    receiptUrl: '/receipts/lunch_receipt_002.pdf',
    currentApprovalStep: 1,
    approvalHistory: [
      {
        stepOrder: 1,
        approverUserId: 2,
        approverName: 'Jane Smith',
        isRequired: true,
        status: 'Pending'
      }
    ],
    canCurrentUserApprove: true
  },
  {
    id: 3,
    userId: 5,
    userName: 'Bob Wilson',
    userEmail: 'bob.wilson@company.com',
    category: 'Lodging',
    description: 'Hotel accommodation for conference',
    expenseDate: '2025-09-28',
    originalAmount: 850.75,
    originalCurrencyCode: 'EUR',
    convertedAmount: 935.82,
    baseCurrencyCode: 'USD',
    status: 'Pending',
    remarks: 'Three-night stay for annual tech conference in Berlin',
    submittedAt: '2025-10-01T11:45:00Z',
    createdAt: '2025-10-01T11:45:00Z',
    updatedAt: '2025-10-01T11:45:00Z',
    receiptUrl: '/receipts/hotel_receipt_003.pdf',
    currentApprovalStep: 1,
    approvalHistory: [
      {
        stepOrder: 1,
        approverUserId: 2,
        approverName: 'Jane Smith',
        isRequired: true,
        status: 'Pending'
      }
    ],
    canCurrentUserApprove: true,
    nextApprover: 'Finance Manager'
  },
  {
    id: 4,
    userId: 1,
    userName: 'John Doe',
    userEmail: 'john.doe@company.com',
    category: 'Transportation',
    description: 'Taxi rides during business trip',
    expenseDate: '2025-10-02',
    originalAmount: 120.50,
    originalCurrencyCode: 'USD',
    convertedAmount: 120.50,
    baseCurrencyCode: 'USD',
    status: 'Pending',
    remarks: 'Airport transfers and client visit transportation',
    submittedAt: '2025-10-03T16:20:00Z',
    createdAt: '2025-10-03T16:20:00Z',
    updatedAt: '2025-10-03T16:20:00Z',
    receiptUrl: '/receipts/taxi_receipt_004.pdf',
    currentApprovalStep: 1,
    approvalHistory: [
      {
        stepOrder: 1,
        approverUserId: 2,
        approverName: 'Jane Smith',
        isRequired: true,
        status: 'Pending'
      }
    ],
    canCurrentUserApprove: true
  },
  {
    id: 5,
    userId: 4,
    userName: 'Alice Johnson',
    userEmail: 'alice.johnson@company.com',
    category: 'Supplies',
    description: 'Office supplies and equipment',
    expenseDate: '2025-10-01',
    originalAmount: 340.25,
    originalCurrencyCode: 'USD',
    convertedAmount: 340.25,
    baseCurrencyCode: 'USD',
    status: 'Pending',
    remarks: 'New laptop accessories and office stationery for the team',
    submittedAt: '2025-10-02T08:30:00Z',
    createdAt: '2025-10-02T08:30:00Z',
    updatedAt: '2025-10-02T08:30:00Z',
    receiptUrl: '/receipts/supplies_receipt_005.pdf',
    currentApprovalStep: 1,
    approvalHistory: [
      {
        stepOrder: 1,
        approverUserId: 2,
        approverName: 'Jane Smith',
        isRequired: true,
        status: 'Pending'
      }
    ],
    canCurrentUserApprove: true,
    nextApprover: 'Admin User'
  }
];

// Mock dashboard statistics
export const mockDashboardStats = {
  pendingApprovals: mockExpensesForApproval.length,
  approvedThisMonth: 24,
  rejectedThisMonth: 3,
  totalTeamMembers: teamMembers.length,
  avgApprovalTime: 4.2, // 4.2 hours
  highestPendingAmount: Math.max(...mockExpensesForApproval.map(e => e.convertedAmount))
};

// Mock approved expenses (for reference/history)
export const mockApprovedExpenses = [
  {
    id: 6,
    userId: 1,
    userName: 'John Doe',
    userEmail: 'john.doe@company.com',
    category: 'Food',
    description: 'Client dinner meeting',
    expenseDate: '2025-09-25',
    originalAmount: 180.00,
    originalCurrencyCode: 'USD',
    convertedAmount: 180.00,
    baseCurrencyCode: 'USD',
    status: 'Approved',
    remarks: 'Dinner with potential client to discuss contract terms',
    submittedAt: '2025-09-26T10:00:00Z',
    createdAt: '2025-09-26T10:00:00Z',
    updatedAt: '2025-09-27T14:30:00Z',
    receiptUrl: '/receipts/dinner_receipt_006.pdf',
    currentApprovalStep: 1,
    approvalHistory: [
      {
        stepOrder: 1,
        approverUserId: 2,
        approverName: 'Jane Smith',
        isRequired: true,
        status: 'Approved',
        comment: 'Approved - Valid business expense',
        updatedAt: '2025-09-27T14:30:00Z'
      }
    ],
    canCurrentUserApprove: false
  }
];