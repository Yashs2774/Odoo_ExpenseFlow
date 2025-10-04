"use client";

import React from "react";
import { Layout, Menu, Avatar, Dropdown, Space, Typography } from "antd";
import {
  DashboardOutlined,
  CheckSquareOutlined,
  TeamOutlined,
  HistoryOutlined,
  UserOutlined,
  LogoutOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { currentManager } from "@/data/mockData";

const { Header, Content, Sider } = Layout;
const { Text } = Typography;

export default function ManagerLayout({ children, title }) {
  const pathname = usePathname();

  const menuItems = [
    {
      key: "dashboard",
      icon: <DashboardOutlined />,
      label: <Link href="/manager">Dashboard</Link>,
    },
    {
      key: "approvals",
      icon: <CheckSquareOutlined />,
      label: <Link href="/manager/approvals">Approvals to Review</Link>,
    },
    {
      key: "team",
      icon: <TeamOutlined />,
      label: <Link href="/manager/team">My Team</Link>,
    },
    {
      key: "history",
      icon: <HistoryOutlined />,
      label: <Link href="/manager/history">Approval History</Link>,
    },
  ];

  // Determine selected key based on current path
  const getSelectedKey = () => {
    if (pathname === "/") return ["dashboard"];
    if (pathname.startsWith("/approvals")) return ["approvals"];
    if (pathname.startsWith("/team")) return ["team"];
    if (pathname.startsWith("/history")) return ["history"];
    return ["dashboard"];
  };

  const userMenuItems = [
    {
      key: "profile",
      icon: <UserOutlined />,
      label: "Profile Settings",
    },
    {
      key: "preferences",
      icon: <SettingOutlined />,
      label: "Preferences",
    },
    {
      type: "divider",
    },
    {
      key: "logout",
      icon: <LogoutOutlined />,
      label: "Logout",
      danger: true,
    },
  ];

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider width={220} style={{ background: "#fff" }}>
        <div
          style={{
            height: 64,
            margin: 16,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            borderRadius: 8,
            color: "#fff",
            fontWeight: "bold",
            fontSize: "16px",
          }}
        >
          EMS Manager
        </div>
        <Menu
          mode="inline"
          selectedKeys={getSelectedKey()}
          style={{ height: "100%", borderRight: 0 }}
          items={menuItems}
        />
      </Sider>
      <Layout>
        <Header
          style={{
            background: "#fff",
            padding: "0 24px",
            boxShadow: "0 1px 4px rgba(0,21,41,.08)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <h1 style={{ margin: 0, fontSize: "24px", fontWeight: "bold" }}>
            {title}
          </h1>

          <Space>
            <Text type="secondary">Welcome back,</Text>
            <Dropdown
              menu={{ items: userMenuItems }}
              placement="bottomRight"
              trigger={["click"]}
            >
              <Space style={{ cursor: "pointer" }}>
                <Avatar
                  style={{ backgroundColor: "#667eea" }}
                  icon={<UserOutlined />}
                />
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                  }}
                >
                  <Text strong>{currentManager.name}</Text>
                  <Text type="secondary" style={{ fontSize: "12px" }}>
                    Manager
                  </Text>
                </div>
              </Space>
            </Dropdown>
          </Space>
        </Header>
        <Content
          style={{
            margin: "24px 16px",
            padding: 24,
            background: "#fff",
            minHeight: 280,
            borderRadius: 8,
            boxShadow:
              "0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24)",
          }}
        >
          {children}
        </Content>
      </Layout>
    </Layout>
  );
}
