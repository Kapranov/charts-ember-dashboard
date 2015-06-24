#!/usr/bin/env bash
PORT='2272'
IP='212.26.132.49'

clear && rake tmp:clear && rake log:clear && rackup  -o $IP -p $PORT config.ru
