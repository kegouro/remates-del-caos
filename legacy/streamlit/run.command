#!/bin/bash
# Remates del Caos - Lanzador para macOS y Linux
# No usar emojis

cd "$(dirname "$0")"
clear
echo "======================================================================"
echo "                      ◈ Remates del Caos ◈                            "
echo "            Lanzador de Subastas e Inutilidad Clandestina             "
echo "======================================================================"
echo ""

# Verificar si Python 3 esta instalado
if ! command -v python3 &> /dev/null; then
    echo "[ERROR] Python 3 no se encuentra instalado en tu sistema."
    echo "Por favor descarga e instala Python 3 desde https://www.python.org/"
    echo "Presiona cualquier tecla para salir..."
    read -n 1 -s
    exit 1
fi

# Crear entorno virtual local si no existe
if [ ! -d ".venv" ]; then
    echo "[INFO] Creando entorno virtual local de Python..."
    python3 -m venv .venv
    if [ $? -ne 0 ]; then
        echo "[ERROR] No se pudo crear el entorno virtual de Python."
        read -n 1 -s
        exit 1
    fi
fi

# Activar entorno virtual
source .venv/bin/activate

# Instalar dependencias si no se ha hecho antes
if [ ! -f ".venv/.dependencies_installed" ]; then
    echo "[INFO] Instalando librerias necesarias (esto puede tardar unos minutos)..."
    python3 -m pip install --upgrade pip
    pip install -r requirements.txt
    if [ $? -eq 0 ]; then
        touch .venv/.dependencies_installed
        echo "[INFO] Librerias instaladas con exito."
    else
        echo "[ERROR] Ocurrio un problema al instalar las dependencias."
        read -n 1 -s
        exit 1
    fi
fi

echo "[INFO] Iniciando la subasta del caos en tu navegador..."
streamlit run app.py
