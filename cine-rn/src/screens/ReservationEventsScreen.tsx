import { useEffect, useMemo, useState } from "react";
import { View, Text, TextInput, Pressable, FlatList, StyleSheet } from "react-native";
import { Picker } from "@react-native-picker/picker";

import { listReservationsApi } from "../api/reservations.api";
import { listMovieCatalogsApi } from "../api/movieCatalog.api";
import { listReservationEventsApi, createReservationEventApi, deleteReservationEventApi } from "../api/reservationEvents.api";

import type { Reservation } from "../types/reservation";
import type { MovieCatalog } from "../types/movieCatalog";
import type { ReservationEvent } from "../types/reservationEvents";
import { toArray } from "../types/drf";


function MovieCatalogLabel(st: MovieCatalog): string {
  return st.movie_title;
}

function parseOptionalNumber(input: string): { value?: number; error?: string } {
  const trimmed = input.trim();
  if (!trimmed) return { value: undefined };
  const parsed = Number(trimmed);
  if (Number.isNaN(parsed)) return { error: "Cost debe ser numérico" };
  return { value: parsed };
}

export default function ReservationEventsScreen() {
  const [services, setServices] = useState<ReservationEvent[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [movieCatalogs, setMovieCatalogs] = useState<MovieCatalog[]>([]);

  const [selectedReservationId, setSelectedReservationId] = useState<number | null>(null);
  const [selectedMovieCatalogId, setSelectedMovieCatalogId] = useState<string>("");

  const [note, setNote] = useState("");
  const [source, setSource] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const ReservationById = useMemo(() => {
    const map = new Map<number, Reservation>();
    reservations.forEach((v) => map.set(v.id, v));
    return map;
  }, [reservations]);

  const MovieCatalogById = useMemo(() => {
    const map = new Map<string, MovieCatalog>();
    movieCatalogs.forEach((s) => map.set(s.id, s));
    return map;
  }, [movieCatalogs]);

  const loadAll = async (): Promise<void> => {
    try {
      setErrorMessage("");

      const [servicesData, ReservationsData, MovieCatalogsData] = await Promise.all([
        listReservationEventsApi(),
        listReservationsApi(),
        listMovieCatalogsApi(),
      ]);

      const servicesList = toArray(servicesData);
      const ReservationsList = toArray(ReservationsData);
      const MovieCatalogsList = toArray(MovieCatalogsData);

      setServices(servicesList);
      setReservations(ReservationsList);
      setMovieCatalogs(MovieCatalogsList);

      if (selectedReservationId === null && ReservationsList.length) setSelectedReservationId(ReservationsList[0].id);
      if (!selectedMovieCatalogId && MovieCatalogsList.length) setSelectedMovieCatalogId(MovieCatalogsList[0].id);
    } catch {
      setErrorMessage("No se pudo cargar info. ¿Token? ¿baseURL? ¿backend encendido?");
    }
  };

  useEffect(() => { loadAll(); }, []);

  const createService = async (): Promise<void> => {
    try {
      setErrorMessage("");

      if (selectedReservationId === null) return setErrorMessage("Seleccione un vehículo");
      if (!selectedMovieCatalogId) return setErrorMessage("Seleccione un tipo de servicio");

      const trimmednote = note.trim() ? note.trim() : undefined;
      const trimmedsource = source.trim() ? source.trim() : undefined;

      // NO enviar fecha, backend la toma actual
      const created = await createReservationEventApi({
          reservation_id: selectedReservationId,
          event_type: selectedMovieCatalogId,
          note: trimmednote,
          source: trimmedsource,
          _id: ""
      });

      setServices((prev) => [created, ...prev]);
      setNote("");
      setSource("");
    } catch {
      setErrorMessage("No se pudo crear vehicle service");
    }
  };

  const removeService = async (id: string): Promise<void> => {
    try {
      setErrorMessage("");
      await deleteReservationEventApi(id);
      setServices((prev) => prev.filter((s) => s.id !== id));
    } catch {
      setErrorMessage("No se pudo eliminar vehicle service");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Reservation Events</Text>
      {!!errorMessage && <Text style={styles.error}>{errorMessage}</Text>}

      <Text style={styles.label}>Reservation</Text>
      <View style={styles.pickerWrap}>
        <Picker
          selectedValue={selectedReservationId ?? ""}
          onValueChange={(value) => setSelectedReservationId(Number(value))}
          dropdownIconColor="#58a6ff"
          style={styles.picker}
        >
          {reservations.map((v) => (
            <Picker.Item key={v.id} label={v.customer_name} value={v.id} />
          ))}
        </Picker>
      </View>

      <Text style={styles.label}>Tipo de servicio</Text>
      <View style={styles.pickerWrap}>
        <Picker
          selectedValue={selectedMovieCatalogId}
          onValueChange={(value) => setSelectedMovieCatalogId(String(value))}
          dropdownIconColor="#58a6ff"
          style={styles.picker}
        >
          {movieCatalogs.map((st) => (
            <Picker.Item key={st.id} label={MovieCatalogLabel(st)} value={st.id} />
          ))}
        </Picker>
      </View>

      <Text style={styles.label}>Notas (opcional)</Text>
      <TextInput
        placeholder="Notas"
        placeholderTextColor="#8b949e"
        value={note}
        onChangeText={setNote}
        style={styles.input}
      />

      <Text style={styles.label}>Source (opcional)</Text>
      <TextInput
        placeholder="SYSTEM"
        placeholderTextColor="#8b949e"
        value={source}
        onChangeText={setSource}
        keyboardType="numeric"
        style={styles.input}
      />

      <Pressable onPress={createService} style={[styles.btn, { marginBottom: 12 }]}>
        <Text style={styles.btnText}>Crear (sin enviar fecha)</Text>
      </Pressable>

      <Pressable onPress={loadAll} style={[styles.btn, { marginBottom: 12 }]}>
        <Text style={styles.btnText}>Refrescar</Text>
      </Pressable>

      <FlatList
        data={services}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          const v = ReservationById.get(item.reservation_id);
          const st = MovieCatalogById.get(item._id);

          const line1 = v ? v.customer_name : `Reservation_id: ${item.reservation_id}`;
          const line2 = st ? st.movie_title : `movie_catalog_id: ${item._id}`;

          const extras: string[] = [];
          if (item.source) extras.push(`Source: ${item.source}`);
          if (item.note) extras.push(`Notas: ${item.note}`);

          return (
            <View style={styles.row}>
              <View style={{ flex: 1, marginRight: 10 }}>
                <Text style={styles.rowText} numberOfLines={1}>{line1}</Text>
                <Text style={styles.rowSub} numberOfLines={1}>{line2}</Text>
                {extras.map((t, idx) => (
                  <Text key={idx} style={styles.rowSub} numberOfLines={1}>{t}</Text>
                ))}
              </View>

              <Pressable onPress={() => removeService(item.id)}>
                <Text style={styles.del}>Eliminar</Text>
              </Pressable>
            </View>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0d1117", padding: 16 },
  title: { color: "#58a6ff", fontSize: 22, fontWeight: "800", marginBottom: 10 },
  error: { color: "#ff7b72", marginBottom: 10 },
  label: { color: "#8b949e", marginBottom: 6, marginTop: 6 },

  pickerWrap: {
    backgroundColor: "#161b22",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#30363d",
    marginBottom: 10,
    overflow: "hidden",
  },
  picker: { color: "#c9d1d9" },

  input: {
    backgroundColor: "#161b22",
    color: "#c9d1d9",
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#30363d",
  },

  btn: { backgroundColor: "#21262d", borderColor: "#58a6ff", borderWidth: 1, padding: 12, borderRadius: 8 },
  btnText: { color: "#58a6ff", textAlign: "center", fontWeight: "700" },

  row: {
    backgroundColor: "#161b22",
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#30363d",
  },
  rowText: { color: "#c9d1d9", fontWeight: "800" },
  rowSub: { color: "#8b949e", marginTop: 2 },
  del: { color: "#ff7b72", fontWeight: "800" },
});