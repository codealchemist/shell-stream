'use strict'

const udp = require('datagram-stream')
const UdpNode = require('udp-node')
const readline = require('readline')

module.exports = class Host {
  constructor (hostname) {
    console.log(`--- ${hostname} STARTED`)

    // create udp node for discovery
    this.node = new UdpNode()
    this.node
      .setLogLevel('error')
      .set({
        name: hostname,
        type: 'host',
        port: 3025
      })
      .broadcast({
        port: 3024,
        filter: ['guest']
      })
      .onNode((data, rinfo) => {
        this.init(data, rinfo)

        this.node
          .send({
            type: 'connect',
            hostname: hostname,
            address: rinfo.address,
            port: rinfo.port
          })
      })
      .on('connect', (message, rinfo) => {
        this.init(message, rinfo)
      })
  }

  init (data, rinfo) {
    const ip = rinfo.address

    console.log('--- FOUND GUEST')
    console.log(data)
    console.log('-'.repeat(80))
    console.log()

    this.stream = udp({
      address: '0.0.0.0', // address to bind to
      unicast: ip, // unicast ip address to send to
      port: 5556, // udp port to send to
      bindingPort: 5555, // udp port to listen on. Default: port
      reuseAddr: true // boolean: allow multiple processes to bind to the same address and port. Default: true
    })

    // create new process to run command on
    const osType = os.platform()
    let shell = 'sh'
    if (osType === 'win32') shell = 'powershell.exe'
    this.spawn = require('child_process').spawn(shell)

    // set command line prompt
    this.rl = readline.createInterface({
      input: this.stream,
      output: process.stdout,
      prompt: 'SHELL-STREAM-HOST> '
    })
    this.rl.prompt()

    this.rl.on('line', (line) => {
      const text = line.trim()
      this.exec(text)
    }).on('close', () => {
      console.log('Have a great day!')
      process.exit(0)
    })
  }

  // function to run command on the new process
  exec (text) {
    let command = this.spawn.spawn(text, [], {shell: true})

    // send command output to guest
    // command.stdout.pipe(this.stream)

    // display local output
    // command.stdout.pipe(process.stdout)

    // show output locally
    let output = ''
    command.stdout.on('data', (chunk) => {
      output += chunk
    })
    command.stderr.on('data', (chunk) => {
      output += chunk
    })
    command.on('close', () => {
      console.log(output) // local output
      this.stream.write(output) // remote output
      // this.stream.end('a')
      this.rl.prompt()
    })
  }
}
