# Script to fix syntax errors in EnhancedLocationPage.tsx

file_path = r'd:\Projects\standzon\components\EnhancedLocationPage.tsx'

# Read the file
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Fix the first syntax error - missing closing parentheses
content = content.replace(
    'console.log(\'🔍 DEBUG: First builders in EnhancedLocationPage:\', \n      finalBuilders.slice(0, 3).map((b: any) => ({\n        id: b.id,\n        companyName: b.companyName,\n        headquarters: b.headquarters,\n        serviceLocations: b.serviceLocations\n      });\n  }',
    'console.log(\'🔍 DEBUG: First builders in EnhancedLocationPage:\', \n      finalBuilders.slice(0, 3).map((b: any) => ({\n        id: b.id,\n        companyName: b.companyName,\n        headquarters: b.headquarters,\n        serviceLocations: b.serviceLocations\n      }))\n    );\n  }'
)

# Fix the second syntax error - missing closing parenthesis in pickPreferred function
content = content.replace(
    'const pickPreferred = (a: any, b: any) => {\n      if ((a.verified ? 1 : 0) !== (b.verified ? 1 : 0) return (a.verified ? -1 : 1);',
    'const pickPreferred = (a: any, b: any) => {\n      if ((a.verified ? 1 : 0) !== (b.verified ? 1 : 0)) return (a.verified ? -1 : 1);'
)

# Fix the third syntax error - missing closing parenthesis in if condition
content = content.replace(
    'if (!map.has(key) {',
    'if (!map.has(key)) {'
)

# Fix the fourth syntax error - missing closing parenthesis in Array.from
content = content.replace(
    'let sorted = Array.from(map.values();',
    'let sorted = Array.from(map.values());'
)

# Fix the fifth syntax error - missing closing parenthesis in sort functions
content = content.replace(
    'sorted.sort((a, b) => (b.rating || 4.5) - (a.rating || 4.5);',
    'sorted.sort((a, b) => (b.rating || 4.5) - (a.rating || 4.5));'
)

content = content.replace(
    'sorted.sort((a, b) => (b.projectsCompleted || 25) - (a.projectsCompleted || 25);',
    'sorted.sort((a, b) => (b.projectsCompleted || 25) - (a.projectsCompleted || 25));'
)

content = content.replace(
    'sorted.sort((a, b) => (a.priceRange?.basicStand?.min || 300) - (b.priceRange?.basicStand?.min || 300);',
    'sorted.sort((a, b) => (a.priceRange?.basicStand?.min || 300) - (b.priceRange?.basicStand?.min || 300));'
)

# Write the file back
with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)

print("Syntax errors fixed successfully!")