// Interfaces para el usuario y datos de usuario
export interface User {
  uid: string;
  displayName?: string | null;
  email?: string | null;
  photoURL?: string | null;
}

export interface UserData {
  displayName?: string;
  email?: string;
  edad?: number;
  peso?: number;
  altura?: number;
  objetivo?: string;
}
