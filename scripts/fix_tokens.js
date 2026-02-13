const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../src/components/ShareStudio.jsx');
let content = fs.readFileSync(filePath, 'utf8');

// Replace 1: Show reward button always
content = content.replace(
     '{isProfileReady && tokens <= 0 && (',
     '{isProfileReady && ('
);

// Replace 2: Update message text
content = content.replace(
     'Token bitti. Reklam izleyerek devam edebilirsiniz.',
     'Reklam izleyerek token kazanabilirsiniz.'
);

fs.writeFileSync(filePath, content, 'utf8');
console.log('ShareStudio updated successfully.');
