export type ReservationEvent = {
  id: string;
  _id: string;
  reservation_id: number;
  event_type?: string;
  source?: string;
  note?: string;
};