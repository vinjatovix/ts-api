#!/bin/bash

RELEASE_TYPE=$1

# Colores
RED='\033[0;31m'
GREEN='\033[0;32m'
NC='\033[0m' # No Color

# Check if the release type is provided
if [ -z "$RELEASE_TYPE" ]; then
  echo -e "${RED}You must provide a version type (major, minor, patch).${NC}"
  exit 1
fi

BRANCH=$(git branch --show-current)

# if is not a release branch, abort
if [[ ! "$BRANCH" =~ ^release/ ]]; then
  echo -e "${RED}You must be in a release branch to run this script.${NC}"
  exit 1
fi

# Obtain the current version
CURRENT_VERSION=$(git describe --tags --abbrev=0 | sed 's/^v//')
NEW_VERSION=$(node -p "require('./package.json').version")

echo -e "Last tag: ${GREEN}$CURRENT_VERSION${NC}"
echo -e "New release: ${GREEN}$NEW_VERSION${NC}"
# NEW_VERSION=$(npm --no-git-tag-version version "$RELEASE_TYPE" | sed 's/^v//')

# Function to replace version in files
replace_version() {
  local file="$1"
  sed -i "" -e "s/$CURRENT_VERSION/$NEW_VERSION/g" "$file"
}

# Replace the version in README.md
replace_version README.md

# Replace the version in docker-compose.yml
replace_version docker-compose.yaml

# Replace the version in OpenAPI specification
replace_version ./src/apps/apiApp/openApi.yaml

# Commit the changes
ISSUE=$(git branch --show-current | sed 's/^release\///')
git add .
git commit -m "[GH-$ISSUE] Prepare release v$NEW_VERSION"

# Check if the commit was successful
if [ $? -ne 0 ]; then
  echo -e "${RED}Commit failed. Aborting tag creation and push.${NC}"
  exit 1
fi

# Create a git tag for the new version
echo -e "Creating git tag ${GREEN}v$NEW_VERSION${NC}"
git tag -a "v$NEW_VERSION" -m "Version v$NEW_VERSION"

# Check if the tag creation was successful
if [ $? -ne 0 ]; then
  echo -e "${RED}Tag creation failed. Aborting the push.${NC}"
  exit 1
fi

# Push the changes and the new tag
echo -e "Pushing the changes and the new tag."
git push --force-with-lease origin "$(git branch --show-current)"
git push origin "v$NEW_VERSION"

echo -e "${GREEN}Push completed successfully.${NC}"
