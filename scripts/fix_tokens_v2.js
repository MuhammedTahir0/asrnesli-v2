const fs = require('fs');

// Use forward slashes for cross-platform compatibility, Node handles it fine on Windows
const filePath = 'src/components/ShareStudio.jsx';

try {
     if (!fs.existsSync(filePath)) {
          console.error(`File not found: ${filePath}`);
          process.exit(1);
     }

     let content = fs.readFileSync(filePath, 'utf8');
     console.log(`Read ${content.length} bytes.`);

     // Replace 1: Show reward button always
     // Using regex to be whitespace-agnostic
     const regex1 = /\{\s*isProfileReady\s*&&\s*tokens\s*<=\s*0\s*&&\s*\(/;
     if (regex1.test(content)) {
          content = content.replace(regex1, '{isProfileReady && (');
          console.log('SUCCESS: Replaced tokens check.');
     } else {
          console.log('WARN: tokens check not found with regex.');
          // Check if it was already replaced
          if (content.includes('{isProfileReady && (')) {
               console.log('INFO: It seems already replaced.');
          }
     }

     // Replace 2: Update message text
     const oldStr2 = 'Token bitti. Reklam izleyerek devam edebilirsiniz.';
     const newStr2 = 'Reklam izleyerek token kazanabilirsiniz.';

     if (content.includes(oldStr2)) {
          content = content.replace(oldStr2, newStr2);
          console.log('SUCCESS: Replaced text.');
     } else {
          console.log('WARN: text not found.');
     }

     fs.writeFileSync(filePath, content, 'utf8');
     console.log('File written successfully.');

} catch (err) {
     console.error('Error:', err);
     process.exit(1);
}
