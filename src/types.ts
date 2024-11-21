export interface Employee {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'employee';
  department: string;
  joinDate: string;
  password: string;
}

export interface AttendanceRecord {
  id: string;
  employeeId: string;
  date: string;
  checkIn: string;
  checkOut: string | null;
  status: 'present' | 'late' | 'absent';
}

export interface Leave {
  id: string;
  employeeId: string;
  startDate: string;
  endDate: string;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  type: 'sick' | 'vacation' | 'personal';
}