#!/bin/bash

# source the environment variables
source ../../server/.env

# connect to db
psql -U $DB_USER -h $DB_HOST $DB_NAME
