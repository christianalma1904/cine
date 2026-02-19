# CÓDIGOS MONGODB - EVIDENCIAS

##  CAPTURA 9 – Creación y Selección de Base de Datos

```javascript
show dbs
use cine_db
db
show dbs
```

---

##  CAPTURA 10 – Creación de Usuario

```javascript
db.createUser({
  user: "cine_mongo_user",
  pwd: "admin123",
  roles: [
    { role: "readWrite", db: "cine_db" },
    { role: "dbAdmin", db: "cine_db" },
  ],
});

db.getUsers();
```

---

##  CAPTURA 11 – Creación o Verificación de Colecciones

```javascript
show collections

// Insertar varios documentos con diferentes fechas
db.reservation_events.insertMany([
  {
    reservation_id: 1,
    event_type: "Created",
    source: "Web",
    note: "Reservación creada hace 10 días",
    created_at: new Date(new Date().setDate(new Date().getDate() - 10))
  },
  {
    reservation_id: 1,
    event_type: "Confirmed",
    source: "System",
    note: "Reservación confirmada hace 5 días",
    created_at: new Date(new Date().setDate(new Date().getDate() - 5))
  },
  {
    reservation_id: 2,
    event_type: "Created",
    source: "Mobile",
    note: "Reservación creada hoy",
    created_at: new Date()
  }
])

show collections

db.reservation_events.find()
```

---

##  CAPTURA 12 – Creación de Índice

```javascript
db.reservation_events.createIndex({ reservation_id: 1 });

db.reservation_events.getIndexes();
```

---

##  CAPTURA 13 – Consulta por Identificador

```javascript
db.reservation_events.find({ reservation_id: 1 });
```

---

##  CAPTURA 14 – Consulta por Rango de Fechas

```javascript
db.reservation_events.find({
  created_at: { $gte: ISODate("2026-02-08") },
});
```
