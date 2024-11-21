import React, { useState, useEffect } from 'react';
import { Clock, Calendar, History, LogOut } from 'lucide-react';
import { Employee, AttendanceRecord } from '../types';
import { storage } from '../utils/storage';

interface EmployeeDashboardProps {
  employee: Employee;
  onLogout: () => void;
  onToast: (message: string, type: 'success' | 'error' | 'info') => void;
}

export const EmployeeDashboard: React.FC<EmployeeDashboardProps> = ({
  employee,
  onLogout,
  onToast
}) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [todayAttendance, setTodayAttendance] = useState<AttendanceRecord | null>(
    null
  );
  const [attendanceHistory, setAttendanceHistory] = useState<AttendanceRecord[]>(
    []
  );

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const attendance = storage.getAttendance();
    const today = new Date().toDateString();
    
    setTodayAttendance(
      attendance.find(
        record =>
          record.employeeId === employee.id &&
          new Date(record.date).toDateString() === today
      ) || null
    );

    setAttendanceHistory(
      attendance.filter(record => record.employeeId === employee.id)
    );
  }, [employee.id]);

  const handleCheckIn = () => {
    const now = new Date();
    const record: AttendanceRecord = {
      id: `att-${Date.now()}`,
      employeeId: employee.id,
      date: now.toISOString(),
      checkIn: now.toLocaleTimeString(),
      checkOut: null,
      status: now.getHours() >= 9 ? 'late' : 'present'
    };

    storage.addAttendance(record);
    setTodayAttendance(record);
    onToast('Checked in successfully', 'success');
  };

  const handleCheckOut = () => {
    if (todayAttendance) {
      const now = new Date();
      const updatedRecord: AttendanceRecord = {
        ...todayAttendance,
        checkOut: now.toLocaleTimeString()
      };

      storage.updateAttendance(updatedRecord);
      setTodayAttendance(updatedRecord);
      onToast('Checked out successfully', 'success');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-indigo-600">
                Employee Dashboard
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
          <div className="bg-white shadow rounded-lg p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex items-center">
                <Clock className="h-8 w-8 text-indigo-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Current Time</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {currentTime.toLocaleTimeString()}
                  </p>
                </div>
              </div>
              <div className="flex items-center">
                <Calendar className="h-8 w-8 text-indigo-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Today's Date</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {currentTime.toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="flex items-center">
                <History className="h-8 w-8 text-indigo-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Status</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {todayAttendance
                      ? todayAttendance.checkOut
                        ? 'Checked Out'
                        : 'Checked In'
                      : 'Not Checked In'}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-center gap-4">
              <button
                onClick={handleCheckIn}
                disabled={!!todayAttendance}
                className={`px-6 py-3 rounded-md text-white ${
                  todayAttendance
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-green-600 hover:bg-green-700'
                }`}
              >
                Check In
              </button>
              <button
                onClick={handleCheckOut}
                disabled={!todayAttendance || !!todayAttendance.checkOut}
                className={`px-6 py-3 rounded-md text-white ${
                  !todayAttendance || !!todayAttendance.checkOut
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-red-600 hover:bg-red-700'
                }`}
              >
                Check Out
              </button>
            </div>
          </div>

          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">
                Attendance History
              </h2>
            </div>
            <div className="divide-y divide-gray-200">
              {attendanceHistory.map(record => (
                <div key={record.id} className="px-6 py-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {new Date(record.date).toLocaleDateString()}
                      </p>
                      <p className="text-sm text-gray-500">
                        Check In: {record.checkIn}
                      </p>
                      {record.checkOut && (
                        <p className="text-sm text-gray-500">
                          Check Out: {record.checkOut}
                        </p>
                      )}
                    </div>
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
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};