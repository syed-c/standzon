import os
import re

def process_file(filepath):
    with open(filepath, 'r') as f:
        content = f.read()
        
    original = content

    # Remove layout imports
    imports_to_remove = [
        r"import\s+AdminLayout\s+from[^;]+;\n?",
        r"import\s+SuperAdminLayout\s+from[^;]+;\n?",
        r"import\s+Navigation\s+from[^;]+;\n?",
        r"import\s+Footer\s+from[^;]+;\n?",
        r"import\s+Sidebar\s+from[^;]+;\n?",
        r"import\s+Topbar\s+from[^;]+;\n?"
    ]
    for imp in imports_to_remove:
        content = re.sub(imp, '', content)

    # Remove <Navigation ... />
    content = re.sub(r'<Navigation\b[^>]*/>', '', content)
    # Remove <Footer ... />
    content = re.sub(r'<Footer\b[^>]*/>', '', content)
    # Remove <Sidebar ... />
    content = re.sub(r'<Sidebar\b[^>]*/>', '', content)
    # Remove <Topbar ... />
    content = re.sub(r'<Topbar\b[^>]*/>', '', content)

    # Replace wrappers
    content = re.sub(r'<SuperAdminLayout\b[^>]*>', '<>', content)
    content = re.sub(r'</SuperAdminLayout>', '</>', content)
    content = re.sub(r'<AdminLayout\b[^>]*>', '<>', content)
    content = re.sub(r'</AdminLayout>', '</>', content)

    if content != original:
        with open(filepath, 'w') as f:
            f.write(content)
        print(f"Updated {filepath}")

for root, dirs, files in os.walk('app/admin'):
    for file in files:
        if file.endswith('.tsx'):
            process_file(os.path.join(root, file))
