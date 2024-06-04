import * as fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const sourceFolder = 'docs/md-docs';
const destinationFolder = 'src/content/docs/reference';

// Function to recursively copy markdown files and add title frontmatter
function copyAndEditMarkdownFiles(src, dest) {
    const exists = fs.existsSync(src);
    const stats = exists && fs.statSync(src);
    const isDirectory = exists && stats.isDirectory();
    if (exists && isDirectory) {
        fs.mkdirSync(dest, { recursive: true });
        fs.readdirSync(src).forEach(child => {
            copyAndEditMarkdownFiles(path.join(src, child), path.join(dest, child));
        });
    } else if (path.extname(src) === '.md') {
        fs.copyFileSync(src, dest);
        
        // Read file content
        let fileContent = fs.readFileSync(dest, 'utf8');
        
        // Parse frontmatter
        let doc = matter(fileContent);
        
        // If title in frontmatter doesn't exist, create it
        if (!doc.data.title) {
            doc.data.title = path.basename(dest, '.md');
            
            // Write file back with new frontmatter
            const newContent = matter.stringify(doc.content, doc.data);
            fs.writeFileSync(dest, newContent, 'utf8');
        }
    }
}

// Get a list of all folders directly under the source folder
const folders = fs.readdirSync(sourceFolder, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);

// Create a folder in the destination for each source folder
folders.forEach(folder => {
    const srcFolder = path.join(sourceFolder, folder, 'current-branch-main');
    const destFolder = path.join(destinationFolder, folder);
    copyAndEditMarkdownFiles(srcFolder, destFolder);
});