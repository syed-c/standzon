# Script to fix duplicate closing tags in EnhancedLocationPage.tsx

file_path = r'd:\Projects\standzon\components\EnhancedLocationPage.tsx'

# Read the file
with open(file_path, 'r', encoding='utf-8') as f:
    lines = f.readlines()

# Find the line with the comment "Slot for Cities section rendered by parent directly after builders"
target_line_index = None
for i, line in enumerate(lines):
    if 'Slot for Cities section rendered by parent directly after builders' in line:
        target_line_index = i
        break

# If found, clean up the lines before it
if target_line_index is not None and target_line_index >= 2:
    # Check if the previous lines contain duplicate closing tags
    if ('      )}' in lines[target_line_index - 1] and 
        '      )}' in lines[target_line_index - 2]):
        # Remove the duplicate lines
        lines[target_line_index - 1] = ''
        lines[target_line_index - 2] = ''

# Write back the cleaned content
with open(file_path, 'w', encoding='utf-8') as f:
    f.writelines([line for line in lines if line.strip() != ''])

print("Duplicate closing tags fixed successfully!")