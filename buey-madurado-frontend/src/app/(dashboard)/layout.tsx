import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "El Buey Madurado - Dashboard",
  description: "Panel de Administración",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="w-full h-screen bg-gray-900 text-white">
      {children}
    </div>
  );
}
