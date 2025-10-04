import Tesseract from 'tesseract.js'
import dayjs from 'dayjs'

class OCRService {
  
  /**
   * Extract text from receipt image using OCR
   */
  async processReceipt(file, onProgress = null) {
    try {
      const { data } = await Tesseract.recognize(
        file,
        'eng',
        {
          logger: (m) => {
            if (onProgress && m.status === 'recognizing text') {
              onProgress(Math.round(m.progress * 100))
            }
          }
        }
      )
      
      const extractedText = data.text
      const extractedData = this.parseReceiptText(extractedText)
      
      return {
        success: true,
        rawText: extractedText,
        extractedData: extractedData,
        confidence: data.confidence
      }
    } catch (error) {
      console.error('OCR processing failed:', error)
      return {
        success: false,
        error: error.message,
        rawText: null,
        extractedData: null
      }
    }
  }
  
  /**
   * Parse extracted text to find structured data
   */
  parseReceiptText(text) {
    const lines = text.split('\n').map(line => line.trim()).filter(line => line.length > 0)
    
    const extractedData = {
      amount: null,
      date: null,
      description: null,
      merchant: null,
      category: null
    }
    
    // Extract amount (look for currency patterns)
    const amountPatterns = [
      /\$\s*(\d+\.?\d*)/g,  // $123.45
      /(\d+\.\d{2})\s*\$/g,  // 123.45 $
      /total\s*:?\s*\$?(\d+\.?\d*)/gi,  // Total: $123.45
      /amount\s*:?\s*\$?(\d+\.?\d*)/gi,  // Amount: $123.45
      /(\d+\.\d{2})/g  // Any decimal with 2 places
    ]
    
    for (const pattern of amountPatterns) {
      const matches = text.match(pattern)
      if (matches && matches.length > 0) {
        const amounts = matches.map(match => {
          const numMatch = match.match(/(\d+\.?\d*)/)
          return numMatch ? parseFloat(numMatch[1]) : null
        }).filter(amount => amount && amount > 0)
        
        if (amounts.length > 0) {
          // Usually the largest amount is the total
          extractedData.amount = Math.max(...amounts)
          break
        }
      }
    }
    
    // Extract date
    const datePatterns = [
      /(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4})/g,  // MM/DD/YYYY or MM-DD-YYYY
      /(\d{2,4}[\/\-]\d{1,2}[\/\-]\d{1,2})/g,  // YYYY/MM/DD or YYYY-MM-DD
      /(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)\w*\s+\d{1,2},?\s+\d{2,4}/gi  // Month DD, YYYY
    ]
    
    for (const pattern of datePatterns) {
      const dateMatch = text.match(pattern)
      if (dateMatch && dateMatch.length > 0) {
        const dateStr = dateMatch[0]
        const parsedDate = this.parseDate(dateStr)
        if (parsedDate && parsedDate.isValid()) {
          extractedData.date = parsedDate
          break
        }
      }
    }
    
    // Extract merchant name (usually in the first few lines)
    const merchantPatterns = [
      /^([A-Z\s&]+)$/m,  // Lines with all caps
      /([A-Za-z\s&]+)\s*(?:inc|llc|ltd|corp)/gi  // Company suffixes
    ]
    
    for (let i = 0; i < Math.min(5, lines.length); i++) {
      const line = lines[i]
      if (line.length > 3 && line.length < 50 && /[A-Za-z]/.test(line)) {
        // Skip lines that look like addresses or numbers
        if (!/^\d+/.test(line) && !/^\d+\s+\w+\s+(st|street|ave|avenue|rd|road|blvd|boulevard)/i.test(line)) {
          extractedData.merchant = line
          break
        }
      }
    }
    
    // Generate description
    if (extractedData.merchant) {
      extractedData.description = `Purchase at ${extractedData.merchant}`
    } else if (extractedData.amount) {
      extractedData.description = `Expense - ${extractedData.amount}`
    } else {
      extractedData.description = 'Business expense'
    }
    
    // Try to guess category based on merchant name
    extractedData.category = this.guessCategory(extractedData.merchant || text)
    
    return extractedData
  }
  
  /**
   * Parse various date formats
   */
  parseDate(dateStr) {
    const formats = [
      'MM/DD/YYYY',
      'MM-DD-YYYY', 
      'DD/MM/YYYY',
      'DD-MM-YYYY',
      'YYYY/MM/DD',
      'YYYY-MM-DD',
      'MMM DD, YYYY',
      'MMMM DD, YYYY'
    ]
    
    for (const format of formats) {
      const date = dayjs(dateStr, format, true)
      if (date.isValid() && date.year() >= 2020 && date.year() <= dayjs().year()) {
        return date
      }
    }
    
    // Try default parsing
    const date = dayjs(dateStr)
    if (date.isValid() && date.year() >= 2020 && date.year() <= dayjs().year()) {
      return date
    }
    
    return null
  }
  
  /**
   * Guess expense category based on merchant name or text content
   */
  guessCategory(text) {
    const lowerText = text.toLowerCase()
    
    const categoryKeywords = {
      'Food': ['restaurant', 'cafe', 'coffee', 'pizza', 'burger', 'food', 'dining', 'kitchen', 'bar', 'grill', 'bistro'],
      'Travel': ['airline', 'airport', 'flight', 'hotel', 'motel', 'travel', 'booking', 'expedia', 'uber', 'taxi', 'gas station'],
      'Lodging': ['hotel', 'motel', 'inn', 'resort', 'lodge', 'accommodation', 'marriott', 'hilton', 'hyatt'],
      'Transportation': ['uber', 'lyft', 'taxi', 'metro', 'bus', 'train', 'parking', 'toll', 'gas', 'fuel'],
      'Office Supplies': ['office', 'supplies', 'staples', 'depot', 'paper', 'pen', 'printer', 'ink'],
      'Software': ['software', 'license', 'subscription', 'adobe', 'microsoft', 'google', 'app store'],
      'Training': ['training', 'course', 'workshop', 'seminar', 'conference', 'education', 'certification'],
      'Entertainment': ['entertainment', 'movie', 'theater', 'concert', 'show', 'event', 'tickets']
    }
    
    for (const [category, keywords] of Object.entries(categoryKeywords)) {
      for (const keyword of keywords) {
        if (lowerText.includes(keyword)) {
          return category
        }
      }
    }
    
    return 'Other'
  }
  
  /**
   * Validate extracted data
   */
  validateExtractedData(data) {
    const issues = []
    
    if (!data.amount || data.amount <= 0 || data.amount > 10000) {
      issues.push('Amount seems incorrect or missing')
    }
    
    if (!data.date || !data.date.isValid() || data.date.isAfter(dayjs())) {
      issues.push('Date seems incorrect or missing')
    }
    
    if (!data.description || data.description.length < 3) {
      issues.push('Description is too short')
    }
    
    return {
      isValid: issues.length === 0,
      issues: issues
    }
  }
  
  /**
   * Clean up text for better processing
   */
  preprocessText(text) {
    return text
      .replace(/[^\x00-\x7F]/g, '') // Remove non-ASCII characters
      .replace(/\s+/g, ' ') // Normalize whitespace
      .trim()
  }
}

export default new OCRService()