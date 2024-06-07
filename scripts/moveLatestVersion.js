import * as fs from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import matter from 'gray-matter';

const sourceFolder = 'docs/md-docs';
const destinationFolder = 'src/content/docs/reference';
// Function to recursively copy markdown files and add title frontmatter
async function copyAndEditMarkdownFiles(src, dest) {
    const exists = existsSync(src);
    const stats = exists && await fs.stat(src);
    const isDirectory = exists && stats.isDirectory();
    if (exists && path.extname(src) === '.md') {
        await fs.copyFile(src, dest);
        console.log(`Editing file: ${dest}`);
        await editMarkdown(dest);
    } else if (exists && isDirectory) {
        await fs.mkdir(dest, { recursive: true });
        const children = await fs.readdir(src);
        for (const child of children) {
            await copyAndEditMarkdownFiles(path.join(src, child), path.join(dest, child));
        }
    }
}

async function editMarkdown(dest) {
    // Read file content
    let fileContent = await fs.readFile(dest, 'utf8');
        
    // Parse frontmatter
    let doc = matter(fileContent);
    // If title in frontmatter doesn't exist, create it
    if (!doc.data.title) {
        doc.data.title = path.basename(dest, '.md');
        
        // Write file back with new frontmatter
        const newContent = matter.stringify(doc.content, doc.data);
        await fs.writeFile(dest, newContent, 'utf8');
    }
}

// Get a list of all folders directly under the source folder
const folders = (await fs.readdir(sourceFolder, { withFileTypes: true }))
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);

// Create a folder in the destination for each source folder
folders.forEach(async folder => {
    console.log(folder)
    const pkgSrcFolder = path.join(sourceFolder, folder);
    const pkgDestFolder = path.join(destinationFolder, folder);
    (await fs.readdir(pkgSrcFolder, { withFileTypes: true }))
        .filter(dirent => dirent.isDirectory() && (dirent.name.startsWith('v') || dirent.name === 'current-branch-main'))
        .map(dirent => dirent.name)
        .forEach(async subfolder => {
            const srcFolder = path.join(pkgSrcFolder, subfolder);
            const destFolder = path.join(pkgDestFolder, subfolder);
            console.log(`Processing MD for ${srcFolder}`)
            await copyAndEditMarkdownFiles(srcFolder, destFolder);
        });
});

