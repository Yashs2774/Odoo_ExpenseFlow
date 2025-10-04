'use client';

import { AntdRegistry } from "@ant-design/nextjs-registry";
import { AuthProvider } from "./contexts/AuthContext";

// This is a client component that wraps all of your context providers
export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AntdRegistry>
      <AuthProvider>
        {children}
      </AuthProvider>
    </AntdRegistry>
  );
}