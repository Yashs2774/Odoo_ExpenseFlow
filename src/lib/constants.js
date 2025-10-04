export const EXPENSE_CATEGORIES = [
  'Food',
  'Travel',
  'Lodging',
  'Transportation',
  'Office Supplies',
  'Software',
  'Training',
  'Marketing',
  'Entertainment',
  'Other'
]

export const EXPENSE_STATUS = {
  DRAFT: 'Draft',
  PENDING: 'Pending', 
  APPROVED: 'Approved',
  REJECTED: 'Rejected'
}

export const CURRENCY_CODES = [
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'GBP', symbol: '£', name: 'British Pound' },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen' },
  { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar' },
  { code: 'AUD', symbol: 'A$', name: 'Australian Dollar' },
  { code: 'CHF', symbol: 'Fr', name: 'Swiss Franc' },
  { code: 'CNY', symbol: '¥', name: 'Chinese Yuan' },
  { code: 'INR', symbol: '₹', name: 'Indian Rupee' },
  { code: 'IDR', symbol: 'Rp', name: 'Indonesian Rupiah' },
  { code: 'SGD', symbol: 'S$', name: 'Singapore Dollar' },
  { code: 'MYR', symbol: 'RM', name: 'Malaysian Ringgit' },
  { code: 'THB', symbol: '฿', name: 'Thai Baht' },
  { code: 'PHP', symbol: '₱', name: 'Philippine Peso' },
  { code: 'KRW', symbol: '₩', name: 'South Korean Won' }
]

export const formatCurrency = (amount, currencyCode) => {
  const currency = CURRENCY_CODES.find(c => c.code === currencyCode)
  if (!currency) return `${amount} ${currencyCode}`
  
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currencyCode,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount)
}

export const validateFile = (file) => {
  const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf']
  const maxSize = 5 * 1024 * 1024 // 5MB
  
  if (!validTypes.includes(file.type)) {
    return { valid: false, message: 'Only JPEG, PNG, GIF, and PDF files are allowed' }
  }
  
  if (file.size > maxSize) {
    return { valid: false, message: 'File size must be less than 5MB' }
  }
  
  return { valid: true }
}