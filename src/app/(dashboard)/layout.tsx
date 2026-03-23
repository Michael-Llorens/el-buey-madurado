import ProtectedRoute from '@/components/ProtectedRoute';
import { Toaster } from 'sonner';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute requiredRol={['admin', 'camarero', 'cocinero']}>
      <div className="w-full h-screen bg-gray-900 text-white">
        {children}
        <Toaster
          position="top-right"
          richColors
          theme="dark"
          toastOptions={{
            duration: 3000,
          }}
        />
      </div>
    </ProtectedRoute>
  );
}
