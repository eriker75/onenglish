// Teacher row structure for CSV/Excel import
export interface TeacherRowData {
  firstName: string;
  lastName: string;
  email: string;
  username?: string;
  password?: string;
  phone?: string;
  avatar?: string;
  bio?: string;
  schoolId: string;
  isActive?: boolean;
}

