import { useEffect, useState } from "react";
import { View, Text, TextInput, Pressable, FlatList, StyleSheet } from "react-native";

import { listMovieCatalogsApi, createMovieCatalogApi, deleteMovieCatalogApi } from "../api/movieCatalog.api";
import type { MovieCatalog } from "../types/movieCatalog";
import { toArray } from "../types/drf";

function normalizeText(input: string): string {
  return input.trim();
}

export default function MovieCatalogScreen() {
  const [items, setItems] = useState<MovieCatalog[]>([]);
  const [movie_title, setMovieTitle] = useState("");
  const [genre, setGenre] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const load = async (): Promise<void> => {
    try {
      setErrorMessage("");
      const data = await listMovieCatalogsApi();
      setItems(toArray(data));
    } catch {
      setErrorMessage("No se pudo cargar service types. ¿Login? ¿Token?");
    }
  };

  useEffect(() => { load(); }, []);

  const createItem = async (): Promise<void> => {
    try {
      setErrorMessage("");

      const cleanmovie_title = normalizeText(movie_title);
      if (!cleanmovie_title) return setErrorMessage("movie_title es requerido");

      const created = await createMovieCatalogApi({
        movie_title: cleanmovie_title,
        genre: normalizeText(genre) || undefined,
      });

      setItems((prev) => [created, ...prev]);
      setMovieTitle("");
      setGenre("");
    } catch {
      setErrorMessage("No se pudo crear service type.");
    }
  };

  const removeItem = async (id: string): Promise<void> => {
    try {
      setErrorMessage("");
      await deleteMovieCatalogApi(id);
      setItems((prev) => prev.filter((it) => it.id !== id));
    } catch {
      setErrorMessage("No se pudo eliminar service type.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Movie Catalog</Text>
      {!!errorMessage && <Text style={styles.error}>{errorMessage}</Text>}

      <Text style={styles.label}>Movie Title</Text>
      <TextInput
        value={movie_title}
        onChangeText={setMovieTitle}
        placeholder="Avatar"
        placeholderTextColor="#8b949e"
        style={styles.input}
      />

      <Text style={styles.label}>Genre (opcional)</Text>
      <TextInput
        value={genre}
        onChangeText={setGenre}
        placeholder="Science Fiction"
        placeholderTextColor="#8b949e"
        style={styles.input}
      />

      <Pressable onPress={createItem} style={styles.btn}>
        <Text style={styles.btnText}>Crear</Text>
      </Pressable>

      <Pressable onPress={load} style={[styles.btn, { marginBottom: 12 }]}>
        <Text style={styles.btnText}>Refrescar</Text>
      </Pressable>

      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <View style={{ flex: 1, marginRight: 10 }}>
              <Text style={styles.rowText} numberOfLines={1}>{item.movie_title}</Text>
              {!!item.genre && <Text style={styles.rowSub} numberOfLines={1}>{item.genre}</Text>}
            </View>

            <Pressable onPress={() => removeItem(item.id)}>
              <Text style={styles.del}>Eliminar</Text>
            </Pressable>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0d1117", padding: 16 },
  title: { color: "#58a6ff", fontSize: 22, fontWeight: "800", marginBottom: 10 },
  error: { color: "#ff7b72", marginBottom: 10 },
  label: { color: "#8b949e", marginBottom: 6, marginTop: 6 },
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
  del: { color: "#ff7b72", fontWeight: "700" },
});