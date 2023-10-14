#!/bin/sh

RELEASE_TYPE=$1

# Check if the release type is provided
if [ -z "$RELEASE_TYPE" ]; then
  echo "You must provide a version type (major, minor, patch)."
  exit 1
fi

# Obtain the current version
CURRENT_VERSION=$(node -p "require('./package.json').version")

# Obtain the new version without creating a git tag and remove 'v' prefix
NEW_VERSION=$(npm --no-git-tag-version version "$RELEASE_TYPE" | sed 's/^v//')

echo "Current version: $CURRENT_VERSION"
echo "New version: $NEW_VERSION"

# Replace the version in README.md
perl -i -pe "s/Version-v$CURRENT_VERSION/Version-v$NEW_VERSION/g" README.md

# Repacke the version in the docker-compose.yml file
perl -i -pe "s/ts-api:$CURRENT_VERSION/ts-api:$NEW_VERSION/g" docker-compose.yaml

# Commit the changes
ISSUE=$(git branch --show-current | sed 's/^release\///')
git add .
git commit -m "[$ISSUE] Prepare release v$NEW_VERSION"

# Check if the commit was successful
if [ $? -ne 0 ]; then
  echo "Commit failed. Aborting tag creation and push."
  exit 1
fi

# Create a git tag for the new version
echo "Creating git tag v$NEW_VERSION"
git tag -a "v$NEW_VERSION" -m "Version v$NEW_VERSION"

# Check if the tag creation was successful
if [ $? -ne 0 ]; then
  echo "Tag creation failed. Aborting the push."
  exit 1
fi

# Push the changes and the new tag
echo "Pushing the changes and the new tag."
git push --force-with-lease origin "$(git branch --show-current)"
git push origin "v$NEW_VERSION"

echo "Push completed successfully."

