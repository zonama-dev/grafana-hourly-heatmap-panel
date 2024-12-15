#!/bin/bash

# Check if a message argument was provided
if [ $# -eq 0 ]
then
    echo "Error: Missing release message argument"
    echo "Usage: $0 <tag-release-message>"
    exit 1
fi

message=$1
version=$(jq -r '.version' package.json)

# Create Git tag
git tag -a "v$version" -m "$message"

# Push tag to remote
git push origin "v$version"

# Create GitHub release (optional, requires GitHub CLI)
gh release create "v$version" --notes "$message"
