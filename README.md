```
      _          _ _           _
  ___| |__   ___| | |      ___| |_ _ __ ___  __ _ _ __ ___
 / __| '_ \ / _ \ | |_____/ __| __| '__/ _ \/ _` | '_ ` _ \
 \__ \ | | |  __/ | |_____\__ \ |_| | |  __/ (_| | | | | | |
 |___/_| |_|\___|_|_|     |___/\__|_|  \___|\__,_|_| |_| |_|

Simple remote shell which streams commands from guest to host and results the other way around.
```

## Install
`npm install -g shell-stream`

## Start host

`shell-stream --host Six`

## Start guest

`shell-stream Six`

You don't event need to start the host before starting the client.

Clients and hosts will auto discover each other and establish a connection whenever one or the other is available.

Enjoy!

![screenshot](https://cldup.com/WzgNufrfT9.gif)
