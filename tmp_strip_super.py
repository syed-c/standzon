import os
import re

def process_file(filepath):
    with open(filepath, 'r') as f:
        content = f.read()
        
    original = content

    content = re.sub(r"import\s+SuperAdminLayout\s+from[^;]+;\n?", '', content)
    content = re.sub(r'<SuperAdminLayout[^>]*>', '<>', content)
    content = re.sub(r'</SuperAdminLayout>', '</>', content)

    if content != original:
        with open(filepath, 'w') as f:
            f.write(content)
        print(f"Updated {filepath}")

for root, dirs, files in os.walk('app/admin'):
    for file in files:
        if file.endswith('.tsx') and file != 'layout.tsx':
            process_file(os.path.join(root, file))
