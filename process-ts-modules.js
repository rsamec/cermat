const fs = require('fs');
const path = require('path');
const ts = require('typescript');
const tsNode = require('ts-node');

// Register ts-node compiler
tsNode.register({
  transpileOnly: false,

  compilerOptions: {
    module: "commonjs", // Set module to 'es2015' or later
    target: "es2020",
    moduleResolution: "node",
    allowSyntheticDefaultImports: true,

  },
});

// Function to stringify TypeScript module and save to JSON file
async function processFile(filePath, outputDir) {
  try {
    // Compile TypeScript file in memory
    const { default: exportValue } = require(filePath);

    // Convert TypeScript module export to JSON string
    const jsonString = JSON.stringify(exportValue, null, 2);

    // Determine the output file path
    const outputFilePath = path.join(
      outputDir,
      path.basename(filePath, path.extname(filePath)) + '.json'
    );

    // Save the JSON string to a file
    fs.writeFileSync(outputFilePath, jsonString, 'utf-8');

    console.log(`Processed ${filePath} -> ${outputFilePath}`);
  } catch (error) {
    console.error(`Error processing ${filePath}: ${error.message}`);
  }
}

// Function to process all TypeScript files in a directory
async function processFilesInDirectory(sourceDir, outputDir) {
  // Read all files in the source directory
  const fileNames = fs.readdirSync(sourceDir);

  // Process each TypeScript file
  for (const fileName of fileNames) {
    const filePath = path.join(sourceDir, fileName);

    // Check if the file is a TypeScript file
    if (path.extname(filePath) === '.ts') {
      await processFile(filePath, outputDir);
    }
  }
}

// Main function to run the script
async function main() {
  const args = process.argv.slice(2);

  if (args.length !== 2) {
    console.error('Usage: node script.js <source_directory> <output_directory>');
    process.exit(1);
  }

  const sourceDir = path.join(process.cwd(),args[0]);
  const outputDir = path.join(process.cwd(),args[1]);

  // Ensure the output directory exists
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir);
  }

  // Process all TypeScript files in the source directory
  await processFilesInDirectory(sourceDir, outputDir);
}

// Run the script
main();
