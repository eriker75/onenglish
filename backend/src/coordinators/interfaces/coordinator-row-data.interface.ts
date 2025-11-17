// Coordinator row structure for CSV/Excel import
export interface CoordinatorRowData {
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

