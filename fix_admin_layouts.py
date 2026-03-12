import os
import re

def insert_layout(filepath):
    with open(filepath, 'r') as f:
        content = f.read()

    original = content
    
    # We only want to wrap the returned JSX of the default export
    # This is a bit tricky with regex, but usually it looks like `return (...)` at the end
    
    # Check if AdminLayoutWrapper is already imported
    if 'AdminLayoutWrapper' not in content:
        # Add import after other imports
        content = re.sub(r'(import .*;\n)+', r'\g<0>import AdminLayoutWrapper from \'@/components/admin/AdminLayoutWrapper\';\n', content, count=1)
        
    # We'll use a safer approach - just let Next.js use the layout.tsx we created
    # The layout.tsx automatically wraps all pages in the directory!
    # Wait, the problem is Next.js app router layout.tsx WRAPS the page.tsx 
    # But earlier I modified page.tsx to strip `<SuperAdminLayout>` and didn't realize 
    # the page content might not be styled correctly without the wrapper INSIDE the page
    # if it relies on specific classes.
    
    pass

# We don't need to run this script because we already added app/admin/layout.tsx
# which uses AdminLayoutWrapper (which uses SuperAdminLayout + Topbar).
# The issue the browser agent saw was a Next.js "Something went wrong!" error (crash).

