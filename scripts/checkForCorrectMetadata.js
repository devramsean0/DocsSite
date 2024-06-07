import * as fs from "fs/promises";
import matter from 'gray-matter';
import path from 'path';

const problematicFiles = [
    "src/content/docs/reference/hcb.js/v0.2.0/readme.md",
    "src/content/docs/reference/hcb.js/v0.3.0/readme.md"
]

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

problematicFiles.forEach(async file => {
    await editMarkdown(file)
})