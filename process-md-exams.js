const fs = require('fs');
const path = require('path');
const tsNode = require('ts-node');
const pdf = require('pdf-parse');
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

    // Read the content of the input file
    const inputContent = fs.readFileSync(filePath, 'utf-8');

    // Modify the content 
    const modifiedContent = normalizeText(inputContent)


    // Determine the output file path
    const outputFilePath = path.join(
      outputDir,
      path.basename(filePath, path.extname(filePath)) + '.md'
    );

    // Save the JSON string to a file
    fs.writeFileSync(outputFilePath, modifiedContent, 'utf-8');

    console.log(`Processed ${filePath} -> ${outputFilePath}`);
  } catch (error) {
    console.error(`Error processing ${filePath}: ${error.message}`);
  }
}
async function processContent(filePath, inputContent, outputDir) {
  try {

    // Modify the content 
    const modifiedContent = normalizeText(inputContent)


    // Determine the output file path
    const outputFilePath = path.join(
      outputDir,
      path.basename(filePath, path.extname(filePath)) + '.md'
    );

    // Save the JSON string to a file
    fs.writeFileSync(outputFilePath, modifiedContent, 'utf-8');

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

    // Check if the file is a Markdown file
    if (path.extname(filePath) === '.pdf') {
      const textContent = await extractTextFromPDF(filePath)
      await processContent(filePath, textContent, outputDir)
      //await processFile(filePath, outputDir);
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

  const sourceDir = path.join(process.cwd(), args[0]);
  const outputDir = path.join(process.cwd(), args[1]);

  // Ensure the output directory exists
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir);
  }

  // Process all TypeScript files in the source directory
  await processFilesInDirectory(sourceDir, outputDir);
}


function matchNumberListCount(input) {
  return input.replace(/^\s*(\d+(?:\.\d+)*)(?=\s|$)/gm, (match, p1) => {
    const hashCount = p1.split('.').length - 1;
    const hashes = '#'.repeat(hashCount + 1);
    return `${hashes} ${p1}`;
  });
  //return input.replaceAll(/(\d+)(?:\.(\d+))?/gm, (_, ...matches:string[]) => `## ${matches.join('.')}`)
}

function removeLinesMatchingValues(inputString, valuesToRemove) {
  const regexPattern = new RegExp(`^\\s*(${valuesToRemove.join('|')})\\s*$`, 'gm');
  return inputString.replace(regexPattern, '');
}

function removeMultipleLinesMathingLastValue(inputString, lastLineValue) {
  const regex = new RegExp(`^\\d+\\s*$(?:\\r?\\n|^)\\s*${lastLineValue}\\s*$`, 'gm');

  return inputString.replace(regex, '');
}
function normalizeText(input) {
  let result = input;



  //cleanup
  result = removeLinesMatchingValues(result, ['1 bod', '2 body', '3 body', '4 body', 'max. 1 bod', 'max. 2 body', 'max. 3 body', 'max. 4 body', 'A N'])
  result = removeMultipleLinesMathingLastValue(result, 'Veřejně nepřístupná informace podle § 60b odst. 3 a § 80b školského zákona'.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
  // add top level 
  result = result.replaceAll(/^\s*VÝCHOZÍ TEXT.*$/gm, (match, header) => '\n' + match + '\n===\n')
  // add second level
  result = matchNumberListCount(result);

  // proces options
  result = result.replace(/^([ABCDEF])\)[ \t]/gm, (_, option) => `- [${option}] `)

  return result;
}



async function extractTextFromPDF(pdfFilePath, startPage = 1) {

  try {
    // Read the PDF file
    const pdfBuffer = fs.readFileSync(pdfFilePath);

    // Parse the PDF content
    const pdfData = await pdf(pdfBuffer, {
      pagerender: (pageData) => {
        if(pageData.pageIndex == 1) return '';
        
        //check documents https://mozilla.github.io/pdf.js/
        let render_options = {
          //replaces all occurrences of whitespace with standard spaces (0x20). The default value is `false`.
          normalizeWhitespace: false,
          //do not attempt to combine same line TextItem's. The default value is `false`.
          disableCombineTextItems: false
        }

        return pageData.getTextContent(render_options)
          .then(function (textContent) {
            let lastY, text = '';
            for (let item of textContent.items) {
              if (lastY == item.transform[5] || !lastY) {
                text += item.str;
              }
              else {
                text += '\n' + item.str;
              }
              lastY = item.transform[5];
            }
            console.log(pdfFilePath, `Page ${pageData.pageIndex}`)

            return text;
          });
      }
    })


    // Extract text from the PDF
    // let text = '';
    // for (let i = startPage; i < pdfData.numPages; i++) {
    //   const page = await pdfData.getPage(i + 1); // Page numbers start from 1
    //   console.log(page);
    //   text += await page.getText();
    // }
    text = pdfData.text;    
    return text;
  } catch (error) {
    throw new Error(`Error reading PDF file: ${error.message}`);
  }
}

// Run the script
main();
