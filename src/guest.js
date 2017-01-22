'use strict'
const udp = require('datagram-stream')
const UdpNode = require('udp-node') // use udp-node for discovery

module.exports = class Guest {
  constructor (hostname) {
    console.log(`--- WAITING for ${hostname}...`)

    this.node = new UdpNode()
    this.node
      .setLogLevel('error')
      .set({
        name: 'guest',
        type: 'guest'
      })
      .broadcast({
        port: 3025,
        filter: ['host']
      })
      .onNode((data, rinfo) => {
        // only connect to requested host
        if (data.node.name !== hostname) return

        this.init(data, rinfo)

        this.node
          .send({
            type: 'connect',
            address: rinfo.address,
            port: rinfo.port
          })
      })
      .on('connect', (message, rinfo) => {
        // only connect to requested host
        if (message.hostname !== hostname) return

        this.init(message, rinfo)
      })
  }

  init(data, rinfo) {
    const ip = rinfo.address

    console.log('--- FOUND HOST')
    console.log(data)
    console.log('-'.repeat(80))
    console.log()

    this.stream = udp({
      address: '0.0.0.0', //address to bind to
      unicast: ip, //unicast ip address to send to
      port: 5555, //udp port to send to
      bindingPort: 5556, //udp port to listen on. Default: port
      reuseAddr: true //boolean: allow multiple processes to bind to the same address and port. Default: true
    })

    // pipe whatever is received on stdin over udp
    process.stdin.pipe(this.stream)

    // pipe whatever is received to stdout
    // this.stream.pipe(process.stdout)
    // let streamData = ''
    this.stream.on('data', (chunk) => {
      // streamData += chunk
      console.log(chunk.toString())
      this.rl.prompt()
    })
    // this.stream.on('end', () => {
    //   console.log('-- stream end', streamData)
    //   console.log(streamData)
    //   this.rl.prompt()
    //   streamData = ''
    // })

    // set command line prompt
    const readline = require('readline')
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
      prompt: 'SHELL-STREAM-GUEST> '
    })
    this.rl.prompt()

    this.rl.on('line', (line) => {
      // const text = line.trim()
      // this.rl.prompt();
    }).on('close', () => {
      console.log('Have a great day!');
      process.exit(0);
    })
  }
}
