#!/usr/bin/env node

// Migration script to transform Sanity types from snake_case to PascalCase

const fs = require('fs');
const path = require('path');

const typesFilePath = path.join(__dirname, '../sanity/types.ts');

function toPascalCase(str) {
  return str
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join('');
}

function transformTypes() {
  if (!fs.existsSync(typesFilePath)) {
    console.error('File types.ts non trovato');
    return;
  }

  let content = fs.readFileSync(typesFilePath, 'utf8');

  // Trasforma i nomi dei tipi
  const typeTransforms = {
    'Static_page': 'StaticPage',
    'Attivita_commerciale': 'AttivitaCommerciale'
  };

  Object.entries(typeTransforms).forEach(([oldName, newName]) => {
    // Trasforma export type
    content = content.replace(
      new RegExp(`export type ${oldName}`, 'g'),
      `export type ${newName}`
    );
    
    // Trasforma referenze nel tipo union
    content = content.replace(
      new RegExp(`\\b${oldName}\\b`, 'g'),
      newName
    );
  });

  fs.writeFileSync(typesFilePath, content, 'utf8');
  console.log('✅ Tipi trasformati in PascalCase');
}

transformTypes();
