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
git add .
git commit -m "chore: Prepare release v$NEW_VERSION"

# Check if the commit was successful
if [ $? -ne 0 ]; then
  echo "Commit failed. Aborting tag creation and push."
  exit 1
fi

echo "Changes committed. Pushing to remote repository."

# Push the changes
git push --force-with-lease origin "$(git branch --show-current)"

echo "Push completed successfully."
