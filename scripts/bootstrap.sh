#!/usr/bin/env bash
set -euo pipefail

if [[ -f .env.example ]]; then
  cp .env.example .env
elif [[ ! -f .env ]]; then
  echo "No .env.example found; creating an empty .env file." >&2
  : > .env
fi

docker compose up -d --build
