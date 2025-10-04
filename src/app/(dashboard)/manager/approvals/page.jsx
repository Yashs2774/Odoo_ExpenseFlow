"use client";

import React, { useState } from "react";
import {
  Table,
  Button,
  Space,
  Modal,
  Form,
  Input,
  message,
  Tag,
  Tooltip,
  Typography,
  Badge,
  Popconfirm,
  Image,
  Card,
  Row,
  Col,
  Divider,
} from "antd";
import {
  CheckOutlined,
  CloseOutlined,
  EyeOutlined,
  ClockCircleOutlined,
  UserOutlined,
  CalendarOutlined,
  DollarOutlined,
  FileTextOutlined,
} from "@ant-design/icons";
import ManagerLayout from "@/components/ManagerLayout";
import { mockExpensesForApproval } from "@/data/mockData";

const { Text, Title, Paragraph } = Typography;
const { TextArea } = Input;

export default function ApprovalsPage() {
  const [expenses, setExpenses] = useState(mockExpensesForApproval);
  const [selectedExpense, setSelectedExpense] = useState(null);
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);
  const [isActionModalVisible, setIsActionModalVisible] = useState(false);
  const [currentAction, setCurrentAction] = useState("approve");
  const [form] = Form.useForm();
  const [loading, setLoading] = useState({});

  const formatCurrency = (amount, currency) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
    }).format(amount);
  };

  const getCategoryColor = (category) => {
    const colors = {
      Travel: "blue",
      Food: "green",
      Lodging: "purple",
      Transportation: "orange",
      Supplies: "cyan",
    };
    return colors[category] || "default";
  };

  const handleViewDetails = (expense) => {
    setSelectedExpense(expense);
    setIsDetailModalVisible(true);
  };

  const handleAction = (expense, action) => {
    setSelectedExpense(expense);
    setCurrentAction(action);
    setIsActionModalVisible(true);
    form.resetFields();
  };

  const handleSubmitAction = async (values) => {
    if (!selectedExpense) return;

    setLoading({ ...loading, [selectedExpense.id]: true });

    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const actionRequest = {
        expenseId: selectedExpense.id,
        action: currentAction,
        comment: values.comment,
      };

      // Update expense status
      const updatedExpenses = expenses.map((expense) => {
        if (expense.id === selectedExpense.id) {
          return {
            ...expense,
            status: currentAction === "approve" ? "Approved" : "Rejected",
            updatedAt: new Date().toISOString(),
            approvalHistory: expense.approvalHistory.map((step) =>
              step.approverUserId === 2 // Current manager ID
                ? {
                    ...step,
                    status:
                      currentAction === "approve" ? "Approved" : "Rejected",
                    comment: values.comment,
                    updatedAt: new Date().toISOString(),
                  }
                : step
            ),
          };
        }
        return expense;
      });

      // Remove approved/rejected items from the list (they go to history)
      setExpenses(updatedExpenses.filter((e) => e.status === "Pending"));

      message.success(
        `Expense ${
          currentAction === "approve" ? "approved" : "rejected"
        } successfully`
      );

      setIsActionModalVisible(false);
      form.resetFields();
    } catch (error) {
      message.error(`Failed to ${currentAction} expense`);
    } finally {
      setLoading({ ...loading, [selectedExpense.id]: false });
    }
  };

  const columns = [
    {
      title: "Request Owner",
      key: "owner",
      render: (record) => (
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <UserOutlined />
            <Text strong>{record.userName}</Text>
          </div>
          <Text type="secondary" style={{ fontSize: "12px" }}>
            {record.userEmail}
          </Text>
        </div>
      ),
    },
    {
      title: "Description & Category",
      key: "description",
      render: (record) => (
        <div>
          <Text strong>{record.description}</Text>
          <br />
          <Tag color={getCategoryColor(record.category)}>{record.category}</Tag>
        </div>
      ),
    },
    {
      title: "Date",
      dataIndex: "expenseDate",
      key: "expenseDate",
      render: (date) => (
        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
          <CalendarOutlined />
          <Text>{new Date(date).toLocaleDateString()}</Text>
        </div>
      ),
    },
    {
      title: "Total Amount",
      key: "amount",
      render: (record) => (
        <div>
          <Text strong style={{ color: "#1890ff", fontSize: "16px" }}>
            {formatCurrency(record.convertedAmount, record.baseCurrencyCode)}
          </Text>
          {record.originalCurrencyCode !== record.baseCurrencyCode && (
            <div>
              <Text type="secondary" style={{ fontSize: "12px" }}>
                from{" "}
                {formatCurrency(
                  record.originalAmount,
                  record.originalCurrencyCode
                )}
              </Text>
            </div>
          )}
        </div>
      ),
    },
    {
      title: "Status",
      key: "status",
      render: (record) => (
        <div>
          <Badge status="processing" />
          <Tag color="orange">{record.status}</Tag>
          <br />
          <Text type="secondary" style={{ fontSize: "11px" }}>
            Submitted: {new Date(record.submittedAt).toLocaleDateString()}
          </Text>
        </div>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (record) => (
        <Space direction="vertical" size="small">
          <Space>
            <Tooltip title="Approve Expense">
              <Button
                type="primary"
                size="small"
                icon={<CheckOutlined />}
                loading={loading[record.id]}
                onClick={() => handleAction(record, "approve")}
                style={{ backgroundColor: "#52c41a", borderColor: "#52c41a" }}
              >
                Approve
              </Button>
            </Tooltip>
            <Tooltip title="Reject Expense">
              <Button
                type="primary"
                danger
                size="small"
                icon={<CloseOutlined />}
                loading={loading[record.id]}
                onClick={() => handleAction(record, "reject")}
              >
                Reject
              </Button>
            </Tooltip>
          </Space>
          <Button
            type="link"
            size="small"
            icon={<EyeOutlined />}
            onClick={() => handleViewDetails(record)}
          >
            View Details
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <ManagerLayout title="Approvals to Review">
      <div style={{ marginBottom: 16 }}>
        <Row gutter={16}>
          <Col span={12}>
            <Card size="small">
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <ClockCircleOutlined style={{ color: "#faad14" }} />
                <Text>Pending Approvals: </Text>
                <Text strong style={{ color: "#faad14", fontSize: "18px" }}>
                  {expenses.length}
                </Text>
              </div>
            </Card>
          </Col>
          <Col span={12}>
            <Card size="small">
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <DollarOutlined style={{ color: "#1890ff" }} />
                <Text>Total Amount: </Text>
                <Text strong style={{ color: "#1890ff", fontSize: "18px" }}>
                  {formatCurrency(
                    expenses.reduce(
                      (sum, expense) => sum + expense.convertedAmount,
                      0
                    ),
                    "USD"
                  )}
                </Text>
              </div>
            </Card>
          </Col>
        </Row>
      </div>

      <Table
        columns={columns}
        dataSource={expenses}
        rowKey="id"
        pagination={{ pageSize: 10, showSizeChanger: true }}
        scroll={{ x: true }}
        locale={{
          emptyText: (
            <div style={{ padding: "40px", textAlign: "center" }}>
              <CheckOutlined
                style={{
                  fontSize: "48px",
                  color: "#52c41a",
                  marginBottom: "16px",
                }}
              />
              <Title level={4}>All caught up!</Title>
              <Text type="secondary">
                No expenses pending your approval at the moment.
              </Text>
            </div>
          ),
        }}
      />

      {/* Expense Details Modal */}
      <Modal
        title="Expense Details"
        open={isDetailModalVisible}
        onCancel={() => setIsDetailModalVisible(false)}
        footer={null}
        width={700}
      >
        {selectedExpense && (
          <div>
            <Row gutter={16}>
              <Col span={12}>
                <Card size="small" title="Basic Information">
                  <p>
                    <Text strong>Employee:</Text> {selectedExpense.userName}
                  </p>
                  <p>
                    <Text strong>Email:</Text> {selectedExpense.userEmail}
                  </p>
                  <p>
                    <Text strong>Category:</Text>{" "}
                    <Tag color={getCategoryColor(selectedExpense.category)}>
                      {selectedExpense.category}
                    </Tag>
                  </p>
                  <p>
                    <Text strong>Expense Date:</Text>{" "}
                    {new Date(selectedExpense.expenseDate).toLocaleDateString()}
                  </p>
                  <p>
                    <Text strong>Submitted:</Text>{" "}
                    {new Date(selectedExpense.submittedAt).toLocaleString()}
                  </p>
                </Card>
              </Col>
              <Col span={12}>
                <Card size="small" title="Financial Information">
                  <p>
                    <Text strong>Original Amount:</Text>{" "}
                    {formatCurrency(
                      selectedExpense.originalAmount,
                      selectedExpense.originalCurrencyCode
                    )}
                  </p>
                  <p>
                    <Text strong>Converted Amount:</Text>{" "}
                    {formatCurrency(
                      selectedExpense.convertedAmount,
                      selectedExpense.baseCurrencyCode
                    )}
                  </p>
                  <p>
                    <Text strong>Status:</Text>{" "}
                    <Tag color="orange">{selectedExpense.status}</Tag>
                  </p>
                </Card>
              </Col>
            </Row>

            <Divider />

            <div style={{ marginBottom: 16 }}>
              <Title level={5}>Description</Title>
              <Paragraph>{selectedExpense.description}</Paragraph>
            </div>

            {selectedExpense.remarks && (
              <div style={{ marginBottom: 16 }}>
                <Title level={5}>Employee Remarks</Title>
                <Paragraph
                  style={{
                    backgroundColor: "#f9f9f9",
                    padding: 12,
                    borderRadius: 4,
                  }}
                >
                  {selectedExpense.remarks}
                </Paragraph>
              </div>
            )}

            {selectedExpense.receiptUrl && (
              <div style={{ marginBottom: 16 }}>
                <Title level={5}>Receipt</Title>
                <div
                  style={{
                    border: "1px dashed #d9d9d9",
                    borderRadius: 4,
                    padding: 16,
                    textAlign: "center",
                    backgroundColor: "#fafafa",
                  }}
                >
                  <FileTextOutlined style={{ fontSize: 24, marginBottom: 8 }} />
                  <div>Receipt: {selectedExpense.receiptUrl}</div>
                  <Text type="secondary" style={{ fontSize: "12px" }}>
                    (Receipt viewing would be implemented with proper file
                    storage)
                  </Text>
                </div>
              </div>
            )}

            <div
              style={{
                marginTop: 24,
                display: "flex",
                gap: 12,
                justifyContent: "flex-end",
              }}
            >
              <Button onClick={() => setIsDetailModalVisible(false)}>
                Close
              </Button>
              <Button
                type="primary"
                danger
                icon={<CloseOutlined />}
                onClick={() => {
                  setIsDetailModalVisible(false);
                  handleAction(selectedExpense, "reject");
                }}
              >
                Reject
              </Button>
              <Button
                type="primary"
                icon={<CheckOutlined />}
                onClick={() => {
                  setIsDetailModalVisible(false);
                  handleAction(selectedExpense, "approve");
                }}
                style={{ backgroundColor: "#52c41a", borderColor: "#52c41a" }}
              >
                Approve
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Action Confirmation Modal */}
      <Modal
        title={`${currentAction === "approve" ? "Approve" : "Reject"} Expense`}
        open={isActionModalVisible}
        onCancel={() => setIsActionModalVisible(false)}
        footer={null}
        width={500}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmitAction}>
          {selectedExpense && (
            <div
              style={{
                marginBottom: 16,
                padding: 12,
                backgroundColor: "#f9f9f9",
                borderRadius: 4,
              }}
            >
              <Text strong>Expense:</Text> {selectedExpense.description}
              <br />
              <Text strong>Employee:</Text> {selectedExpense.userName}
              <br />
              <Text strong>Amount:</Text>{" "}
              {formatCurrency(
                selectedExpense.convertedAmount,
                selectedExpense.baseCurrencyCode
              )}
            </div>
          )}

          <Form.Item
            label={`Comment ${
              currentAction === "reject"
                ? "(Required for rejection)"
                : "(Optional)"
            }`}
            name="comment"
            rules={
              currentAction === "reject"
                ? [
                    {
                      required: true,
                      message: "Please provide a reason for rejection",
                    },
                  ]
                : []
            }
          >
            <TextArea
              rows={4}
              placeholder={
                currentAction === "approve"
                  ? "Add optional comment for approval..."
                  : "Please explain why you're rejecting this expense..."
              }
            />
          </Form.Item>

          <Form.Item style={{ marginTop: 24, marginBottom: 0 }}>
            <Space style={{ width: "100%", justifyContent: "flex-end" }}>
              <Button onClick={() => setIsActionModalVisible(false)}>
                Cancel
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                danger={currentAction === "reject"}
                icon={
                  currentAction === "approve" ? (
                    <CheckOutlined />
                  ) : (
                    <CloseOutlined />
                  )
                }
                style={
                  currentAction === "approve"
                    ? { backgroundColor: "#52c41a", borderColor: "#52c41a" }
                    : {}
                }
              >
                {currentAction === "approve"
                  ? "Approve Expense"
                  : "Reject Expense"}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </ManagerLayout>
  );
}
