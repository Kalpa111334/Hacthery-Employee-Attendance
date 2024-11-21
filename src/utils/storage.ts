import { Employee, AttendanceRecord, Leave } from '../types';

// Initialize default admin if not exists
const initializeAdmin = () => {
  const employees = localStorage.getItem('employees');
  if (!employees) {
    const admin: Employee = {
      id: 'admin-1',
      name: 'Admin',
      email: 'admin@divron.com',
      role: 'admin',
      department: 'Management',
      joinDate: new Date().toISOString(),
      password: 'admin123' // In production, use proper password hashing
    };
    localStorage.setItem('employees', JSON.stringify([admin]));
  }
};

export const storage = {
  getEmployees: (): Employee[] => {
    initializeAdmin();
    return JSON.parse(localStorage.getItem('employees') || '[]');
  },

  addEmployee: (employee: Employee) => {
    const employees = storage.getEmployees();
    employees.push(employee);
    localStorage.setItem('employees', JSON.stringify(employees));
  },

  removeEmployee: (id: string) => {
    const employees = storage.getEmployees().filter(emp => emp.id !== id);
    localStorage.setItem('employees', JSON.stringify(employees));
  },

  getAttendance: (): AttendanceRecord[] => {
    return JSON.parse(localStorage.getItem('attendance') || '[]');
  },

  addAttendance: (record: AttendanceRecord) => {
    const attendance = storage.getAttendance();
    attendance.push(record);
    localStorage.setItem('attendance', JSON.stringify(attendance));
  },

  updateAttendance: (record: AttendanceRecord) => {
    const attendance = storage.getAttendance();
    const index = attendance.findIndex(a => a.id === record.id);
    if (index !== -1) {
      attendance[index] = record;
      localStorage.setItem('attendance', JSON.stringify(attendance));
    }
  },

  getLeaves: (): Leave[] => {
    return JSON.parse(localStorage.getItem('leaves') || '[]');
  },

  addLeave: (leave: Leave) => {
    const leaves = storage.getLeaves();
    leaves.push(leave);
    localStorage.setItem('leaves', JSON.stringify(leaves));
  },

  updateLeave: (leave: Leave) => {
    const leaves = storage.getLeaves();
    const index = leaves.findIndex(l => l.id === leave.id);
    if (index !== -1) {
      leaves[index] = leave;
      localStorage.setItem('leaves', JSON.stringify(leaves));
    }
  }
};