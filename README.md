# JavaScript Key-Value Pair Counter

## 📌 Overview
This Node.js script recursively scans all directories starting from the current working directory, finds all `.js` files, and counts the number of **key-value pairs** (e.g., `key: value`) in each file.

It then:
- Saves the results to a text file.
- Lists each `.js` file and its key-value pair count.
- Sorts files by highest key-value count.
- Shows a summary with:
  - Total number of `.js` files containing key-value pairs.
  - Total number of key-value pairs across all files.

This script **does not require any npm packages** — it uses only built-in Node.js modules (`fs` and `path`).

---

## 📂 Features
- Recursively scans **all subdirectories**.
- Filters only `.js` files.
- Counts `key: value` pairs using a regex pattern.
- Generates a **sorted output** (highest counts first).
- Saves results to `js_key_value_count.txt`.
- Displays **summary totals** at the end.

---

## ⚙️ Requirements
- Node.js (v12+ recommended)
- No external dependencies required.

---

## 📜 Usage
1. **Save the script** as `listJsKeyValueCount.js`.
2. Place it in the **root directory** you want to scan.
3. Open a terminal in that directory.
4. Run:
   ```bash
   node listJsKeyValueCount.js
