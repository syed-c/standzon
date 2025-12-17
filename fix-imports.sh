#!/bin/bash

# Find all files that import CountryCityPage with curly braces and fix them
find . -name "*.tsx" -o -name "*.ts" | while read file; do
  if grep -q "import { CountryCityPage }" "$file"; then
    echo "Fixing $file"
    sed -i 's/import { CountryCityPage } from /import CountryCityPage from /' "$file"
  fi
done

echo "All CountryCityPage imports fixed!"