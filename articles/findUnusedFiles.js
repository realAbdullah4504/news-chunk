const fs = require('fs');
const path = require('path');

// Set the directory to search
const directoryPath = path.join(__dirname, 'src'); // Change 'src' to your directory

// Function to read files and find unused ones
const findUnusedFiles = (dirPath) => {
    const files = fs.readdirSync(dirPath);
    const usedFiles = new Set();

    // Example: Collect all used files (You can customize this)
    // This assumes you're using imports, adjust as necessary
    const regex = /import\s+.*?\s+from\s+['"](.*)['"]/g;

    files.forEach(file => {
        const filePath = path.join(dirPath, file);
        if (fs.statSync(filePath).isDirectory()) {
            findUnusedFiles(filePath); // Recursively check directories
        } else if (file.endsWith('.js') || file.endsWith('.jsx')) {
            const content = fs.readFileSync(filePath, 'utf-8');
            let match;
            while ((match = regex.exec(content))) {
                usedFiles.add(match[1].replace(/['"]/g, ''));
            }
        }
    });

    // Now check against the files in the directory
    files.forEach(file => {
        if (!usedFiles.has(file)) {
            console.log(`Unused file: ${file}`);
            // fs.unlinkSync(path.join(dirPath, file)); // Uncomment to delete
        }
    });
};

findUnusedFiles(directoryPath);
