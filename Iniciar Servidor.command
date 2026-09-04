#!/bin/bash
# ============================================
# PMI App — Iniciar servidor local
# ============================================
DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$DIR"

echo "============================================"
echo "  PMI App — Servidor local"
echo "  Abre http://localhost:8000 en tu navegador"
echo "============================================"
echo ""

php -S localhost:8000 backend/index.php

echo ""
echo "Servidor detenido."
read -p "Presiona Enter para cerrar..."
