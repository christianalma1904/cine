import { http } from "./http";
import type { ReservationEvent } from "../types/reservationEvents";
import type { Paginated } from "../types/drf";

export type ReservationEventCreatePayload = {
  _id: string;
  reservation_id: number;
  event_type?: string;
  source?: string;
  note?: string;
};

export async function listReservationEventsApi(): Promise<Paginated<ReservationEvent> | ReservationEvent[]> {
  const { data } = await http.get<Paginated<ReservationEvent> | ReservationEvent[]>("/api/reservation-events/");
  return data;
}

export async function createReservationEventApi(payload: ReservationEventCreatePayload): Promise<ReservationEvent> {
  const { data } = await http.post<ReservationEvent>("/api/reservation-events/", payload);
  return data;
}

export async function deleteReservationEventApi(id: string): Promise<void> {
  await http.delete(`/api/reservation-events/${id}/`);
}