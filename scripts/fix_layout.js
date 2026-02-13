const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../src/components/ShareStudio.jsx');

try {
     if (!fs.existsSync(filePath)) {
          console.error(`File not found: ${filePath}`);
          process.exit(1);
     }

     let content = fs.readFileSync(filePath, 'utf8');
     console.log(`Read ${content.length} bytes from ${filePath}`);

     // Replace Template Grid
     const regexTemplate = /<div\s+className="grid\s+grid-cols-4\s+gap-2">/;
     if (regexTemplate.test(content)) {
          content = content.replace(regexTemplate, '<div className="grid grid-cols-3 sm:grid-cols-4 gap-3 pb-safe">');
          console.log('SUCCESS: Updated Template Grid layout.');
     } else {
          console.log('WARN: Template Grid layout not found with regex.');
          // Check if simple string exists
          if (content.includes('className="grid grid-cols-4 gap-2"')) {
               content = content.replace('className="grid grid-cols-4 gap-2"', 'className="grid grid-cols-3 sm:grid-cols-4 gap-3 pb-safe"');
               console.log('SUCCESS: Updated Template Grid layout (string match).');
          }
     }

     fs.writeFileSync(filePath, content, 'utf8');
     console.log('File written successfully.');

} catch (err) {
     console.error('Error:', err);
     process.exit(1);
}
