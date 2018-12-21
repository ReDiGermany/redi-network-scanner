const ns = require('./index.js')
// const ns = require('redi-network-scanner')
ns.error(data => { console.log(`error`,data) })
ns.online(data => { console.log(`online`,data) })
ns.offline(data => { console.log(`offline`,data) })
// ns.back(data => { console.log(`back`,data) })
// ns.lost(data => { console.log(`lost`,data) })
ns.list(data => { console.log(`list`,data); })
ns.init({
	// test: true,
	// ip: '192.168.178.123',
	// debug: true,
	// suffix: '.fritz.box' // see ns.test() for info.
	// offlinetimeout: 5*60,
	// scaninterval: 1
})
