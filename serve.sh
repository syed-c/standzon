#!/bin/bash
cd public
python3 -m http.server 3000 2>/dev/null || python -m http.server 3000 2>/dev/null