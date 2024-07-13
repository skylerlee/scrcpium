#!/bin/bash

usage() {
  echo "Usage: $0 [OPTION...]"
  echo "  -p    port to bind to (default "8080")"
  echo "  -h    print help message"
}

while getopts "p:h" opt; do
  case $opt in
    p)
      PORT=$OPTARG
      ;;
    *)
      usage
      exit 1
      ;;
  esac
done

uvicorn --port ${PORT:-8080} scrcpium:app
