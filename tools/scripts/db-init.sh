#!/bin/bash

# source the environment variables
source ../../server/.env

# set the PGPASSWORD environment variable, which can be used with all the following commmands
export PGPASSWORD=$DB_PASSWORD

# terminate active connections to db
psql -U $DB_USER -p $DB_PORT -h $DB_HOST -c "SELECT pg_terminate_backend(pg_stat_activity.pid) FROM pg_stat_activity WHERE pg_stat_activity.datname = '$DB_NAME' AND pid <> pg_backend_pid();"

# drop db if it exists
dropdb --if-exists -U $DB_USER -h $DB_HOST -p $DB_PORT $DB_NAME

# create db
createdb -U $DB_USER -h $DB_HOST -p $DB_PORT $DB_NAME

# load the SQL file
psql -U $DB_USER -h $DB_HOST -p $DB_PORT -d $DB_NAME -f ../migrate/initialize.sql

echo "Database $DB_NAME initialized successfully"
