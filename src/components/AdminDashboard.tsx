import React, { useState, useEffect } from 'react';
import {
  Users,
  UserPlus,
  Clock,
  Calendar,
  Download,
  UserMinus,
  LogOut
} from 'lucide-react';
import { Employee, AttendanceRecord } from '../types';
import { storage } from '../utils/storage';

interface AdminDashboardProps {
  onLogout: () => void;
  onToast: (message: string, type: 'success' | 'error' | 'info') => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  onLogout,
  onToast
}) => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [newEmployee, setNewEmployee] = useState({
    name: '',
    email: '',
    department: '',
    password: ''
  });
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    setEmployees(storage.getEmployees().filter(emp => emp.role !== 'admin'));
    setAttendance(storage.getAttendance());
  }, []);

  const handleAddEmployee = () => {
    if (employees.some(emp => emp.email === newEmployee.email)) {
      onToast('Email already exists', 'error');
      return;
    }

    const employee: Employee = {
      id: `emp-${Date.now()}`,
      ...newEmployee,
      role: 'employee',
      joinDate: new Date().toISOString()
    };

    storage.addEmployee(employee);
    setEmployees([...employees, employee]);
    setShowAddModal(false);
    setNewEmployee({ name: '', email: '', department: '', password: '' });
    onToast('Employee added successfully', 'success');
  };

  const handleRemoveEmployee = (id: string) => {
    storage.removeEmployee(id);
    setEmployees(employees.filter(emp => emp.id !== id));
    onToast('Employee removed successfully', 'success');
  };

  const downloadReport = (type: 'daily' | 'monthly' | 'yearly') => {
    const today = new Date();
    let filteredAttendance = attendance;

    if (type === 'daily') {
      filteredAttendance = attendance.filter(
        record =>
          new Date(record.date).toDateString() === today.toDateString()
      );
    } else if (type === 'monthly') {
      filteredAttendance = attendance.filter(
        record =>
          new Date(record.date).getMonth() === today.getMonth() &&
          new Date(record.date).getFullYear() === today.getFullYear()
      );
    } else if (type === 'yearly') {
      filteredAttendance = attendance.filter(
        record =>
          new Date(record.date).getFullYear() === today.getFullYear()
      );
    }

    const csv = [
      ['Employee ID', 'Date', 'Check In', 'Check Out', 'Status'].join(','),
      ...filteredAttendance.map(record =>
        [
          record.employeeId,
          record.date,
          record.checkIn,
          record.checkOut || 'N/A',
          record.status
        ].join(',')
      )
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `attendance_${type}_${new Date().toISOString()}.csv`;
    a.click();
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-indigo-600">
                Admin Dashboard
              </h1>
            </div>
            <div className="flex items-center">
              <button
                onClick={onLogout}
                className="ml-4 px-4 py-2 rounded-md text-white bg-red-500 hover:bg-red-600 flex items-center"
              >
                <LogOut className="mr-2" size={18} />
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Users className="h-6 w-6 text-gray-400" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Total Employees
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {employees.length}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Clock className="h-6 w-6 text-gray-400" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Present Today
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {
                          attendance.filter(
                            record =>
                              new Date(record.date).toDateString() ===
                              new Date().toDateString()
                          ).length
                        }
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-medium text-gray-900">
                Employee Management
              </h2>
              <button
                onClick={() => setShowAddModal(true)}
                className="px-4 py-2 rounded-md text-white bg-indigo-600 hover:bg-indigo-700 flex items-center"
              >
                <UserPlus className="mr-2" size={18} />
                Add Employee
              </button>
            </div>

            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Department
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Join Date
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {employees.map(employee => (
                    <tr key={employee.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {employee.name}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">
                          {employee.email}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">
                          {employee.department}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">
                          {new Date(employee.joinDate).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => handleRemoveEmployee(employee.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <UserMinus size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="mt-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-medium text-gray-900">
                Attendance Reports
              </h2>
              <div className="flex gap-4">
                <button
                  onClick={() => downloadReport('daily')}
                  className="px-4 py-2 rounded-md text-white bg-green-600 hover:bg-green-700 flex items-center"
                >
                  <Download className="mr-2" size={18} />
                  Daily Report
                </button>
                <button
                  onClick={() => downloadReport('monthly')}
                  className="px-4 py-2 rounded-md text-white bg-blue-600 hover:bg-blue-700 flex items-center"
                >
                  <Calendar className="mr-2" size={18} />
                  Monthly Report
                </button>
                <button
                  onClick={() => downloadReport('yearly')}
                  className="px-4 py-2 rounded-md text-white bg-purple-600 hover:bg-purple-700 flex items-center"
                >
                  <Calendar className="mr-2" size={18} />
                  Yearly Report
                </button>
              </div>
            </div>

            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Employee
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Check In
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Check Out
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {attendance.map(record => {
                    const employee = employees.find(
                      emp => emp.id === record.employeeId
                    );
                    return (
                      <tr key={record.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {employee?.name || 'Unknown'}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">
                            {new Date(record.date).toLocaleDateString()}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">
                            {record.checkIn}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">
                            {record.checkOut || 'Not checked out'}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              record.status === 'present'
                                ? 'bg-green-100 text-green-800'
                                : record.status === 'late'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {record.status}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>

      {showAddModal && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 transition-opacity"
              aria-hidden="true"
              onClick={() => setShowAddModal(false)}
            >
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      Add New Employee
                    </h3>
                    <div className="mt-2">
                      <input
                        type="text"
                        placeholder="Name"
                        className="mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        value={newEmployee.name}
                        onChange={e =>
                          setNewEmployee({
                            ...newEmployee,
                            name: e.target.value
                          })
                        }
                      />
                      <input
                        type="email"
                        placeholder="Email"
                        className="mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        value={newEmployee.email}
                        onChange={e =>
                          setNewEmployee({
                            ...newEmployee,
                            email: e.target.value
                          })
                        }
                      />
                      <input
                        type="text"
                        placeholder="Department"
                        className="mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        value={newEmployee.department}
                        onChange={e =>
                          setNewEmployee({
                            ...newEmployee,
                            department: e.target.value
                          })
                        }
                      />
                      <input
                        type="password"
                        placeholder="Password"
                        className="mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        value={newEmployee.password}
                        onChange={e =>
                          setNewEmployee({
                            ...newEmployee,
                            password: e.target.value
                          })
                        }
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={handleAddEmployee}
                >
                  Add Employee
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => setShowAddModal(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};