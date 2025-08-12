// file: listJsKeyValueCount.js

/**
 * This script scans through all JavaScript files inside a given directory (`startDir`)
 * and its subdirectories. For each JS file:
 *   1. It finds all simple `key: value` pairs.
 *   2. It calculates the number of words in the `value` part only.
 *   3. It logs the key-value pair and the value's word count.
 *   4. It outputs results to a file, including a summary of totals.
 */

// ------------------------------
// Load built-in Node.js modules
// ------------------------------
const fs = require('fs');        // Provides file system operations like reading/writing files
const path = require('path');    // Provides utilities for working with file and directory paths

// ------------------------------
// Configuration variables
// ------------------------------
const outputFile = 'js_value_word_count.txt'; // File where results will be saved
const startDir = 'src'; // Directory where the script starts scanning

/**
 * Recursively retrieves all file paths from a given directory and its subdirectories.
 *
 * @param {string} dirPath - The directory path to scan.
 * @param {string[]} fileList - Accumulates found file paths during recursion.
 * @returns {string[]} - List of full file paths.
 */
function getAllFiles(dirPath, fileList = []) {
    // Read all entries (files and directories) inside the current directory
    const files = fs.readdirSync(dirPath);

    // Loop through each entry found
    files.forEach(file => {
        // Join directory path with file/directory name to get full path
        const filePath = path.join(dirPath, file);

        // Get information about the file (is it a directory or a regular file?)
        const stat = fs.statSync(filePath);

        if (stat.isDirectory()) {
            // If it's a directory, recurse into it
            getAllFiles(filePath, fileList);
        } else {
            // If it's a file, add it to the list
            fileList.push(filePath);
        }
    });

    return fileList; // Return the accumulated list of files
}

/**
 * Counts the number of words in a given string.
 *
 * @param {string} str - Input string to count words from.
 * @returns {number} - Word count.
 */
function wordCount(str) {
    if (!str) return 0; // If string is empty/null, return 0
    // Trim whitespace, split by spaces/tabs/newlines, filter out empty entries
    return str.trim().split(/\s+/).filter(Boolean).length;
}

/**
 * Reads a JavaScript file, finds all simple `key: value` pairs,
 * and counts the number of words in each value.
 *
 * @param {string} filePath - Path to the JS file to process.
 * @returns {{valueWords: number, pairs: string[]}} - Total value word count and formatted key-value strings.
 */
function getValueWordCountFromJsFile(filePath) {
    try {
        // Read file contents as UTF-8 text
        const content = fs.readFileSync(filePath, 'utf-8');

        /**
         * Match key-value pairs using regex:
         * - \b\w+\b      → a word boundary + word (the key)
         * - \s*:\s*      → optional spaces, a colon, optional spaces
         * - [^,{}\n]+    → value: one or more characters until a comma, {, }, or newline
         */
        const matches = content.match(/\b\w+\b\s*:\s*[^,{}\n]+/g);

        // If no matches found, return zero count
        if (!matches) return { valueWords: 0, pairs: [] };

        let totalValueWords = 0; // Accumulate word counts from all values
        const pairs = matches.map(pair => {
            // Split into key and value parts — value may contain colons, so use rest.join(':')
            const [key, ...rest] = pair.split(':');
            const value = rest.join(':').trim();

            // Count words in the value
            const count = wordCount(value);
            totalValueWords += count;

            // Return the key-value pair with value word count annotation
            return `${key.trim()}: ${value} (valueWords: ${count})`;
        });

        return { valueWords: totalValueWords, pairs };
    } catch (err) {
        // Log error if file can't be read
        console.error(`❌ Error reading ${filePath}:`, err);
        return { valueWords: 0, pairs: [] };
    }
}

// ------------------------------
// Main script execution
// ------------------------------
try {
    // Step 1: Get all files under startDir
    const allFiles = getAllFiles(startDir);

    // Step 2: Filter only JavaScript files
    const jsFiles = allFiles.filter(f => f.endsWith('.js'));

    // Variables to store results
    let fileResults = [];           // Stores results for each JS file
    let totalFilesWithValues = 0;   // Count of JS files containing key-value pairs
    let grandTotalValueWords = 0;   // Total value words across all files

    // Step 3: Process each JS file
    jsFiles.forEach(jsFile => {
        const { valueWords, pairs } = getValueWordCountFromJsFile(jsFile);

        // Update counters if file has any values
        if (valueWords > 0) {
            totalFilesWithValues++;
            grandTotalValueWords += valueWords;
        }

        // Store file-specific result
        fileResults.push({ file: jsFile, valueWords, pairs });
    });

    // Step 4: Sort results by highest value word count first
    fileResults.sort((a, b) => b.valueWords - a.valueWords);

    // Step 5: Build output lines for the file
    let outputLines = [];
    fileResults.forEach(({ file, valueWords, pairs }) => {
        // Header line for the file
        outputLines.push(`${file} => ${valueWords} total value words`);

        // Each key-value pair in the file
        pairs.forEach(pair => {
            outputLines.push(`    ${pair}`);
        });
    });

    // Step 6: Add summary section at the bottom
    outputLines.push('\n--- Summary ---');
    outputLines.push(`Total JS files with values: ${totalFilesWithValues}`);
    outputLines.push(`Grand total value words: ${grandTotalValueWords}`);

    // Step 7: Save results to output file
    fs.writeFileSync(outputFile, outputLines.join('\n'), 'utf-8');

    // Step 8: Inform user in console
    console.log(`✅ Value word count saved to ${outputFile}`);
} catch (err) {
    // Catch unexpected runtime errors
    console.error('❌ Error:', err);
}
