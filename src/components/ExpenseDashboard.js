'use client'

import { useState, useEffect } from 'react'
import { 
  Table, 
  Card, 
  Tag, 
  Button, 
  Space, 
  Input, 
  Select, 
  DatePicker, 
  Row, 
  Col,
  Statistic,
  Typography,
  Avatar,
  Tooltip,
  Modal,
  Image
} from 'antd'
import { 
  SearchOutlined, 
  PlusOutlined, 
  EyeOutlined, 
  FileImageOutlined,
  CalendarOutlined,
  DollarCircleOutlined
} from '@ant-design/icons'
import { useAuth } from '../contexts/AuthContext'
import { formatCurrency, EXPENSE_STATUS } from '../lib/constants'
import dayjs from 'dayjs'
import Link from 'next/link'

const { Title, Text } = Typography
const { RangePicker } = DatePicker
const { Option } = Select

export default function ExpenseDashboard() {
  const [expenses, setExpenses] = useState([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    category: '',
    dateRange: null
  })
  const [selectedExpense, setSelectedExpense] = useState(null)
  const [modalVisible, setModalVisible] = useState(false)
  const { user } = useAuth()

  // Mock data - replace with actual API call
  useEffect(() => {
    const fetchExpenses = async () => {
      setLoading(true)
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const mockExpenses = [
        {
          expense_id: 1,
          description: 'Business lunch with client',
          category: 'Food',
          expense_date: '2025-10-01',
          original_amount: 85.50,
          original_currency_code: 'USD',
          converted_amount: 85.50,
          status: 'Approved',
          remarks: 'Meeting with potential new client',
          submitted_at: '2025-10-01T14:30:00Z',
          receipts: [{ file_path: '/mock-receipt-1.jpg' }]
        },
        {
          expense_id: 2,
          description: 'Flight to conference',
          category: 'Travel',
          expense_date: '2025-09-28',
          original_amount: 450.00,
          original_currency_code: 'USD',
          converted_amount: 450.00,
          status: 'Pending',
          remarks: 'Annual tech conference',
          submitted_at: '2025-09-29T09:15:00Z',
          receipts: [{ file_path: '/mock-receipt-2.pdf' }]
        },
        {
          expense_id: 3,
          description: 'Hotel accommodation',
          category: 'Lodging',
          expense_date: '2025-09-29',
          original_amount: 120.00,
          original_currency_code: 'EUR',
          converted_amount: 128.40,
          status: 'Draft',
          remarks: 'Conference hotel stay',
          submitted_at: null,
          receipts: []
        },
        {
          expense_id: 4,
          description: 'Office supplies',
          category: 'Office Supplies',
          expense_date: '2025-10-02',
          original_amount: 35.75,
          original_currency_code: 'USD',
          converted_amount: 35.75,
          status: 'Rejected',
          remarks: 'Notebooks and pens',
          submitted_at: '2025-10-02T16:45:00Z',
          receipts: [{ file_path: '/mock-receipt-3.jpg' }]
        }
      ]
      
      setExpenses(mockExpenses)
      setLoading(false)
    }
    
    fetchExpenses()
  }, [])

  const getStatusTag = (status) => {
    const colors = {
      Draft: 'orange',
      Pending: 'blue',
      Approved: 'green',
      Rejected: 'red'
    }
    
    return <Tag color={colors[status]}>{status}</Tag>
  }

  const filteredExpenses = expenses.filter(expense => {
    const matchesSearch = expense.description.toLowerCase().includes(filters.search.toLowerCase()) ||
                         expense.category.toLowerCase().includes(filters.search.toLowerCase())
    
    const matchesStatus = !filters.status || expense.status === filters.status
    const matchesCategory = !filters.category || expense.category === filters.category
    
    const matchesDateRange = !filters.dateRange || 
      (dayjs(expense.expense_date).isAfter(filters.dateRange[0]) &&
       dayjs(expense.expense_date).isBefore(filters.dateRange[1]))
    
    return matchesSearch && matchesStatus && matchesCategory && matchesDateRange
  })

  const totalExpenses = filteredExpenses.reduce((sum, exp) => sum + exp.converted_amount, 0)
  const pendingExpenses = filteredExpenses.filter(exp => exp.status === 'Pending').length
  const approvedExpenses = filteredExpenses.filter(exp => exp.status === 'Approved').length

  const columns = [
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      render: (text, record) => (
        <Space direction="vertical" size={0}>
          <Text strong>{text}</Text>
          <Text type="secondary" style={{ fontSize: '12px' }}>
            {dayjs(record.expense_date).format('MMM DD, YYYY')}
          </Text>
        </Space>
      ),
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
      render: (category) => <Tag>{category}</Tag>
    },
    {
      title: 'Amount',
      key: 'amount',
      render: (_, record) => (
        <Space direction="vertical" size={0}>
          <Text strong className="currency-display">
            {formatCurrency(record.converted_amount, user?.company?.base_currency_code || 'USD')}
          </Text>
          {record.original_currency_code !== (user?.company?.base_currency_code || 'USD') && (
            <Text type="secondary" style={{ fontSize: '12px' }}>
              from {formatCurrency(record.original_amount, record.original_currency_code)}
            </Text>
          )}
        </Space>
      ),
      sorter: (a, b) => a.converted_amount - b.converted_amount,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => getStatusTag(status),
      filters: [
        { text: 'Draft', value: 'Draft' },
        { text: 'Pending', value: 'Pending' },
        { text: 'Approved', value: 'Approved' },
        { text: 'Rejected', value: 'Rejected' },
      ],
      onFilter: (value, record) => record.status === value,
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Tooltip title="View Details">
            <Button
              type="text"
              icon={<EyeOutlined />}
              onClick={() => {
                setSelectedExpense(record)
                setModalVisible(true)
              }}
            />
          </Tooltip>
          {record.receipts.length > 0 && (
            <Tooltip title="View Receipt">
              <Button
                type="text"
                icon={<FileImageOutlined />}
                onClick={() => {
                  // Open receipt viewer
                  Modal.info({
                    title: 'Receipt',
                    content: (
                      <div style={{ textAlign: 'center', padding: '20px' }}>
                        <Image
                          src="/api/placeholder/400/600"
                          alt="Receipt"
                          style={{ maxWidth: '100%' }}
                        />
                      </div>
                    ),
                    width: 500,
                  })
                }}
              />
            </Tooltip>
          )}
        </Space>
      ),
    },
  ]

  return (
    <div>
      {/* Statistics Cards */}
      <Row gutter={24} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="Total Expenses"
              value={totalExpenses}
              formatter={value => formatCurrency(value, user?.company?.base_currency_code || 'USD')}
              prefix={<DollarCircleOutlined style={{ color: '#1890ff' }} />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="Pending Approval"
              value={pendingExpenses}
              prefix={<CalendarOutlined style={{ color: '#faad14' }} />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="Approved"
              value={approvedExpenses}
              prefix={<Avatar style={{ backgroundColor: '#52c41a' }} size={24}>✓</Avatar>}
            />
          </Card>
        </Col>
      </Row>

      {/* Main Table Card */}
      <Card 
        title={<Title level={3} style={{ margin: 0 }}>My Expenses</Title>}
        extra={
          <Link href="/new-expense">
            <Button type="primary" icon={<PlusOutlined />}>
              New Expense
            </Button>
          </Link>
        }
      >
        {/* Filters */}
        <Row gutter={16} style={{ marginBottom: 16 }}>
          <Col xs={24} sm={8} md={6}>
            <Input
              placeholder="Search expenses..."
              prefix={<SearchOutlined />}
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              allowClear
            />
          </Col>
          <Col xs={24} sm={8} md={4}>
            <Select
              placeholder="Status"
              value={filters.status}
              onChange={(value) => setFilters({ ...filters, status: value })}
              allowClear
              style={{ width: '100%' }}
            >
              <Option value="Draft">Draft</Option>
              <Option value="Pending">Pending</Option>
              <Option value="Approved">Approved</Option>
              <Option value="Rejected">Rejected</Option>
            </Select>
          </Col>
          <Col xs={24} sm={8} md={4}>
            <Select
              placeholder="Category"
              value={filters.category}
              onChange={(value) => setFilters({ ...filters, category: value })}
              allowClear
              style={{ width: '100%' }}
            >
              <Option value="Food">Food</Option>
              <Option value="Travel">Travel</Option>
              <Option value="Lodging">Lodging</Option>
              <Option value="Office Supplies">Office Supplies</Option>
            </Select>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <RangePicker
              value={filters.dateRange}
              onChange={(dates) => setFilters({ ...filters, dateRange: dates })}
              style={{ width: '100%' }}
            />
          </Col>
        </Row>

        <Table
          columns={columns}
          dataSource={filteredExpenses}
          rowKey="expense_id"
          loading={loading}
          pagination={{
            total: filteredExpenses.length,
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} expenses`,
          }}
          className="expense-table"
        />
      </Card>

      {/* Expense Details Modal */}
      <Modal
        title="Expense Details"
        open={modalVisible}
        onCancel={() => {
          setModalVisible(false)
          setSelectedExpense(null)
        }}
        footer={null}
        width={600}
      >
        {selectedExpense && (
          <div>
            <Row gutter={[16, 16]}>
              <Col span={12}>
                <Text type="secondary">Description:</Text>
                <div><Text strong>{selectedExpense.description}</Text></div>
              </Col>
              <Col span={12}>
                <Text type="secondary">Category:</Text>
                <div><Tag>{selectedExpense.category}</Tag></div>
              </Col>
              <Col span={12}>
                <Text type="secondary">Date:</Text>
                <div><Text>{dayjs(selectedExpense.expense_date).format('MMMM DD, YYYY')}</Text></div>
              </Col>
              <Col span={12}>
                <Text type="secondary">Status:</Text>
                <div>{getStatusTag(selectedExpense.status)}</div>
              </Col>
              <Col span={12}>
                <Text type="secondary">Amount:</Text>
                <div>
                  <Text strong className="currency-display">
                    {formatCurrency(selectedExpense.converted_amount, user?.company?.base_currency_code || 'USD')}
                  </Text>
                  {selectedExpense.original_currency_code !== (user?.company?.base_currency_code || 'USD') && (
                    <div>
                      <Text type="secondary" style={{ fontSize: '12px' }}>
                        Original: {formatCurrency(selectedExpense.original_amount, selectedExpense.original_currency_code)}
                      </Text>
                    </div>
                  )}
                </div>
              </Col>
              <Col span={12}>
                <Text type="secondary">Submitted:</Text>
                <div>
                  <Text>
                    {selectedExpense.submitted_at 
                      ? dayjs(selectedExpense.submitted_at).format('MMM DD, YYYY HH:mm')
                      : 'Not submitted'
                    }
                  </Text>
                </div>
              </Col>
              {selectedExpense.remarks && (
                <Col span={24}>
                  <Text type="secondary">Remarks:</Text>
                  <div><Text>{selectedExpense.remarks}</Text></div>
                </Col>
              )}
            </Row>
          </div>
        )}
      </Modal>
    </div>
  )
}