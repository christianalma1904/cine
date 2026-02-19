import { http } from "./http";
import type { Paginated } from "../types/drf";
import type { Reservation } from "../types/reservation";

export async function listReservationsApi(): Promise<Paginated<Reservation> | Reservation[]> {
  const { data } = await http.get<Paginated<Reservation> | Reservation[]>("/api/reservations/");
  return data;
}