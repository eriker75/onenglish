type SchoolType = "Bilingüe" | "Regular";

export interface School {
  id: number;
  name: string;
  type: SchoolType;
}

export const schools: School[] = [
  { id: 1, name: "School Bolivariano Andrés Bello", type: "Bilingüe" },
  { id: 2, name: "U.E. Juan XXIII", type: "Regular" },
  { id: 3, name: "Colegio Emmanuel", type: "Bilingüe" },
];
