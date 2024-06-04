import * as fs from 'fs';
import path from 'path';
import { execSync, spawnSync } from 'child_process';
import matter from 'gray-matter'; // You need to install this package

const sourceFolder = 'docs/md-docs';
const destinationFolder = 'src/content/docs/reference';

// Get a list of all folders directly under the source folder
const folders = fs.readdirSync(sourceFolder, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);

// Create a folder in the destination for each source folder
folders.forEach(folder => {
    const destFolder = path.join(destinationFolder, folder);
    fs.mkdirSync(destFolder, { recursive: true });
    const rsync = spawnSync('rsync', ['-avm', '--include=*.md', '-f', 'hide,! */', path.join(sourceFolder, folder, 'current-branch-main'), destFolder]);
    
    if (rsync.error) {
        console.error(`Error during rsync: ${rsync.error}`);
        return;
    } else {
        console.log(`Copied ${folder} to ${destFolder}`);
        
        // Check if the directory exists
        if (fs.existsSync(destFolder)) {
            // Get all .md files in the folder
            const mdFiles = fs.readdirSync(path.join(destFolder, 'current-branch-main'), { recursive: true}).filter(fn => path.extname(fn) === '.md');
            console.log(`Markdown files in ${destFolder}:`, mdFiles);

            mdFiles.forEach(file => {
                const filePath = path.join(destinationFolder, folder, 'current-branch-main', file);
                let fileContent = fs.readFileSync(path.join(process.cwd(), filePath), 'utf8');
                
                // Parse frontmatter
                let doc = matter(fileContent);
                
                // If title in frontmatter doesn't exist, create it
                if (!doc.data.title) {
                    doc.data.title = path.basename(file, '.md');
                    
                    // Write file back with new frontmatter
                    const newContent = matter.stringify(doc.content, doc.data);
                    fs.writeFileSync(filePath, newContent, 'utf8');
                }
            });
        } else {
            console.log(`Directory does not exist: ${destFolder}`);
        }
    }
});