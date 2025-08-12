// Tipo de rutina para TypeScript. Define la estructura de una rutina en la app.
export interface Routine {
  id?: string;
  name: string;
  description: string;
  exercises: string[];
  days: string[];
  userId: string;
}
