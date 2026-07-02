export interface Category {
  id: string;
  name: string;
  note?: string | null;
  icon?: string | null;
  color?: string | null;
  userId?: string | null;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}
