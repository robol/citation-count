#!/bin/bash

export FLASK_APP=citationserver.py

flask run --reload &
flaskpid="$!"

cd frontend && npm start &
nodepid="$!"

function shutdown_servers {
  kill ${nodepid}
  kill ${flaskpid}
}

trap shutdown_servers INT

wait


