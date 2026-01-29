import ProtectedRoute from '@/components/ProtectedRoute';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute requiredRol={['admin', 'camarero', 'cocinero']}>
      <div className="w-full h-screen bg-gray-900 text-white">
        {children}
      </div>
    </ProtectedRoute>
  );
}
