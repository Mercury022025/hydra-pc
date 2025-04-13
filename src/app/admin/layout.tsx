import React from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Dashboard",
  description: "Admin dashboard for managing application",
};

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-primary text-white p-4">
        <h1 className="text-xl font-bold">Admin Dashboard</h1>
      </header>
      <main className="flex-1 p-6">{children}</main>
      <footer className="bg-gray-100 p-4 text-center text-sm text-gray-600">
        Admin Portal &copy; {new Date().getFullYear()}
      </footer>
    </div>
  );
}
