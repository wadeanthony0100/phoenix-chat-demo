#! /bin/bash

MIX_ENV=prod PORT=4001 elixir --name phoenix@127.0.0.1 --cookie 123 --erl "-kernel inet_dist_listen_min 9001 inet_dist_listen_m 9001" -pa _build/prod/consolidated -S mix phoenix.server

