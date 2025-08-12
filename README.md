# JavaScript Key-Value Value Word Counter

This Node.js script scans through all JavaScript (`.js`) files inside a given directory (and its subdirectories), extracts simple `key: value` pairs, counts the number of words **in the value part only**, and saves the results to a text file with a summary.

---

## Features
- Recursively scans a given directory for `.js` files.
- Extracts key-value pairs using a regular expression.
- Counts words **only in the value** (keys are ignored for counting).
- Displays results per file with key-value pairs and value word counts.
- Provides a summary including:
  - Total files containing values
  - Total value word count across all files
- Saves results to an output file for easy reference.

---

## How It Works
1. **Directory scan** → Finds all `.js` files starting from the configured directory.
2. **Regex match** → Extracts `key: value` pairs ignoring nested structures and commas.
3. **Word counting** → Counts the number of words in each value.
4. **Output** → Saves results to a text file, sorted by highest total value word count.

---

## Installation

1. Clone this repository:
   ```bash
   git clone https://github.com/yourusername/js-value-word-counter.git
   cd js-value-word-counter
