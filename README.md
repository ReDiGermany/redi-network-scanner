# Network Scanner
###### the simple way to keep your network devices in focus
Install via NPM:
```npm
npm i network-scanner --save
```
Only tested on Raspberry Pi Zero W on NodeJS Version `v10.14.2`
---
## API
###### Configuration
name|description|default|type|info
--- | --- | --- | --- | ---
suffix|your network suffix|.fritz.box|string|
test|shows ur network scan unparsed|function|
ip|lets you define a fixed ip (faster on startup)|`gets loaded`|string|
debug|some debug logging|false|bool|
offlinetimeout|time when the `offline` event should get fired|5*60|int|in seconds
scaninterval|check interval|1|int|in seconds
###### Events
name|description
--- | ---
error|displays some errors
online|fired when a new device is in your network
offline|fired when a device disconnected
back|fired when the disconnect timeout gets canceled
lost|fired when the device is lost. disconnect timeout gets started here
list|initial list of known devices
init|initial function with your config (optional)
---
Full example as in [`example.js`](https://github.com/ReDiGermany/network-scanner/blob/master/example.js)
```javascript
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

```
