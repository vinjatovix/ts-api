#!/bin/sh

RELEASE_TYPE=$1

# Check if the release type is provided
if [ -z "$RELEASE_TYPE" ]; then
  echo "You must provide a version type (major, minor, patch)."
  exit 1
fi

# Obtain the current version
CURRENT_VERSION=$(node -p "require('./package.json').version")

# Obtain the new version without creating a git tag
NEW_VERSION=$(npm --no-git-tag-version version "$RELEASE_TYPE")
echo "New version: $NEW_VERSION"

# Replace the version in README.md
perl -i -pe "s/Version-$CURRENT_VERSION/Version-$NEW_VERSION/" README.md

# Commit the changes
git add README.md package.json package-lock.json
git commit -m "chore: Prepare release $NEW_VERSION"

# Create a git tag for the new version only if the commit was successful
if [ $? -eq 0 ]; then
  echo "Creating git tag $NEW_VERSION"
  git tag -a "$NEW_VERSION" -m "Version $NEW_VERSION"
else
  echo "The commit failed, so no git tag was created."
fi

# Push force the changes and the new tag on the current branch
git push --force-with-lease origin "$(git branch --show-current)"
if [ $? -eq 0 ]; then
  echo "Pushed the changes to the remote repository."
  echo ""
  echo "Several files have been updated: README.md, package.json and package-lock.json."
  echo "A new git tag has been created: $NEW_VERSION."
  git push origin "$NEW_VERSION"
else
  echo "The push failed."
fi
