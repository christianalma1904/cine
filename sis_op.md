#!/bin/bash

# ====================================================
# SCRIPT DE AUTOMATIZACIÓN - EXAMEN CINE
# ====================================================

echo "1. Creando estructura del proyecto..."
cd ~
mkdir -p examen/cine/backend examen/cine/frontend examen/cine/movil examen/cine/docs
tree examen

echo -e "\n2. Navegando y verificando ubicación..."
cd ~/examen/cine
pwd
ls -la

echo -e "\n3. Creando archivos de evidencia y registrando fecha..."
touch docs/cine_comandos.txt docs/evidencia.txt
date >> docs/evidencia.txt
cat docs/evidencia.txt

echo -e "\n4. Redireccionando salida (who y ls -la)..."
who > docs/salida_who.txt
ls -la >> docs/salida_who.txt
echo "Contenido de salida_who.txt:"
cat docs/salida_who.txt

echo -e "\n5. Creando contenido de cine_comandos.txt y buscando 'reservations'..."
cat << EOF > docs/cine_comandos.txt
# Sistema Cine - Backend
GET /api/movies/
GET /api/reservations/
POST /api/reservations/
DELETE /api/reservations/20/
INFO: reservation created successfully
INFO: reservations service running
WARN: reservations timeout detected
EOF

grep -n "reservations" docs/cine_comandos.txt

echo -e "\n6. Creando README en frontend y localizándolo..."
touch frontend/README.md
find . -name "README.md"

echo -e "\n7. Copiando y moviendo respaldo de evidencia..."
cp docs/evidencia.txt docs/evidencia_bak.txt
mv docs/evidencia_bak.txt backend/
ls -la backend/

echo -e "\n8. Configurando carpeta compartida con Sticky Bit..."
mkdir shared_cine
chmod 1777 shared_cine
ls -ld shared_cine

echo -e "\n===================================================="
echo "¡Proceso completado con éxito!"
echo "===================================================="
