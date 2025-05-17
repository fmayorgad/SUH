import * as fs from 'fs';
import * as path from 'path';

// Function to recursively search for controller files
function findControllerFiles(directory: string): string[] {
  const files: string[] = [];
  
  const items = fs.readdirSync(directory);
  
  for (const item of items) {
    const itemPath = path.join(directory, item);
    const stats = fs.statSync(itemPath);
    
    if (stats.isDirectory()) {
      files.push(...findControllerFiles(itemPath));
    } else if (
      stats.isFile() && 
      (item.includes('controller.ts') || item.endsWith('.controller.ts') || 
       item.includes('.get.ts') || item.includes('.post.ts') || 
       item.includes('.put.ts') || item.includes('.patch.ts') || 
       item.includes('.delete.ts'))
    ) {
      files.push(itemPath);
    }
  }
  
  return files;
}

// Function to update a controller file with audit decorators
function updateControllerFile(filePath: string): void {
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Skip if file already has AuditInterceptor
  if (content.includes('AuditInterceptor')) {
    console.log(`[SKIP] Already updated: ${filePath}`);
    return;
  }
  
  // Add imports
  if (!content.includes('UseInterceptors')) {
    content = content.replace(
      /import {([^}]*)}/,
      'import {$1, UseInterceptors}'
    );
  }
  
  if (!content.includes('Metadata')) {
    if (content.includes('ModuleName, Permissions')) {
      content = content.replace(
        'ModuleName, Permissions',
        'ModuleName, Permissions, Metadata'
      );
    } else if (content.includes('Permissions, ModuleName')) {
      content = content.replace(
        'Permissions, ModuleName',
        'Permissions, ModuleName, Metadata'
      );
    } else if (content.includes('{ ModuleName, Permissions }')) {
      content = content.replace(
        '{ ModuleName, Permissions }',
        '{ ModuleName, Permissions, Metadata }'
      );
    } else if (content.includes('@decorators/index')) {
      content = content.replace(
        /import [^;]*@decorators\/index[^;]*;/,
        match => {
          if (match.includes('Metadata')) return match;
          return match.replace('}', ', Metadata}');
        }
      );
    } else {
      content = content.replace(
        /import [^;]*;/,
        match => `${match}\nimport { Metadata } from '@decorators/index';`
      );
    }
  }
  
  // Add AuditInterceptor import if needed
  if (!content.includes('AuditInterceptor')) {
    content = content.replace(
      /import [^;]*;/,
      match => `${match}\nimport { AuditInterceptor } from 'src/core/infraestructure/interceptors/audit.interceptor';`
    );
  }
  
  // Add @Metadata and @UseInterceptors decorators to controller methods
  const httpMethodRegex = /@(Get|Post|Put|Patch|Delete)(\([^)]*\))?\n([^@]*@HttpCode\([^)]*\))?\n(\s*@Permissions\([^)]*\))?\n(\s*@ModuleName\([^)]*\))?/g;
  
  content = content.replace(httpMethodRegex, (match, httpMethod, params, httpCode, permissions, moduleName) => {
    // Determine the audit action description based on the HTTP method
    let action;
    const moduleMatch = content.match(/@ApiTags\(\s*['"]([^'"]+)['"]\s*\)/);
    const resourceName = moduleMatch ? moduleMatch[1].toLowerCase() : 'recurso';
    
    switch(httpMethod) {
      case 'Get':
        if (params && params.includes(':id')) {
          action = `Consulta de ${resourceName} por ID`;
        } else {
          action = `Consulta de ${resourceName}`;
        }
        break;
      case 'Post':
        action = `Creación de ${resourceName}`;
        break;
      case 'Put':
        action = `Actualización de ${resourceName}`;
        break;
      case 'Patch':
        action = `Actualización parcial de ${resourceName}`;
        break;
      case 'Delete':
        action = `Eliminación de ${resourceName}`;
        break;
      default:
        action = `Operación en ${resourceName}`;
    }
    
    // Only add decorators if @Permissions and @ModuleName exist
    if (permissions && moduleName) {
      return `@${httpMethod}${params || ''}\n${httpCode || ''}\n${permissions}\n${moduleName}\n  @Metadata('AUDIT', '${action}')\n  @UseInterceptors(AuditInterceptor)`;
    }
    
    return match;
  });
  
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`[UPDATED] ${filePath}`);
}

// Main function
function main() {
  const srcDirectory = path.join(__dirname, '..', 'src');
  const controllerFiles = findControllerFiles(srcDirectory);
  
  console.log(`Found ${controllerFiles.length} controller files`);
  
  for (const file of controllerFiles) {
    updateControllerFile(file);
  }
}

main(); 