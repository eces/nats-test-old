require('debugs/init')

const NATS = require('nats')
const nats = NATS.connect({json: true})
const debug = require('debug')('nats-test')

debug('started')

nats.publish('ping', 'hey')

nats.subscribe('ping', msg => {
  debug(msg)
})

nats.subscribe('unicef', msg => {
  debug('unicef=',msg)
})

setInterval(() => {
  nats.requestOne('help', {when: new Date}, {}, 1000, response => {
    debug('RES=', response)
  })
}, 1000)

nats.subscribe('help', (request, replyTo) => {
  nats.publish('unicef', `someone need in help (${request.when})`)
  nats.publish(replyTo, 'will be there soon')
})