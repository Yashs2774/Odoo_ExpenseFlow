import axios from 'axios'

const EXCHANGE_RATE_API_URL = 'https://api.exchangerate-api.com/v4/latest'

// Cache for exchange rates (valid for 1 hour)
let rateCache = {
  data: null,
  timestamp: null,
  baseCurrency: null
}

const CACHE_DURATION = 60 * 60 * 1000 // 1 hour in milliseconds

class CurrencyService {
  
  /**
   * Get exchange rates from API or cache
   */
  async getExchangeRates(baseCurrency = 'USD') {
    const now = Date.now()
    
    // Return cached data if valid and same base currency
    if (rateCache.data && 
        rateCache.timestamp && 
        rateCache.baseCurrency === baseCurrency &&
        (now - rateCache.timestamp) < CACHE_DURATION) {
      return rateCache.data
    }
    
    try {
      const response = await axios.get(`${EXCHANGE_RATE_API_URL}/${baseCurrency}`, {
        timeout: 5000
      })
      
      const data = response.data
      
      // Update cache
      rateCache = {
        data: data,
        timestamp: now,
        baseCurrency: baseCurrency
      }
      
      return data
    } catch (error) {
      console.error('Failed to fetch exchange rates:', error)
      
      // Fallback to mock data if API fails
      return this.getMockExchangeRates(baseCurrency)
    }
  }
  
  /**
   * Convert amount from one currency to another
   */
  async convertCurrency(amount, fromCurrency, toCurrency) {
    if (fromCurrency === toCurrency) {
      return {
        originalAmount: amount,
        convertedAmount: amount,
        rate: 1,
        fromCurrency,
        toCurrency
      }
    }
    
    try {
      // Get rates with base currency as the target currency
      const rates = await this.getExchangeRates(toCurrency)
      
      let convertedAmount
      let rate
      
      if (rates.rates[fromCurrency]) {
        // Direct conversion from API base to target
        rate = 1 / rates.rates[fromCurrency]
        convertedAmount = amount * rate
      } else {
        // Fallback calculation
        rate = this.getMockRate(fromCurrency, toCurrency)
        convertedAmount = amount * rate
      }
      
      return {
        originalAmount: amount,
        convertedAmount: Math.round(convertedAmount * 100) / 100, // Round to 2 decimal places
        rate: Math.round(rate * 10000) / 10000, // Round to 4 decimal places
        fromCurrency,
        toCurrency,
        timestamp: new Date().toISOString()
      }
    } catch (error) {
      console.error('Currency conversion error:', error)
      throw new Error('Failed to convert currency')
    }
  }
  
  /**
   * Get real-time conversion preview for form
   */
  async getConversionPreview(amount, fromCurrency, toCurrency) {
    if (!amount || amount <= 0) {
      return null
    }
    
    try {
      return await this.convertCurrency(amount, fromCurrency, toCurrency)
    } catch (error) {
      console.error('Failed to get conversion preview:', error)
      return null
    }
  }
  
  /**
   * Mock exchange rates as fallback
   */
  getMockExchangeRates(baseCurrency) {
    const mockRates = {
      USD: {
        EUR: 0.85,
        GBP: 0.73,
        JPY: 110.0,
        CAD: 1.25,
        AUD: 1.35,
        CHF: 0.92,
        CNY: 6.45,
        INR: 74.5,
        IDR: 14500,
        SGD: 1.35,
        MYR: 4.15,
        THB: 33.5,
        PHP: 50.5,
        KRW: 1180
      }
    }
    
    const baseRates = mockRates[baseCurrency] || mockRates.USD
    
    return {
      base: baseCurrency,
      date: new Date().toISOString().split('T')[0],
      rates: baseRates
    }
  }
  
  /**
   * Get mock conversion rate
   */
  getMockRate(fromCurrency, toCurrency) {
    const mockRates = {
      'USD_EUR': 0.85,
      'EUR_USD': 1.18,
      'USD_GBP': 0.73,
      'GBP_USD': 1.37,
      'USD_JPY': 110.0,
      'JPY_USD': 0.0091,
      'USD_IDR': 14500,
      'IDR_USD': 0.000069,
      // Add more pairs as needed
    }
    
    const pairKey = `${fromCurrency}_${toCurrency}`
    return mockRates[pairKey] || 1
  }
  
  /**
   * Format currency with proper symbol and locale
   */
  formatCurrency(amount, currencyCode, locale = 'en-US') {
    try {
      return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: currencyCode,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }).format(amount)
    } catch (error) {
      return `${currencyCode} ${amount.toFixed(2)}`
    }
  }
  
  /**
   * Get supported currencies
   */
  getSupportedCurrencies() {
    return [
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
  }
}

export default new CurrencyService()