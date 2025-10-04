"use client";

import { useAuth } from "@/app/context/AuthContext";
import { Button, Form, Input, Alert, Typography } from "antd"; // Import Typography
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import Link from "next/link"; // Import Link for navigation

const { Text } = Typography;

function Login() {
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const router = useRouter();
  const { login } = useAuth();

  const handleSubmit = async (values) => {
    setLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/v1/auth/login`,
        {
          email: values.email,
          password: values.password,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        const { jwtToken, role, firstName } = response.data;
        await login(jwtToken, { firstName, role });

        // Redirect based on user role (assuming 4 is an admin/user role)
        // You might want to make this more flexible later
        if (role === 1) {
          router.push("/admin"); // Or your main dashboard route
          setSuccessMessage("Login successful!");
        } else if (role === 4) {
          router.push("/admin"); // Or your main dashboard route
          setSuccessMessage("Login successful!");
        } else {
          // Fallback for other roles if needed
          setErrorMessage("Your user role does not have access.");
        }
      } else {
        setErrorMessage(
          response.data.message || "Login failed. Please try again."
        );
      }
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message ||
          error.response?.data ||
          "An error occurred. Please check your credentials and try again."
      );
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
          backgroundImage: "url('/images/MedsCred.png')", // Make sure this path is correct in your `public` folder
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
          Welcome Back
        </h1>
        <p style={{ fontSize: "1.2rem", maxWidth: "450px" }}>
          Access your account and streamline your expense management.
        </p>
      </div>

      {/* Right side with the form */}
      <div
        style={{
          width: "40%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          background: "#FFF",
          padding: "20px",
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
            Sign In
          </h2>

          <Form
            name="login"
            layout="vertical"
            onFinish={handleSubmit}
            autoComplete="off"
          >
            <Form.Item
              label="Email"
              name="email"
              rules={[
                { required: true, message: "Please enter your email!" },
                { type: "email", message: "Please enter a valid email!" },
              ]}
            >
              <Input
                placeholder="Enter your email"
                style={{ height: "50px" }}
              />
            </Form.Item>

            <Form.Item
              label="Password"
              name="password"
              rules={[
                { required: true, message: "Please enter your password!" },
              ]}
            >
              <Input.Password
                placeholder="Enter your password"
                style={{ height: "50px" }}
              />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                block
                loading={loading}
                style={{
                  height: "50px",
                  fontSize: "1rem",
                  fontWeight: "bold",
                }}
              >
                Log In
              </Button>
            </Form.Item>

            {errorMessage && (
              <Alert
                style={{ marginTop: 20 }}
                message={errorMessage}
                type="error"
                showIcon
              />
            )}

            {/* --- KEY CHANGE: Added Registration Link --- */}
            <div style={{ textAlign: "center", marginTop: "20px" }}>
              <Text type="secondary">Don't have an account? </Text>
              <Link href="/auth/register" passHref>
                <Button type="link" style={{ padding: 0 }}>
                  Register here
                </Button>
              </Link>
            </div>

            <div style={{ marginTop: "40px", textAlign: "center" }}>
              <Text type="secondary">Copyright © 2025 - ExpenseFlow</Text>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
}

export default Login;
