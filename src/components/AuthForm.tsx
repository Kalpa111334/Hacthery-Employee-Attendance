import React, { useState } from 'react';
import { UserPlus, LogIn, Shield } from 'lucide-react';
import { storage } from '../utils/storage';

interface AuthFormProps {
  onSuccess: (user: any) => void;
  onToast: (message: string, type: 'success' | 'error' | 'info') => void;
}

export const AuthForm: React.FC<AuthFormProps> = ({ onSuccess, onToast }) => {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    department: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const employees = storage.getEmployees();

    if (mode === 'login') {
      const user = employees.find(
        emp => emp.email === formData.email && emp.password === formData.password
      );
      if (user) {
        onSuccess(user);
        onToast('Login successful!', 'success');
      } else {
        onToast('Invalid credentials', 'error');
      }
    } else {
      if (employees.some(emp => emp.email === formData.email)) {
        onToast('Email already exists', 'error');
        return;
      }

      const newEmployee = {
        id: `emp-${Date.now()}`,
        ...formData,
        role: 'employee' as const,
        joinDate: new Date().toISOString()
      };

      storage.addEmployee(newEmployee);
      onToast('Registration successful! Please login.', 'success');
      setMode('login');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Divron Attendance System
          </h2>
          <div className="mt-4 flex justify-center gap-4">
            <button
              onClick={() => setMode('login')}
              className={`px-4 py-2 rounded-md ${
                mode === 'login'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-200 text-gray-700'
              }`}
            >
              <LogIn className="inline-block mr-2" size={18} />
              Login
            </button>
            <button
              onClick={() => setMode('register')}
              className={`px-4 py-2 rounded-md ${
                mode === 'register'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-200 text-gray-700'
              }`}
            >
              <UserPlus className="inline-block mr-2" size={18} />
              Register
            </button>
          </div>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            {mode === 'register' && (
              <>
                <div>
                  <input
                    type="text"
                    required
                    className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                    placeholder="Full Name"
                    value={formData.name}
                    onChange={e =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                  />
                </div>
                <div>
                  <input
                    type="text"
                    required
                    className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                    placeholder="Department"
                    value={formData.department}
                    onChange={e =>
                      setFormData({ ...formData, department: e.target.value })
                    }
                  />
                </div>
              </>
            )}
            <div>
              <input
                type="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Email address"
                value={formData.email}
                onChange={e =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />
            </div>
            <div>
              <input
                type="password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Password"
                value={formData.password}
                onChange={e =>
                  setFormData({ ...formData, password: e.target.value })
                }
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              {mode === 'login' ? (
                <>
                  <LogIn className="mr-2" size={18} />
                  Sign in
                </>
              ) : (
                <>
                  <UserPlus className="mr-2" size={18} />
                  Register
                </>
              )}
            </button>
          </div>

          <div className="text-center">
            <button
              type="button"
              onClick={() => {
                setFormData({
                  email: 'admin@divron.com',
                  password: 'admin123',
                  name: '',
                  department: ''
                });
              }}
              className="text-sm text-indigo-600 hover:text-indigo-500"
            >
              <Shield className="inline-block mr-1" size={16} />
              Admin Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};