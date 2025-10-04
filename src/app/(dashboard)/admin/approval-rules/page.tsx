'use client';

import React, { useState } from 'react';
import {
  Table,
  Button,
  Space,
  Modal,
  Form,
  Input,
  Select,
  InputNumber,
  Checkbox,
  message,
  Tag,
  Popconfirm,
  Card,
  List,
  Typography
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  OrderedListOutlined
} from '@ant-design/icons';
import AdminLayout from '@/components/AdminLayout';
import { ApprovalRule, ApprovalStep, User, ApprovalRuleFormData } from '@/types';

const { Option } = Select;
const { TextArea } = Input;
const { Text } = Typography;

interface ApprovalRuleTableData extends ApprovalRule {
  key: string;
}

export default function ApprovalRules() {
  const [approvalRules, setApprovalRules] = useState<ApprovalRuleTableData[]>([
    {
      key: '1',
      id: 1,
      name: 'Standard Approval',
      description: 'Standard approval process for expenses under $1000',
      isManagerDefaultApprover: true,
      minApprovalPercentage: null,
      steps: [
        { stepOrder: 1, approverUserId: 2, approverName: 'Jane Smith', isRequired: true },
        { stepOrder: 2, approverUserId: 3, approverName: 'Admin User', isRequired: false }
      ]
    },
    {
      key: '2',
      id: 2,
      name: 'High Value Approval',
      description: 'Multi-level approval for expenses over $1000',
      isManagerDefaultApprover: true,
      minApprovalPercentage: 75,
      steps: [
        { stepOrder: 1, approverUserId: 2, approverName: 'Jane Smith', isRequired: true },
        { stepOrder: 2, approverUserId: 3, approverName: 'Admin User', isRequired: true },
        { stepOrder: 3, approverUserId: 4, approverName: 'Finance Manager', isRequired: true }
      ]
    }
  ]);

  const [users] = useState<User[]>([
    { id: 1, name: 'John Doe', email: 'john.doe@company.com', role: 'Employee', isActive: true },
    { id: 2, name: 'Jane Smith', email: 'jane.smith@company.com', role: 'Manager', isActive: true },
    { id: 3, name: 'Admin User', email: 'admin@company.com', role: 'Admin', isActive: true },
    { id: 4, name: 'Finance Manager', email: 'finance@company.com', role: 'Manager', isActive: true }
  ]);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingRule, setEditingRule] = useState<ApprovalRuleTableData | null>(null);
  const [form] = Form.useForm();
  const [approvalSteps, setApprovalSteps] = useState<ApprovalStep[]>([]);

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 80,
    },
    {
      title: 'Rule Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Manager as First Approver',
      dataIndex: 'isManagerDefaultApprover',
      key: 'isManagerDefaultApprover',
      render: (value: boolean) => (
        <Tag color={value ? 'green' : 'red'}>
          {value ? 'Yes' : 'No'}
        </Tag>
      ),
    },
    {
      title: 'Min Approval %',
      dataIndex: 'minApprovalPercentage',
      key: 'minApprovalPercentage',
      render: (value: number | null) => value ? `${value}%` : 'N/A',
    },
    {
      title: 'Steps Count',
      key: 'stepsCount',
      render: (record: ApprovalRuleTableData) => record.steps.length,
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (record: ApprovalRuleTableData) => (
        <Space>
          <Button
            type="primary"
            size="small"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            Edit
          </Button>
          <Button
            type="default"
            size="small"
            icon={<OrderedListOutlined />}
            onClick={() => handleViewSteps(record)}
          >
            View Steps
          </Button>
          <Popconfirm
            title="Are you sure you want to delete this rule?"
            onConfirm={() => handleDelete(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button
              type="primary"
              danger
              size="small"
              icon={<DeleteOutlined />}
            >
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const handleAdd = () => {
    setEditingRule(null);
    form.resetFields();
    setApprovalSteps([]);
    setIsModalVisible(true);
  };

  const handleEdit = (rule: ApprovalRuleTableData) => {
    setEditingRule(rule);
    form.setFieldsValue({
      name: rule.name,
      description: rule.description,
      isManagerDefaultApprover: rule.isManagerDefaultApprover,
      minApprovalPercentage: rule.minApprovalPercentage,
    });
    setApprovalSteps([...rule.steps]);
    setIsModalVisible(true);
  };

  const handleViewSteps = (rule: ApprovalRuleTableData) => {
    Modal.info({
      title: `Approval Steps for "${rule.name}"`,
      width: 600,
      content: (
        <List
          dataSource={rule.steps.sort((a, b) => a.stepOrder - b.stepOrder)}
          renderItem={(step) => (
            <List.Item>
              <div>
                <Text strong>Step {step.stepOrder}:</Text> {step.approverName}
                <Tag color={step.isRequired ? 'green' : 'blue'} style={{ marginLeft: 8 }}>
                  {step.isRequired ? 'Required' : 'Optional'}
                </Tag>
              </div>
            </List.Item>
          )}
        />
      ),
    });
  };

  const handleDelete = (ruleId: number) => {
    setApprovalRules(approvalRules.filter(rule => rule.id !== ruleId));
    message.success('Approval rule deleted successfully');
  };

  const handleSubmit = async (values: ApprovalRuleFormData) => {
    try {
      if (approvalSteps.length === 0) {
        message.error('Please add at least one approval step');
        return;
      }

      const ruleData = {
        ...values,
        steps: approvalSteps
      };

      if (editingRule) {
        // Update existing rule
        setApprovalRules(approvalRules.map(rule => 
          rule.id === editingRule.id 
            ? { ...rule, ...ruleData, key: rule.key }
            : rule
        ));
        message.success('Approval rule updated successfully');
      } else {
        // Add new rule
        const newRule: ApprovalRuleTableData = {
          key: Date.now().toString(),
          id: approvalRules.length + 1,
          ...ruleData,
          minApprovalPercentage: ruleData.minApprovalPercentage || null,
        };
        setApprovalRules([...approvalRules, newRule]);
        message.success('Approval rule created successfully');
      }
      setIsModalVisible(false);
      form.resetFields();
      setApprovalSteps([]);
    } catch (error) {
      message.error('Failed to save approval rule');
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
    setEditingRule(null);
    setApprovalSteps([]);
  };

  const addApprovalStep = () => {
    const newStep: ApprovalStep = {
      stepOrder: approvalSteps.length + 1,
      approverUserId: 0,
      approverName: '',
      isRequired: true
    };
    setApprovalSteps([...approvalSteps, newStep]);
  };

  const updateApprovalStep = (index: number, field: keyof ApprovalStep, value: any) => {
    const updatedSteps = [...approvalSteps];
    
    if (field === 'approverUserId') {
      const selectedUser = users.find(user => user.id === value);
      updatedSteps[index].approverUserId = value;
      updatedSteps[index].approverName = selectedUser?.name || '';
    } else if (field === 'stepOrder') {
      updatedSteps[index].stepOrder = value;
    } else if (field === 'approverName') {
      updatedSteps[index].approverName = value;
    } else if (field === 'isRequired') {
      updatedSteps[index].isRequired = value;
    }
    
    setApprovalSteps(updatedSteps);
  };

  const removeApprovalStep = (index: number) => {
    const updatedSteps = approvalSteps.filter((_, i) => i !== index);
    // Reorder steps
    updatedSteps.forEach((step, i) => {
      step.stepOrder = i + 1;
    });
    setApprovalSteps(updatedSteps);
  };

  const approverOptions = users
    .filter(user => user.role === 'Manager' || user.role === 'Admin')
    .map(user => ({ label: user.name, value: user.id }));

  return (
    <AdminLayout title="Approval Rules Management">
      <div style={{ marginBottom: 16 }}>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleAdd}
          size="large"
        >
          Create New Approval Rule
        </Button>
      </div>
      
      <Table
        columns={columns}
        dataSource={approvalRules}
        pagination={{ pageSize: 10 }}
        scroll={{ x: true }}
      />

      <Modal
        title={editingRule ? 'Edit Approval Rule' : 'Create New Approval Rule'}
        open={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        width={800}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
        >
          <Form.Item
            label="Rule Name"
            name="name"
            rules={[{ required: true, message: 'Please enter the rule name' }]}
          >
            <Input placeholder="Enter rule name" />
          </Form.Item>

          <Form.Item
            label="Description"
            name="description"
            rules={[{ required: true, message: 'Please enter the description' }]}
          >
            <TextArea 
              placeholder="Enter rule description" 
              rows={3}
            />
          </Form.Item>

          <Form.Item
            name="isManagerDefaultApprover"
            valuePropName="checked"
          >
            <Checkbox>
              Is manager the default first approver?
            </Checkbox>
          </Form.Item>

          <Form.Item
            label="Minimum Approval Percentage"
            name="minApprovalPercentage"
            help="Leave empty if all required approvers must approve"
          >
            <InputNumber
              min={1}
              max={100}
              placeholder="Enter percentage (optional)"
              style={{ width: '100%' }}
            />
          </Form.Item>

          <Card title="Approval Sequence" style={{ marginBottom: 16 }}>
            <Button
              type="dashed"
              onClick={addApprovalStep}
              style={{ marginBottom: 16, width: '100%' }}
              icon={<PlusOutlined />}
            >
              Add Approval Step
            </Button>
            
            {approvalSteps.map((step, index) => (
              <Card
                key={index}
                size="small"
                style={{ marginBottom: 8 }}
                title={`Step ${step.stepOrder}`}
                extra={
                  <Button
                    type="text"
                    danger
                    size="small"
                    onClick={() => removeApprovalStep(index)}
                    icon={<DeleteOutlined />}
                  />
                }
              >
                <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
                  <Select
                    placeholder="Select Approver"
                    style={{ flex: 1 }}
                    value={step.approverUserId || undefined}
                    onChange={(value) => updateApprovalStep(index, 'approverUserId', value)}
                    options={approverOptions}
                  />
                  <Checkbox
                    checked={step.isRequired}
                    onChange={(e) => updateApprovalStep(index, 'isRequired', e.target.checked)}
                  >
                    Required
                  </Checkbox>
                </div>
              </Card>
            ))}
          </Card>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                {editingRule ? 'Update Rule' : 'Create Rule'}
              </Button>
              <Button onClick={handleCancel}>
                Cancel
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </AdminLayout>
  );
}