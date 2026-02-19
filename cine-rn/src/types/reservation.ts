export type Reservation = {
  id: number;
  show: number;
  show_movie_title?: string;
  customer_name: string;
  seats: number;
  status: string;
  created_at?: string;
};