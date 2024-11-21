import React, { useState } from 'react';
import { AuthForm } from './components/AuthForm';
import { AdminDashboard } from './components/AdminDashboard';
import { EmployeeDashboard } from './components/EmployeeDashboard';
import { Toast } from './components/Toast';
import { Employee } from './types';

function App() {
  const [user, setUser] = useState<Employee | null>(null);
  const [toast, setToast] = useState<{
    message: string;
    type: 'success' | 'error' | 'info';
  } | null>(null);

  const handleToast = (message: string, type: 'success' | 'error' | 'info') => {
    setToast({ message, type });
  };

  const handleLogout = () => {
    setUser(null);
    handleToast('Logged out successfully', 'success');
  };

  return (
    <>
      {!user ? (
        <AuthForm onSuccess={setUser} onToast={handleToast} />
      ) : user.role === 'admin' ? (
        <AdminDashboard onLogout={handleLogout} onToast={handleToast} />
      ) : (
        <EmployeeDashboard
          employee={user}
          onLogout={handleLogout}
          onToast={handleToast}
        />
      )}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </>
  );
}

export default App;