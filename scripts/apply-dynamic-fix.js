#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Function to recursively find all .tsx files in a directory
function findTSXFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      findTSXFiles(filePath, fileList);
    } else if (path.extname(file) === '.tsx') {
      fileList.push(filePath);
    }
  });
  
  return fileList;
}

// Function to check if a file already has the dynamic export
function hasDynamicExport(content) {
  return content.includes('export const dynamic') || content.includes('export const revalidate');
}

// Function to apply the fix to a file
function applyFix(filePath) {
  try {
    // Read the file content
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Skip if already has dynamic export or is a client component
    if (hasDynamicExport(content) || content.includes("'use client'") || content.includes('"use client"')) {
      console.log(`⏭️  Skipping ${filePath} (already has dynamic export or is client component)`);
      return false;
    }
    
    // Check if it's a Next.js page component (has export default async function)
    if (!content.includes('export default async function')) {
      console.log(`⏭️  Skipping ${filePath} (not a server component page)`);
      return false;
    }
    
    // Find the first import statement to insert after
    const importMatch = content.match(/^(import\s+[^;]+?;\s*)+/s);
    if (!importMatch) {
      console.log(`⏭️  Skipping ${filePath} (no import statements found)`);
      return false;
    }
    
    const insertPosition = importMatch.index + importMatch[0].length;
    
    // Create the fix content
    const fixContent = `\n\n// ✅ FIX: Force dynamic rendering to prevent build-time evaluation\nexport const dynamic = 'force-dynamic';`;
    
    // Insert the fix
    const newContent = content.slice(0, insertPosition) + fixContent + content.slice(insertPosition);
    
    // Write the file back
    fs.writeFileSync(filePath, newContent, 'utf8');
    
    console.log(`✅ Fixed ${filePath}`);
    return true;
  } catch (error) {
    console.error(`❌ Error fixing ${filePath}:`, error.message);
    return false;
  }
}

// Main function
function main() {
  const targetDir = path.join(__dirname, '..', 'app', 'exhibition-stands');
  
  if (!fs.existsSync(targetDir)) {
    console.error(`❌ Directory not found: ${targetDir}`);
    process.exit(1);
  }
  
  console.log(`🔍 Searching for .tsx files in ${targetDir}...`);
  
  const tsxFiles = findTSXFiles(targetDir);
  console.log(`📁 Found ${tsxFiles.length} .tsx files`);
  
  let fixedCount = 0;
  
  tsxFiles.forEach(filePath => {
    if (applyFix(filePath)) {
      fixedCount++;
    }
  });
  
  console.log(`\n🎉 Done! Fixed ${fixedCount} files.`);
}

// Run the script
main();