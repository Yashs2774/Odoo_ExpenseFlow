"use client";

import React, { useState } from "react";
import { Form, Input, Button, Typography, message, Select } from "antd";
import { useAuth } from "@/app/context/AuthContext"; // Ensure this path is correct
import { useRouter } from "next/navigation";
import Link from "next/link";

const { Title, Text } = Typography;
const { Option } = Select;

export default function RegisterPage() {
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const router = useRouter();
  const [form] = Form.useForm();

  const currencies = [
    { code: "USD", name: "US Dollar" },
    { code: "EUR", name: "Euro" },
    { code: "GBP", name: "British Pound" },
    { code: "INR", name: "Indian Rupee" },
  ];

  const countries = [
    "United States",
    "United Kingdom",
    "India",
    "Canada",
    "Australia",
    "Germany",
    "France",
  ];

  const onFinish = async (values) => {
    setLoading(true);
    try {
      await register(values);
      message.success("Registration successful! Please login.");
      // Redirect to login page after successful registration
      router.push("/auth/login");
    } catch (error) {
      const errorMsg =
        error.response?.data?.error ||
        error.response?.data?.detail ||
        error.response?.data?.company_name?.[0] ||
        "Registration failed";
      message.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: "flex", height: "100vh", width: "100%" }}>
      {/* Left side with background image */}
      <div
        style={{
          width: "60%",
          backgroundImage: "url('/images/MedsCred.png')", // Use the same image for consistency
          backgroundSize: "cover",
          backgroundPosition: "center",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          padding: "40px",
          color: "#fff",
          textAlign: "center",
        }}
      >
        <h1
          style={{ fontSize: "3rem", fontWeight: "bold", marginBottom: "1rem" }}
        >
          Create Your Account
        </h1>
        <p style={{ fontSize: "1.2rem", maxWidth: "450px" }}>
          Join ExpenseFlow and streamline your expense management from day one.
        </p>
      </div>

      {/* Right side with the registration form */}
      <div
        style={{
          width: "40%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          background: "#FFF",
          padding: "20px",
          overflowY: "auto", // Add scroll for smaller screens
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: "400px",
          }}
        >
          <h2
            style={{ marginBottom: "20px", fontSize: 32, textAlign: "center" }}
          >
            Register
          </h2>

          <Form
            form={form}
            name="register"
            onFinish={onFinish}
            layout="vertical"
          >
            {/* Your existing form fields fit perfectly here */}
            <Form.Item
              name="username"
              label="Username"
              rules={[{ required: true, message: "Username is required" }]}
            >
              <Input placeholder="Username" style={{ height: "45px" }} />
            </Form.Item>

            <Form.Item
              name="email"
              label="Email"
              rules={[
                { required: true, message: "Email is required" },
                { type: "email", message: "Invalid email" },
              ]}
            >
              <Input
                placeholder="email@company.com"
                style={{ height: "45px" }}
              />
            </Form.Item>

            <Form.Item
              name="password"
              label="Password"
              rules={[
                { required: true, message: "Password is required" },
                { min: 6, message: "Minimum 6 characters" },
              ]}
            >
              <Input.Password
                placeholder="Enter password"
                style={{ height: "45px" }}
              />
            </Form.Item>

            <Form.Item
              name="company_name"
              label="Company Name"
              rules={[{ required: true, message: "Company name is required" }]}
            >
              <Input placeholder="Your Company" style={{ height: "45px" }} />
            </Form.Item>

            <Form.Item
              name="country"
              label="Country"
              rules={[{ required: true, message: "Country is required" }]}
            >
              <Select
                placeholder="Select country"
                showSearch
                style={{ height: "45px" }}
              >
                {countries.map((country) => (
                  <Option key={country} value={country}>
                    {country}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              name="currency"
              label="Currency"
              rules={[{ required: true, message: "Currency is required" }]}
            >
              <Select
                placeholder="Select currency"
                showSearch
                style={{ height: "45px" }}
              >
                {currencies.map((curr) => (
                  <Option
                    key={curr.code}
                    value={curr.code}
                  >{`${curr.code} - ${curr.name}`}</Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                block
                loading={loading}
                style={{ height: "50px", fontSize: "1rem", fontWeight: "bold" }}
              >
                Register
              </Button>
            </Form.Item>

            <div style={{ textAlign: "center", marginTop: "20px" }}>
              <Text type="secondary">Already have an account? </Text>
              <Link href="/auth/login" passHref>
                <Button type="link" style={{ padding: 0 }}>
                  Login here
                </Button>
              </Link>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
}
