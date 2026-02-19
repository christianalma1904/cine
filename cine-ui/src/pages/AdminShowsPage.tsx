import { useEffect, useState } from "react";
import {
  Container, Paper, Typography, TextField, Button, Stack,
  Table, TableHead, TableRow, TableCell, TableBody, IconButton, Alert
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

import { type Show, listShowsApi, createShowApi, updateShowApi, deleteShowApi } from "../api/shows.api";

export default function AdminShowsPage() {
  const [items, setItems] = useState<Show[]>([]);
  const [movie_title, setMovieTitle] = useState("");
  const [room, setRoom] = useState("");
  const [price, setPrice] = useState<number>(0);
  const [available_seats, setAvailableSeats] = useState<number>(0);
  const [editId, setEditId] = useState<number | null>(null);
  const [error, setError] = useState("");

  const load = async () => {
    try {
      setError("");
      const data = await listShowsApi();
      setItems(data.results); // DRF paginado
    } catch {
      setError("No se pudo cargar Shows. ¿Login? ¿Token admin?");
    }
  };

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { load(); }, []);

  const save = async () => {
    try {
      setError("");
      if (!movie_title.trim()) return setError("movie_title requerido");

      if (editId) await updateShowApi(editId, movie_title.trim(), room, price, available_seats);
      else await createShowApi(movie_title.trim(), room, price, available_seats);

      setMovieTitle("");
      setRoom("")
      setPrice(0)
      setAvailableSeats(0)
      setEditId(null);
      await load();
    } catch {
      setError("No se pudo guardar Show. ¿Token admin?");
    }
  };

  const startEdit = (m: Show) => {
    setEditId(m.id);
    setMovieTitle(m.movie_title);
    setRoom(m.room)
    setPrice(m.price)
    setAvailableSeats(m.available_seats)
  };

  const remove = async (id: number) => {
    try {
      setError("");
      await deleteShowApi(id);
      await load();
    } catch {
      setError("No se pudo eliminar Show. ¿Vehículos asociados? ¿Token admin?");
    }
  };

  return (
    <Container sx={{ mt: 3 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" sx={{ mb: 2 }}>Admin Shows (Privado)</Typography>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ mb: 2 }}>
          <TextField label="movie_title Show" value={movie_title} onChange={(e) => setMovieTitle(e.target.value)} />
          <TextField label="room" value={room} onChange={(e) => setRoom(e.target.value)} />
          <TextField label="price" value={price} onChange={(e) => setPrice(Number(e.target.value))} />
          <TextField label="available_seats" value={available_seats} onChange={(e) => setAvailableSeats(Number(e.target.value))} />
          <Button variant="contained" onClick={save}>{editId ? "Actualizar" : "Crear"}</Button>
          <Button variant="outlined" onClick={() => { setMovieTitle(""); setEditId(null); }}>Limpiar</Button>
          <Button variant="outlined" onClick={load}>Refrescar</Button>
        </Stack>

        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>movie_title</TableCell>
              <TableCell>room</TableCell>
              <TableCell>price</TableCell>
              <TableCell>available_seats</TableCell>
              <TableCell align="right">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map((m) => (
              <TableRow key={m.id}>
                <TableCell>{m.id}</TableCell>
                <TableCell>{m.movie_title}</TableCell>
                <TableCell>{m.room}</TableCell>
                <TableCell>{m.price}</TableCell>
                <TableCell>{m.available_seats}</TableCell>
                <TableCell align="right">
                  <IconButton onClick={() => startEdit(m)}><EditIcon /></IconButton>
                  <IconButton onClick={() => remove(m.id)}><DeleteIcon /></IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Container>
  );
}