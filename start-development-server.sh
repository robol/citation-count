#!/bin/bash

export FLASK_APP=citationserver.py

flask run --reload &
flaskpid="$!"

cd frontend && npm start

kill ${flaskpid}


