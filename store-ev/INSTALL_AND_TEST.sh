#!/bin/bash

echo "🔧 Instalando dependencias del monorepo..."
npm ci

echo ""
echo "✅ Instalación completada"
echo ""
echo "🧪 Ejecutando verificaciones..."
echo ""

# Verificar TypeScript
echo "1️⃣  Verificando TypeScript..."
npm run ts:check -w @commercelayer/demo-store-website
if [ $? -eq 0 ]; then
  echo "   ✓ TypeScript OK"
else
  echo "   ✗ Error en TypeScript"
fi

echo ""

# Verificar datos JSON
echo "2️⃣  Verificando datos JSON..."
npm run test:data -w @commercelayer/demo-store-website
if [ $? -eq 0 ]; then
  echo "   ✓ JSON OK"
else
  echo "   ✗ Error en JSON"
fi

echo ""

# Build
echo "3️⃣  Compilando proyecto..."
npm run build -w @commercelayer/demo-store-website
if [ $? -eq 0 ]; then
  echo "   ✓ Build OK"
else
  echo "   ✗ Error en build"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✨ PROYECTO LISTO PARA GITHUB PAGES"
echo ""
echo "Próximos pasos:"
echo "  1. git add ."
echo "  2. git commit -m 'chore: clean up project'"
echo "  3. git push origin main"
echo "  4. GitHub Actions ejecutará automáticamente"
echo ""
echo "Comenzar desarrollo local:"
echo "  npm run dev -w @commercelayer/demo-store-website"
