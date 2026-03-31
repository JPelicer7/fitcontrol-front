// app/(dashboard)/layout.tsx

import { AppSidebar } from "./_components/app-sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // <div className="min-h-screen bg-background flex">
    <div className="min-h-screen bg-background flex flex-col lg:flex-row">
      <AppSidebar />
      {}
      {/* <main className="flex-1 ml-64 lg:p-8 pt-16 lg:pt-8 overflow-y-auto"> */}
      {/* <main className="transition-all duration-300 lg:ml-64 p-4 md:p-6 lg:p-8 pt-20 lg:pt-8 overflow-y-auto min-h-screen"> */}
      <main className="flex-1 transition-all duration-300 lg:ml-64 p-4 lg:p-8 pt-20 lg:pt-8 overflow-y-auto w-full">
        {children}
      </main>
    </div>
  );
}