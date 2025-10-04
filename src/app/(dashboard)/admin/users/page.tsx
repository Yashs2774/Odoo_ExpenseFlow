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
  message,
  Tag,
  Popconfirm
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  MailOutlined
} from '@ant-design/icons';
import AdminLayout from '@/components/AdminLayout';
import { User, UserFormData } from '@/types';

const { Option } = Select;

interface UserTableData extends User {
  key: string;
}

export default function UserManagement() {
  const [users, setUsers] = useState<UserTableData[]>([
    {
      key: '1',
      id: 1,
      name: 'John Doe',
      email: 'john.doe@company.com',
      role: 'Employee',
      manager: 'Jane Smith',
      isActive: true
    },
    {
      key: '2',
      id: 2,
      name: 'Jane Smith',
      email: 'jane.smith@company.com',
      role: 'Manager',
      manager: 'Admin User',
      isActive: true
    },
    {
      key: '3',
      id: 3,
      name: 'Admin User',
      email: 'admin@company.com',
      role: 'Admin',
      manager: '',
      isActive: true
    }
  ]);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingUser, setEditingUser] = useState<UserTableData | null>(null);
  const [form] = Form.useForm();

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 80,
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
      render: (role: string) => {
        let color = 'blue';
        if (role === 'Admin') color = 'red';
        else if (role === 'Manager') color = 'orange';
        else if (role === 'Employee') color = 'green';
        
        return <Tag color={color}>{role}</Tag>;
      },
    },
    {
      title: 'Manager',
      dataIndex: 'manager',
      key: 'manager',
    },
    {
      title: 'Status',
      dataIndex: 'isActive',
      key: 'isActive',
      render: (isActive: boolean) => (
        <Tag color={isActive ? 'green' : 'red'}>
          {isActive ? 'Active' : 'Inactive'}
        </Tag>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (record: UserTableData) => (
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
            icon={<MailOutlined />}
            onClick={() => handleSendPassword(record)}
          >
            Send Password
          </Button>
          <Popconfirm
            title="Are you sure you want to delete this user?"
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
    setEditingUser(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEdit = (user: UserTableData) => {
    setEditingUser(user);
    form.setFieldsValue(user);
    setIsModalVisible(true);
  };

  const handleDelete = (userId: number) => {
    setUsers(users.filter(user => user.id !== userId));
    message.success('User deleted successfully');
  };

  const handleSendPassword = (user: UserTableData) => {
    message.success(`Password sent to ${user.email}`);
  };

  const handleSubmit = async (values: UserFormData) => {
    try {
      if (editingUser) {
        // Update existing user
        setUsers(users.map(user => 
          user.id === editingUser.id 
            ? { ...user, ...values, key: user.key }
            : user
        ));
        message.success('User updated successfully');
      } else {
        // Add new user
        const newUser: UserTableData = {
          key: Date.now().toString(),
          id: users.length + 1,
          ...values,
          isActive: true
        };
        setUsers([...users, newUser]);
        message.success('User created successfully');
      }
      setIsModalVisible(false);
      form.resetFields();
    } catch (error) {
      message.error('Failed to save user');
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
    setEditingUser(null);
  };

  const managerOptions = users
    .filter(user => user.role === 'Manager' || user.role === 'Admin')
    .map(user => ({ label: user.name, value: user.name }));

  return (
    <AdminLayout title="User Management">
      <div style={{ marginBottom: 16 }}>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleAdd}
          size="large"
        >
          Add New User
        </Button>
      </div>
      
      <Table
        columns={columns}
        dataSource={users}
        pagination={{ pageSize: 10 }}
        scroll={{ x: true }}
      />

      <Modal
        title={editingUser ? 'Edit User' : 'Add New User'}
        open={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{ isActive: true }}
        >
          <Form.Item
            label="Name"
            name="name"
            rules={[{ required: true, message: 'Please enter the name' }]}
          >
            <Input placeholder="Enter full name" />
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: 'Please enter the email' },
              { type: 'email', message: 'Please enter a valid email' }
            ]}
          >
            <Input placeholder="Enter email address" />
          </Form.Item>

          <Form.Item
            label="Role"
            name="role"
            rules={[{ required: true, message: 'Please select a role' }]}
          >
            <Select placeholder="Select role">
              <Option value="Employee">Employee</Option>
              <Option value="Manager">Manager</Option>
              <Option value="Admin">Admin</Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="Manager"
            name="manager"
            rules={[{ required: false }]}
          >
            <Select 
              placeholder="Select manager (optional)"
              allowClear
              options={managerOptions}
            />
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                {editingUser ? 'Update User' : 'Create User'}
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