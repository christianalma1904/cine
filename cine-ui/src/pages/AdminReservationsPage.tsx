import { useEffect, useState } from "react";
import {
  Container, Paper, Typography, TextField, Button, Stack,
  Table, TableHead, TableRow, TableCell, TableBody, IconButton, Alert,
  FormControl, InputLabel, Select, MenuItem
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

import { type Show, listShowsApi } from "../api/shows.api";
import { type Reservation, listReservationsAdminApi, createReservationApi, updateReservationApi, deleteReservationApi } from "../api/reservations.api";

export default function AdminReservationsPage() {
  const [items, setItems] = useState<Reservation[]>([]);
  const [shows, setShows] = useState<Show[]>([]);
  const [error, setError] = useState("");

  const [editId, setEditId] = useState<number | null>(null);
  const [show, setShow] = useState<number>(0);
  const [customer_name, setCustomerName] = useState("");
  const [seats, setSeats] = useState(0);
  const [status, setStatus] = useState("");
  const [created_at, setCreatedAt] = useState("");

  const load = async () => {
    try {
      setError("");
      const data = await listReservationsAdminApi();
      setItems(data.results); // DRF paginado
    } catch {
      setError("No se pudo cargar reservations. ¿Login? ¿Token admin?");
    }
  };

  const loadShows = async () => {
    try {
      const data = await listShowsApi();
      setShows(data.results); // DRF paginado
      if (!show && data.results.length > 0) setShow(data.results[0].id);
    } catch {
      // si falla, no bloquea la pantalla
    }
  };

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { load(); loadShows(); }, []);

  const save = async () => {
    try {
      setError("");
      if (!show) return setError("Seleccione una Show");
      if (!customer_name.trim() || !status.trim()) return setError("customer_name y status son requeridos");

      const payload = {
        show: Number(show),
        customer_name: customer_name.trim(),
        seats: Number(seats),
        status: status.trim(),
        created_at: created_at.trim()
      };

      if (editId) await updateReservationApi(editId, payload);
      else await createReservationApi(payload);

      setEditId(null);
      setCustomerName("");
      setStatus("");
      setSeats(0)
      setCreatedAt("xxxx-xx-xx")
      await load();
    } catch {
      setError("No se pudo guardar vehículo. ¿Token admin?");
    }
  };

  const startEdit = (v: Reservation) => {
    setEditId(v.id);
    setShow(v.show);
    setCustomerName(v.customer_name);
    setSeats(v.seats);
    setStatus(v.status);
  };

  const remove = async (id: number) => {
    try {
      setError("");
      await deleteReservationApi(id);
      await load();
    } catch {
      setError("No se pudo eliminar vehículo. ¿Token admin?");
    }
  };

  return (
    <Container sx={{ mt: 3 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" sx={{ mb: 2 }}>Admin Reservations (Privado)</Typography>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        <Stack spacing={2} sx={{ mb: 2 }}>
          <Stack direction={{ xs: "column", md: "row" }} spacing={2}>

            <FormControl sx={{ width: 260 }}>
              <InputLabel id="Show-label">Show</InputLabel>
              <Select
                labelId="Show-label"
                label="Show"
                value={show}
                onChange={(e) => setShow(Number(e.target.value))}
              >
                {shows.map((m) => (
                  <MenuItem key={m.id} value={m.id}>
                    {m.movie_title} (#{m.id})
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField label="customer name" value={customer_name} onChange={(e) => setCustomerName(e.target.value)}/>
            <TextField label="seats" value={seats} onChange={(e) => setSeats(Number(e.target.value))} sx={{ width: 160 }} />
              <TextField label="created at" value={created_at} onChange={(e) => setCreatedAt(e.target.value)}/>
          </Stack>

          <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
            <TextField label="status" value={status} onChange={(e) => setStatus(e.target.value)} sx={{ width: 220 }} />

            <Button variant="contained" onClick={save}>{editId ? "Actualizar" : "Crear"}</Button>
            <Button variant="outlined" onClick={() => { setEditId(null); setCustomerName(""); setStatus("") }}>Limpiar</Button>
            <Button variant="outlined" onClick={() => { load(); loadShows(); }}>Refrescar</Button>
          </Stack>
        </Stack>

        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Show</TableCell>
              <TableCell>customer Name</TableCell>
              <TableCell>Seats</TableCell>
              <TableCell>status</TableCell>
              <TableCell align="right">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map((v) => (
              <TableRow key={v.id}>
                <TableCell>{v.id}</TableCell>
                <TableCell>{v.show_movie_title ?? v.show}</TableCell>
                <TableCell>{v.customer_name}</TableCell>
                <TableCell>{v.seats}</TableCell>
                <TableCell>{v.status}</TableCell>
                <TableCell align="right">
                  <IconButton onClick={() => startEdit(v)}><EditIcon /></IconButton>
                  <IconButton onClick={() => remove(v.id)}><DeleteIcon /></IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Container>
  );
}