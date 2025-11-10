// generate_manifest.js
import fs from "fs";
import path from "path";

// Path to your textures folder
const baseDir = path.resolve("./public/Minecraft_Blocks/textures");

// Read all first-level subdirectories (animal, building, etc.)
const textureTypes = fs
  .readdirSync(baseDir, { withFileTypes: true })
  .filter((dirent) => dirent.isDirectory())
  .map((dirent) => dirent.name);

const manifest = {};

for (const type of textureTypes) {
  const dirPath = path.join(baseDir, type);

  // Read all files in that subdirectory
  const files = fs
    .readdirSync(dirPath, { withFileTypes: true })
    .filter((dirent) => dirent.isFile())
    .map((dirent) => dirent.name);

  manifest[type] = files;
}

// Write to ./public/textures/manifest.json
const outputPath = path.join(baseDir, "manifest.json");
fs.writeFileSync(outputPath, JSON.stringify(manifest, null, 2));

console.log(`✅ Manifest created at ${outputPath}`);
