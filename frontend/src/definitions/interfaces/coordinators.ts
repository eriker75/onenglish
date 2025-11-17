export interface Coordinator {
  id: number;
  fullName: string;
  email: string;
  phone: string;
  birthDate: string;
  school: string;
  schoolType: "bilingual" | "regular";
  role: "teacher" | "coordinator";
}
