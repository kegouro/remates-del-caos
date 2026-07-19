@echo off
rem Remates del Caos - Lanzador para Windows
rem No usar emojis

cd /d "%~dp0"
cls
echo ======================================================================
echo                       ^◈ Remates del Caos ^◈
echo             Lanzador de Subastas e Inutilidad Clandestina
echo ======================================================================
echo.

where python >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Python no se encuentra instalado en tu sistema o no esta en el PATH.
    echo Por favor descarga e instala Python 3 desde https://www.python.org/
    echo Asegurate de marcar la opcion "Add Python to PATH" durante la instalacion.
    echo.
    pause
    exit /b 1
)

if not exist .venv (
    echo [INFO] Creando entorno virtual local de Python...
    python -m venv .venv
    if errorlevel 1 (
        echo [ERROR] No se pudo crear el entorno virtual.
        pause
        exit /b 1
    )
)

call .venv\Scripts\activate.bat

if not exist .venv\.dependencies_installed (
    echo [INFO] Instalando librerias necesarias (esto puede tardar unos minutos)...
    python -m pip install --upgrade pip
    pip install -r requirements.txt
    if errorlevel 0 (
        type nul > .venv\.dependencies_installed
        echo [INFO] Librerias instaladas con exito.
    ) else (
        echo [ERROR] Ocurrio un problema al instalar las dependencias.
        pause
        exit /b 1
    )
)

echo [INFO] Iniciando la subasta del caos en tu navegador...
streamlit run app.py
