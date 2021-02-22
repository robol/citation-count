#!/bin/bash

if [[ "$1" == "" ]] || [[ "$1" == "build" ]]; then

  sudo docker build -t robol/vqr .

  ( cd frontend && npm run build )

  sudo docker build -t robol/vqr-frontend frontend
fi

if [[ "$1" == "" ]] || [[ "$1" == "push" ]]; then

  echo "You may want to push the images to the cloud by running:"
  echo "$ docker push robol/pdfsignatureverifier"
  echo "$ docker push robol/pdfsignatureverifier-frontend"
  echo ""
  echo -n "Shall I run these commands for you? [yn]: "

  read ans

  if [ "$ans" = "y" ]; then
    docker push robol/vqr
    docker push robol/vqr-frontend
  fi
fi



