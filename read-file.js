/**
 * Node.js script to:
 * 1. Recursively scan directories starting from the current location.
 * 2. Identify `.js` files.
 * 3. Count `key: value` pairs in each file (simple object properties).
 * 4. Save results into a text file, including:
 *    - Each file's key-value pair count.
 *    - Summary totals.
 * 
 * Uses only built-in Node.js modules: fs (filesystem) and path.
 */

const fs = require('fs');     // File system module for reading/writing files and directories
const path = require('path'); // Path module for handling file paths

// Name of the output file where results will be saved
const outputFile = 'js_key_value_count.txt';

// Starting directory for scanning (current directory where the script is run)
const startDir = __dirname;

/**
 * Recursively gets all files in a given directory.
 * 
 * @param {string} dirPath - Path to the directory to scan.
 * @param {string[]} fileList - Accumulator array for storing file paths.
 * @returns {string[]} - Array of file paths found in the directory and subdirectories.
 */
function getAllFiles(dirPath, fileList = []) {
    // Read all files and directories in the given directory
    const files = fs.readdirSync(dirPath);

    files.forEach(file => {
        // Full path of the current file or folder
        const filePath = path.join(dirPath, file);

        // Get stats for the current path (is it a file or folder?)
        const stat = fs.statSync(filePath);

        if (stat.isDirectory()) {
            // If it's a folder, recursively scan it
            getAllFiles(filePath, fileList);
        } else {
            // If it's a file, add to the list
            fileList.push(filePath);
        }
    });

    return fileList;
}

/**
 * Counts key-value pairs in a given JavaScript file.
 * This is a basic pattern match using regex (not 100% accurate for complex JS).
 * 
 * @param {string} filePath - Path to the JavaScript file.
 * @returns {number} - Count of key-value pairs found.
 */
function countKeyValuePairsInJsFile(filePath) {
    try {
        // Read file content as a string
        const content = fs.readFileSync(filePath, 'utf-8');

        /**
         * Regex explanation:
         * \b\w+\b     => Matches a "word" (key name) with word boundaries.
         * \s*:\s*     => Matches a colon `:` surrounded by optional spaces.
         * [^,{}\n]+   => Matches the value part until it hits a comma, curly brace, or newline.
         */
        const matches = content.match(/\b\w+\b\s*:\s*[^,{}\n]+/g);

        // If matches found, return count, otherwise 0
        return matches ? matches.length : 0;
    } catch (err) {
        // If file cannot be read, show error and return 0
        console.error(`❌ Error reading ${filePath}:`, err);
        return 0;
    }
}

// Main execution block wrapped in try-catch to handle unexpected errors
try {
    // Step 1: Get all files starting from the given directory
    const allFiles = getAllFiles(startDir);

    // Step 2: Filter only `.js` files
    const jsFiles = allFiles.filter(f => f.endsWith('.js'));

    // Step 3: Prepare variables to store results and totals
    let results = [];           // Array to hold output lines
    let totalFilesWithPairs = 0; // Number of JS files that have at least one key-value pair
    let totalKeyValuePairs = 0;  // Total count of key-value pairs across all files

    // Step 4: Loop through each JS file and process it
    jsFiles.forEach(jsFile => {
        // Count key-value pairs in the file
        const count = countKeyValuePairsInJsFile(jsFile);

        // If file has at least one key-value pair, update totals
        if (count > 0) {
            totalFilesWithPairs++;
            totalKeyValuePairs += count;
        }

        // Add this file's result to the results list
        results.push(`${jsFile} => ${count} key-value pairs`);
    });

    // Step 5: Sort results so that files with most key-value pairs appear first
    results.sort((a, b) => {
        // Extract numbers from " => X key-value pairs"
        const countA = parseInt(a.match(/=> (\d+)/)[1], 10);
        const countB = parseInt(b.match(/=> (\d+)/)[1], 10);
        return countB - countA; // Descending order
    });

    // Step 6: Append summary to the results
    results.push('\n--- Summary ---');
    results.push(`Total JS files with key-value pairs: ${totalFilesWithPairs}`);
    results.push(`Total key-value pairs: ${totalKeyValuePairs}`);

    // Step 7: Write results to the output file
    fs.writeFileSync(outputFile, results.join('\n'), 'utf-8');

    // Step 8: Inform the user
    console.log(`✅ Key-value pair count saved to ${outputFile}`);
} catch (err) {
    // Handle unexpected errors
    console.error('❌ Error:', err);
}
