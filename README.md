<<<<<<< HEAD

# ExpenseFlow_odoo

# Odoo Hackathon Round 1

# Expense Management System - Dashboard

A Next.js-based dashboard for the Expense Management System, built with Ant Design components and TypeScript.

## Features

### Dashboard

- **Overview Statistics**: Display key metrics like total users, pending expenses, and active approval rules
- **Navigation**: Easy sidebar navigation between different admin sections

### User Management

- **Create Users**: Add new employees, managers, and admins
- **Edit Users**: Update user information including roles and manager assignments
- **Role Management**: Assign roles (Admin, Manager, Employee) with proper permissions
- **Manager Assignment**: Assign managers to employees for approval workflows
- **Send Password**: Generate and send secure passwords to new users
- **User Status**: Activate or deactivate user accounts

### Approval Rules Engine

- **Create Approval Rules**: Define complex, multi-level approval workflows
- **Manager as Default Approver**: Option to automatically include the employee's manager in approval flow
- **Approval Sequence**: Define the order of approvers with step-by-step configuration
- **Required vs Optional Approvers**: Mark approvers as required or optional
- **Minimum Approval Percentage**: Set percentage thresholds for approval (e.g., 60% of approvers must approve)
- **View Approval Steps**: Visual representation of approval workflows
- **Edit and Delete Rules**: Modify existing approval rules or remove outdated ones

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **UI Library**: Ant Design (antd)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + Ant Design
- **State Management**: React hooks (useState)

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

## Data Models

### User

- ID, Name, Email
- Role (Admin, Manager, Employee)
- Manager assignment
- Active status

### Approval Rule

- Rule name and description
- Manager as default approver flag
- Minimum approval percentage
- Approval steps sequence

### Approval Step

- Step order
- Approver user
- Required/Optional flag

## Key Features Implemented

1. **Responsive Design**: Mobile-friendly interface using Ant Design components
2. **Type Safety**: Full TypeScript implementation with proper type definitions
3. **Modular Architecture**: Reusable components and clean separation of concerns
4. **User Experience**: Intuitive forms, confirmations, and feedback messages
5. **Data Validation**: Form validation for all user inputs
6. **Dynamic UI**: Real-time updates and interactive elements

## Future Enhancements

- Integration with backend API
- Real-time notifications
- Advanced filtering and search
- Bulk operations
- Export functionality
- Audit trails
- Dashboard analytics

## Development Notes

- Uses Ant Design's `open` prop instead of deprecated `visible` for modals
- Implements proper TypeScript interfaces for type safety
- Uses Next.js App Router with client components (`'use client'`)
- Responsive design with proper mobile support
- Clean component architecture with reusable layout component
  > > > > > > > b5a607f (Initial commit)
