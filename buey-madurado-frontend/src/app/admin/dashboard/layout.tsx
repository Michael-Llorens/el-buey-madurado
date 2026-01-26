import ProtectedRoute from '@/components/ProtectedRoute';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute requiredRol={['admin', 'cocinero', 'camarero']}>
      <div className="min-h-screen bg-gray-900">
        {children}
      </div>
    </ProtectedRoute>
  );
}