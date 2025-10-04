"use client";

import {
  Layout,
  Menu,
  Avatar,
  Dropdown,
  Space,
  Typography,
  Button,
} from "antd";
import {
  DashboardOutlined,
  PlusOutlined,
  LogoutOutlined,
  UserOutlined,
  FileTextOutlined,
} from "@ant-design/icons";
import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";

const { Header, Sider, Content } = Layout;
const { Title, Text } = Typography;

export default function AppLayout({ children, activeKey = "dashboard" }) {
  const [collapsed, setCollapsed] = useState(false);
  const { user, logout } = useAuth();

  const menuItems = [
    {
      key: "dashboard",
      icon: <DashboardOutlined />,
      label: "My Expenses",
    },
    {
      key: "new-expense",
      icon: <PlusOutlined />,
      label: "New Expense",
    },
  ];

  const userMenuItems = [
    {
      key: "profile",
      icon: <UserOutlined />,
      label: "Profile",
    },
    {
      type: "divider",
    },
    {
      key: "logout",
      icon: <LogoutOutlined />,
      label: "Logout",
      onClick: logout,
    },
  ];

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={setCollapsed}
        theme="light"
        style={{
          boxShadow: "2px 0 6px rgba(0, 0, 0, 0.1)",
        }}
      >
        <div
          style={{
            height: 64,
            display: "flex",
            alignItems: "center",
            justifyContent: collapsed ? "center" : "flex-start",
            padding: collapsed ? "0" : "0 16px",
            borderBottom: "1px solid #f0f0f0",
          }}
        >
          <FileTextOutlined style={{ fontSize: 24, color: "#1890ff" }} />
          {!collapsed && (
            <Title level={4} style={{ margin: "0 0 0 12px", color: "#1890ff" }}>
              ExpenseApp
            </Title>
          )}
        </div>

        <Menu
          mode="inline"
          selectedKeys={[activeKey]}
          items={menuItems}
          style={{ border: "none", marginTop: 16 }}
          onClick={({ key }) => {
            if (key === "dashboard") {
              window.location.href = "/";
            } else if (key === "new-expense") {
              window.location.href = "/new-expense";
            }
          }}
        />
      </Sider>

      <Layout>
        <Header
          style={{
            background: "#fff",
            padding: "0 24px",
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.06)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div>
            <Title level={4} style={{ margin: 0 }}>
              Employee Dashboard
            </Title>
          </div>

          <Space size="middle">
            <Text type="secondary">{user?.company?.name}</Text>
            <Dropdown
              menu={{ items: userMenuItems }}
              trigger={["click"]}
              placement="bottomRight"
            >
              <Button
                type="text"
                style={{ height: "auto", padding: "8px 12px" }}
              >
                <Space>
                  <Avatar
                    size="small"
                    icon={<UserOutlined />}
                    style={{ backgroundColor: "#1890ff" }}
                  />
                  <span>{user?.name}</span>
                </Space>
              </Button>
            </Dropdown>
          </Space>
        </Header>

        <Content
          style={{
            margin: "24px 24px 0",
            overflow: "auto",
          }}
        >
          {children}
        </Content>
      </Layout>
    </Layout>
  );
}
