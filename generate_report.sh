#!/bin/bash
set -e

# Name of the output file
OUTPUT_FILE="repo_report.txt"

# Remove existing output file
rm -f "$OUTPUT_FILE"

#######################################
# 1. Generate and append repo structure
#######################################
echo "====================================" >> "$OUTPUT_FILE"
echo "          REPO STRUCTURE            " >> "$OUTPUT_FILE"
echo "====================================" >> "$OUTPUT_FILE"

# Use tree to list the directory structure, ignoring specific folders and files
tree -a -I "node_modules|package-lock.json|pnpm-lock.yaml|yarn.lock|*.ico|*.png|*.jpg|*.jpeg|*.svg|*.gif|.DS_Store|.git|abis|main.0d424902.js|.env" xrplevm-antispam-bot >> "$OUTPUT_FILE" 2>/dev/null

#######################################
# 2. Append contents of important files
#######################################
echo -e "\n\n====================================" >> "$OUTPUT_FILE"
echo "          FILE CONTENTS             " >> "$OUTPUT_FILE"
echo "====================================" >> "$OUTPUT_FILE"

# Find all files in monorepo excluding typical files/folders and .env files (but not .env.example)
find xrplevm-antispam-bot -type f \
    -not -path "*node_modules*" \
    -not -path "*\.next*" \
    -not -name "package-lock.json" \
    -not -name "pnpm-lock.yaml" \
    -not -name "yarn.lock" \
    -not -path "*/.git/*" \
    -not -name ".gitignore" \
    -not -name "*.ico" \
    -not -name "*.png" \
    -not -name "*.jpg" \
    -not -name "*.jpeg" \
    -not -name "*.svg" \
    -not -name "*.gif" \
    -not -name ".env" \
| while read -r file; do
    # Do not skip .env.example even if its name contains ".env"
    if [[ "$(basename "$file")" == ".env.example" ]]; then
        echo -e "\n-------- $file --------" >> "$OUTPUT_FILE"
        cat "$file" >> "$OUTPUT_FILE"
    else
        echo -e "\n-------- $file --------" >> "$OUTPUT_FILE"
        # Check if file is text using the file command
        if file "$file" | grep -q "text"; then
            cat "$file" >> "$OUTPUT_FILE"
        else
            echo "[Binary file content skipped]" >> "$OUTPUT_FILE"
        fi
    fi
done

echo "Report generated in '$OUTPUT_FILE'."