#!/bin/bash

# Command line arguments
ENV_DUMP=$1

# Required variables
DOCKER_NAME=ts-api-mongo
RESTORE_HOST=localhost
RESTORE_PORT=27017
RESTORE_USER=root
RESTORE_PASSWORD=rootPassword

# Enables error propagation
set -e

print() {
    printf "\n\n\n# # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #\n%s\n# # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #\n\n\n" "$1"
}

if [[ $ENV_DUMP == "PREINT" || $ENV_DUMP == "PRE" || $ENV_DUMP == "DES" || $ENV_DUMP == "PRO" ]]; then
    print "                    Restoring $ENV_DUMP dump"
else
    printf "\nEnvironment is required"
    printf "\n\nUsage: npm run restoreDump [ENVIRONMENT]"
    printf "\n  ENVIROMENT: DES, PRE or PREINT."
    printf '\n\nExample: npm run restoreDump DES'
    exit 1
fi

docker exec -it "$DOCKER_NAME" mongorestore --host "$RESTORE_HOST" --port "$RESTORE_PORT" --username "$RESTORE_USER" --password "$RESTORE_PASSWORD" --drop "/data/dump/$ENV_DUMP"

docker restart "$DOCKER_NAME"

print "                    $ENV_DUMP restore completed"

exit 0
