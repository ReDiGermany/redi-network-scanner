# Network Scanner
###### the simple way to keep your network devices in focus
Install via NPM:
```npm
npm i redi-network-scanner --save
```
Only tested on Raspberry Pi Zero W on NodeJS Version `v10.14.2`
---
## API
###### Configuration
name|type|default|description|info
--- | --- | --- | --- | ---
suffix|string|.fritz.box|your network suffix|
test|function||shows ur network scan unparsed
ip|string|`gets loaded`|lets you define a fixed ip (faster on startup)|
debug|bool|false|some debug logging|
offlinetimeout|int|5*60|time when the `offline` event should get fired|in seconds
scaninterval|int|1|check interval|in seconds
###### Events
name|description|response
--- | --- | ---
error|displays some errors|
online|fired when a new device is in your network|{ ip:'xxx.xxx.xxx.xxx', name: 'xyz' }
offline|fired when a device disconnected|{ ip:'xxx.xxx.xxx.xxx', name: 'xyz' }
back|fired when the disconnect timeout gets canceled|{ ip: 'xxx.xxx.xxx.xxx', name: 'xyz', time: MOMENTS_STRING }
lost|fired when the device is lost. disconnect timeout gets started here|{ ip: 'xxx.xxx.xxx.xxx', name: 'xyz', time: MOMENTS_STRING }
list|initial list of known devices
init|initial function with your config (optional)
---
Full example as in [`example.js`](https://github.com/ReDiGermany/redi-network-scanner/blob/master/example.js)
```javascript
const ns = require('redi-network-scanner')
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
