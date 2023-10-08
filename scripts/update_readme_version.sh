#!/bin/bash

# Obtener la última versión del release de GitHub
VERSION=$(curl -s "https://api.github.com/repos/vinjatovix/ts-api/releases/latest" | grep -o '"tag_name": "[^"]*' | grep -o '[^"]*$')

# Reemplazar la versión en el README.md
sed -i "s/Version-[0-9]\+\.[0-9]\+\.[0-9]\+/Version-$VERSION/" README.md
