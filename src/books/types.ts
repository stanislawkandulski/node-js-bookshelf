export interface Book {
  id: number;
  title: string;
  author: string;
  pages: number;
  year: number;
  read: boolean;
  rating: number | null;
}
