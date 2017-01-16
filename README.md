# shell-stream
Simple remote shell which streams commands from guest to host and results the other way around.

## Install
npm install -g shell-stream

## Start host

`shell-stream --host Six`

## Start guest

`shell-stream Six`

You don't event need to start the host before starting the client.

Clients and hosts will auto discover each other and establish a connection whenever one or the other is available.

Enjoy!
