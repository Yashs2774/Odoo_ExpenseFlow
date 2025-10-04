'use client'

import { useState, useEffect } from 'react'
import { 
  Form, 
  Input, 
  Select, 
  DatePicker, 
  InputNumber, 
  Button, 
  Upload, 
  Card, 
  Row, 
  Col, 
  Space, 
  Typography, 
  message,
  Alert,
  Spin
} from 'antd'
import { 
  SaveOutlined, 
  SendOutlined, 
  UploadOutlined, 
  EyeOutlined,
  DeleteOutlined,
  SwapOutlined
} from '@ant-design/icons'
import { EXPENSE_CATEGORIES, CURRENCY_CODES, validateFile } from '../lib/constants'
import { useAuth } from '../contexts/AuthContext'
import currencyService from '../lib/currencyService'
import ocrService from '../lib/ocrService'
import dayjs from 'dayjs'

const { Title, Text } = Typography
const { TextArea } = Input
const { Option } = Select

export default function ExpenseForm() {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [ocrLoading, setOcrLoading] = useState(false)
  const [fileList, setFileList] = useState([])
  const [ocrData, setOcrData] = useState(null)
  const [ocrProgress, setOcrProgress] = useState(0)
  const [conversionData, setConversionData] = useState(null)
  const [conversionLoading, setConversionLoading] = useState(false)
  const { user } = useAuth()

  const handleSubmit = async (values, isDraft = false) => {
    setLoading(true)
    
    try {
      const formData = new FormData()
      
      // Add form fields
      Object.keys(values).forEach(key => {
        if (key === 'expense_date') {
          formData.append(key, values[key].format('YYYY-MM-DD'))
        } else if (values[key] !== undefined && values[key] !== null) {
          formData.append(key, values[key])
        }
      })
      
      // Add receipt files
      fileList.forEach(file => {
        if (file.originFileObj) {
          formData.append('receipts', file.originFileObj)
        }
      })
      
      formData.append('status', isDraft ? 'Draft' : 'Pending')
      formData.append('user_id', user.user_id)
      
      // Mock API call - replace with actual API
      console.log('Submitting expense:', Object.fromEntries(formData))
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      message.success(`Expense ${isDraft ? 'saved as draft' : 'submitted'} successfully!`)
      
      // Reset form
      form.resetFields()
      setFileList([])
      setOcrData(null)
      
    } catch (error) {
      console.error('Error submitting expense:', error)
      message.error('Failed to submit expense. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleOCR = async (file) => {
    setOcrLoading(true)
    setOcrProgress(0)
    
    try {
      message.info('Processing receipt... This may take a moment.')
      
      const result = await ocrService.processReceipt(
        file,
        (progress) => setOcrProgress(progress)
      )
      
      if (result.success && result.extractedData) {
        const extractedData = result.extractedData
        
        // Validate the extracted data
        const validation = ocrService.validateExtractedData(extractedData)
        
        setOcrData({
          ...extractedData,
          validation: validation,
          rawText: result.rawText,
          confidence: result.confidence
        })
        
        // Pre-fill form with OCR data
        const formFields = {}
        
        if (extractedData.amount) {
          formFields.original_amount = extractedData.amount
        }
        
        if (extractedData.date) {
          formFields.expense_date = extractedData.date
        }
        
        if (extractedData.description) {
          formFields.description = extractedData.description
        }
        
        if (extractedData.category) {
          formFields.category = extractedData.category
        }
        
        form.setFieldsValue(formFields)
        
        if (validation.isValid) {
          message.success('Receipt processed successfully! Form fields have been pre-filled.')
        } else {
          message.warning(`Receipt processed with some issues: ${validation.issues.join(', ')}. Please review the pre-filled data.`)
        }
        
      } else {
        message.error(result.error || 'Failed to extract data from receipt. Please fill the form manually.')
      }
      
    } catch (error) {
      console.error('OCR Error:', error)
      message.error('Failed to process receipt. Please fill the form manually.')
    } finally {
      setOcrLoading(false)
      setOcrProgress(0)
    }
  }

  const handleCurrencyConversion = async (amount, fromCurrency) => {
    if (!amount || !fromCurrency) {
      setConversionData(null)
      return
    }

    const baseCurrency = user?.company?.base_currency_code || 'USD'
    
    if (fromCurrency === baseCurrency) {
      setConversionData(null)
      return
    }

    setConversionLoading(true)
    
    try {
      const conversion = await currencyService.convertCurrency(amount, fromCurrency, baseCurrency)
      setConversionData(conversion)
    } catch (error) {
      console.error('Currency conversion failed:', error)
      message.error('Failed to convert currency. Please check the amount and try again.')
    } finally {
      setConversionLoading(false)
    }
  }

  // Watch for amount and currency changes
  const watchedAmount = Form.useWatch('original_amount', form)
  const watchedCurrency = Form.useWatch('original_currency_code', form)

  // Effect for real-time currency conversion
  useEffect(() => {
    if (watchedAmount && watchedCurrency) {
      const debounceTimer = setTimeout(() => {
        handleCurrencyConversion(watchedAmount, watchedCurrency)
      }, 500) // Debounce API calls

      return () => clearTimeout(debounceTimer)
    } else {
      setConversionData(null)
    }
  }, [watchedAmount, watchedCurrency, user?.company?.base_currency_code])

  const uploadProps = {
    fileList,
    onChange: ({ fileList: newFileList }) => {
      setFileList(newFileList)
    },
    beforeUpload: (file) => {
      const validation = validateFile(file)
      if (!validation.valid) {
        message.error(validation.message)
        return false
      }
      
      // Trigger OCR processing for image files
      if (file.type.startsWith('image/')) {
        handleOCR(file)
      }
      
      return false // Prevent auto upload
    },
    onRemove: (file) => {
      setFileList(fileList.filter(item => item.uid !== file.uid))
      setOcrData(null)
    },
    multiple: false,
    accept: '.jpg,.jpeg,.png,.gif,.pdf'
  }

  return (
    <Card 
      title={
        <Space>
          <Title level={3} style={{ margin: 0 }}>New Expense</Title>
          {ocrLoading && <Spin size="small" />}
        </Space>
      }
      style={{ marginBottom: 24 }}
    >
      {ocrData && (
        <Alert
          message={`Receipt Processed ${ocrData.validation?.isValid ? 'Successfully' : 'with Issues'}`}
          description={
            <Space direction="vertical" size={4}>
              <Text>
                {ocrData.validation?.isValid 
                  ? 'The receipt has been processed and form fields have been pre-filled. Please review and modify as needed.'
                  : `Issues found: ${ocrData.validation?.issues?.join(', ')}. Please review the pre-filled data carefully.`
                }
              </Text>
              {ocrData.confidence && (
                <Text type="secondary" style={{ fontSize: '12px' }}>
                  OCR Confidence: {Math.round(ocrData.confidence)}%
                </Text>
              )}
            </Space>
          }
          type={ocrData.validation?.isValid ? 'success' : 'warning'}
          showIcon
          closable
          onClose={() => setOcrData(null)}
          style={{ marginBottom: 24 }}
        />
      )}
      
      <Form
        form={form}
        layout="vertical"
        onFinish={(values) => handleSubmit(values, false)}
        requiredMark={false}
        size="large"
      >
        <Row gutter={24}>
          <Col xs={24} md={12}>
            <Form.Item
              name="description"
              label="Description"
              rules={[
                { required: true, message: 'Please enter expense description' },
                { max: 255, message: 'Description cannot exceed 255 characters' }
              ]}
            >
              <Input 
                placeholder="Enter expense description"
                showCount
                maxLength={255}
              />
            </Form.Item>
          </Col>
          
          <Col xs={24} md={12}>
            <Form.Item
              name="category"
              label="Category"
              rules={[{ required: true, message: 'Please select a category' }]}
            >
              <Select placeholder="Select expense category">
                {EXPENSE_CATEGORIES.map(category => (
                  <Option key={category} value={category}>
                    {category}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={24}>
          <Col xs={24} md={8}>
            <Form.Item
              name="expense_date"
              label="Expense Date"
              rules={[{ required: true, message: 'Please select expense date' }]}
            >
              <DatePicker 
                style={{ width: '100%' }}
                format="YYYY-MM-DD"
                disabledDate={(current) => current && current > dayjs().endOf('day')}
              />
            </Form.Item>
          </Col>
          
          <Col xs={24} md={8}>
            <Form.Item
              name="original_amount"
              label="Amount"
              rules={[
                { required: true, message: 'Please enter amount' },
                { type: 'number', min: 0.01, message: 'Amount must be greater than 0' }
              ]}
            >
              <InputNumber
                style={{ width: '100%' }}
                placeholder="0.00"
                precision={2}
                min={0.01}
                max={999999.99}
              />
            </Form.Item>
          </Col>
          
          <Col xs={24} md={8}>
            <Form.Item
              name="original_currency_code"
              label="Currency"
              rules={[{ required: true, message: 'Please select currency' }]}
              initialValue={user?.company?.base_currency_code || 'USD'}
            >
              <Select 
                placeholder="Select currency"
                showSearch
                filterOption={(input, option) =>
                  option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
              >
                {CURRENCY_CODES.map(currency => (
                  <Option key={currency.code} value={currency.code}>
                    {currency.code} - {currency.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>

        {/* Currency Conversion Display */}
        {(conversionData || conversionLoading) && (
          <Card 
            size="small" 
            style={{ marginBottom: 24, backgroundColor: '#f6ffed', border: '1px solid #b7eb8f' }}
          >
            <Row align="middle" gutter={16}>
              <Col>
                <SwapOutlined style={{ color: '#52c41a' }} />
              </Col>
              <Col flex={1}>
                {conversionLoading ? (
                  <Space>
                    <Spin size="small" />
                    <Text>Converting currency...</Text>
                  </Space>
                ) : conversionData ? (
                  <Space direction="vertical" size={0}>
                    <Text>
                      <strong>{currencyService.formatCurrency(conversionData.originalAmount, conversionData.fromCurrency)}</strong>
                      {' → '}
                      <strong>{currencyService.formatCurrency(conversionData.convertedAmount, conversionData.toCurrency)}</strong>
                    </Text>
                    <Text type="secondary" style={{ fontSize: '12px' }}>
                      Exchange rate: 1 {conversionData.fromCurrency} = {conversionData.rate} {conversionData.toCurrency}
                    </Text>
                  </Space>
                ) : null}
              </Col>
            </Row>
          </Card>
        )}

        <Form.Item
          name="remarks"
          label="Remarks (Optional)"
        >
          <TextArea 
            placeholder="Additional comments or remarks"
            rows={3}
            maxLength={500}
            showCount
          />
        </Form.Item>

        <Form.Item
          label="Receipt Upload"
          required
        >
          <Upload.Dragger {...uploadProps}>
            <div style={{ padding: '20px 0' }}>
              <UploadOutlined style={{ fontSize: 48, color: '#1890ff' }} />
              <div style={{ marginTop: 16 }}>
                <Text strong>Click or drag file to upload receipt</Text>
              </div>
              <div style={{ marginTop: 8 }}>
                <Text type="secondary">
                  Support JPEG, PNG, GIF, PDF files up to 5MB
                </Text>
              </div>
              {ocrLoading && (
                <div style={{ marginTop: 16 }}>
                  <Space direction="vertical" size={8} style={{ width: '100%' }}>
                    <Space>
                      <Spin /> <Text type="secondary">Processing receipt...</Text>
                    </Space>
                    {ocrProgress > 0 && (
                      <div style={{ width: '200px' }}>
                        <div style={{ 
                          width: '100%', 
                          backgroundColor: '#f0f0f0', 
                          borderRadius: '4px', 
                          height: '6px',
                          overflow: 'hidden'
                        }}>
                          <div style={{ 
                            width: `${ocrProgress}%`, 
                            backgroundColor: '#1890ff', 
                            height: '100%',
                            transition: 'width 0.3s ease'
                          }} />
                        </div>
                        <Text type="secondary" style={{ fontSize: '11px' }}>
                          {ocrProgress}% complete
                        </Text>
                      </div>
                    )}
                  </Space>
                </div>
              )}
            </div>
          </Upload.Dragger>
          
          {fileList.length === 0 && (
            <Text type="danger" style={{ fontSize: '12px', marginTop: '8px', display: 'block' }}>
              Receipt upload is required
            </Text>
          )}
        </Form.Item>

        <Form.Item style={{ marginBottom: 0 }}>
          <Space size="middle">
            <Button
              type="primary"
              htmlType="submit"
              icon={<SendOutlined />}
              loading={loading}
              disabled={fileList.length === 0 || ocrLoading}
              size="large"
            >
              Submit Expense
            </Button>
            
            <Button
              icon={<SaveOutlined />}
              onClick={() => {
                form.validateFields().then(values => {
                  handleSubmit(values, true)
                }).catch(() => {
                  message.warning('Please fill in required fields before saving as draft')
                })
              }}
              loading={loading}
              disabled={ocrLoading}
              size="large"
            >
              Save as Draft
            </Button>
            
            <Button
              onClick={() => {
                form.resetFields()
                setFileList([])
                setOcrData(null)
              }}
              disabled={loading || ocrLoading}
              size="large"
            >
              Clear Form
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Card>
  )
}