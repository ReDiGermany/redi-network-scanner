'use strict'
const exec = require('child_process').exec
const moment = require('moment')
const events = require('events')
let eventEmitter = new events.EventEmitter()
let network = {
	online: function(c){
		eventEmitter.on('online',c)
	},
	offline: function(c){
		eventEmitter.on('offline',c)
	},
	list: function(c){
		eventEmitter.on('list',c)
	},
	back: function(c){
		eventEmitter.on('back',c)
	},
	lost: function(c){
		eventEmitter.on('lost',c)
	},
	error: function(c){
		eventEmitter.on('error',c)
	},
	config: function(data){
		if(typeof(data) == 'object'){
			for( let k in data ){
				if(network._config.hasOwnProperty(k)) network._config[k] = data[k]
			}
		}
	},
	_config: {
		ip: '',
		debug: false,
		test: false,
		suffix: '.fritz.box',
		offlinetimeout: 5*60,
		scaninterval: 1
	},
	devices: {
		online: {},
		delete: {},
		times: {}
	},
	time: function(){
		let t = (+ new Date().getTime())
		return t
	},
	check: function(){
		network.scan(function(data){
			for( let k in data ){
				if(!network.devices.online.hasOwnProperty(k)){
					if(network._config.debug) console.log('[REDI:NETWORK-SCANNER] New Device:',data[k])
					eventEmitter.emit('online',{
						ip: k,
						name: data[k]
					})
					network.devices.online[k] = data[k]
					network.devices.times[k] = network.time()
				}
				if(network.devices.delete.hasOwnProperty(k)){
				 	delete network.devices.delete[k]
				 	let t = moment(network.devices.times[k]).fromNow()
				 	if(network._config.debug) console.log('[REDI:NETWORK-SCANNER] Device came back:',data[k],t)
					eventEmitter.emit('back',{
						ip: k,
						name: data[k],
						time: t
					})
				}
			}
			for( let k in network.devices.online ){
				if(!data.hasOwnProperty(k) && !network.devices.delete.hasOwnProperty(k)){
					let t = moment(network.devices.times[k]).fromNow()
				 	if(network._config.debug) console.log('[REDI:NETWORK-SCANNER] Device offline:',network.devices.online[k],t)
				 	eventEmitter.emit('lost',{
				 		ip: k,
				 		name: network.devices.online[k],
				 		time: t
				 	})
					network.devices.times[k] = network.time()
					network.devices.delete[k] = setTimeout(function(name){
						if(network._config.debug) console.log('[REDI:NETWORK-SCANNER] Device '+name+' not comming back.')
				 		eventEmitter.emit('offline',{
				 			ip: k,
				 			name: network.devices.online[k]
				 		})
						delete network.devices.online[name]
						delete network.devices.delete[name]
					},network._config.offlinetimeout*1000,k)
				}
			}
			setTimeout(network.check,network._config.scaninterval*1000)
		});
	},
	test: function(){
		let n = [];
		exec(['nmap -sn ',network._config.ip,'.0/24 | egrep \'scan report\' | awk \'{print $5}\''].join(''),function(err,data){
			data = data.split('\n')
			for( let i = 0; i < data.length; i++ ){
				console.log(data[i])
			}
			console.log('Check for matching strings, e.g. .fritz.box, thats your suffix.\nIn fact, it could be .'+data[0]+'!\nYou should remove .test() now.')
		})
	},
	scan: function(c){
		if(!network._config.test){
			exec(['nmap -sn ',network._config.ip,'.0/24 | egrep \'scan report\' | awk \'{print $5 $6}\''].join(''),function(err,data){
				data = data.split('\n')
				let d1 = {}
				for( let i = 0; i < data.length; i++ ){
					let d = data[i].split(network._config.suffix)
					if( d.length > 1 ){
						d1[d[1].replace('\(','').replace('\)','')] = d[0]
					}
				}
				c(d1)
			})
		}
	},
	getLocalIP: function(c){
		if(network._config.ip == ''){
			exec('hostname -I',function(err,data){
				if(!err){
					try{
						let ip = data.split('\n')[0].replace(' ','')
						c(ip.split('.').splice(0,3).join('.'),ip)
					}catch(e){
						eventEmitter.emit('error','Can\'t get local ip. Maybe set it fixed?')
					}
				}else eventEmitter.emit('error',err)
			})
		}else{
			let ip = network._config.ip
			c(ip.split('.').splice(0,3).join('.'),ip)
		}
	},
	init: function(data){
		if(typeof(data) == 'object'){
			for( let k in data ){
				if(network._config.hasOwnProperty(k)) network._config[k] = data[k]
			}
		}
		if(network._config.debug) console.log('[REDI:NETWORK-SCANNER]','init')
		network.getLocalIP(function(ip,full){
			if(network._config.debug) console.log('[REDI:NETWORK-SCANNER]','ip',full);
			network._config.ip = ip;
			if(data.hasOwnProperty('test')){
				if(data.test){
					network.test();
				}
			}
			network.scan(function(data){
				eventEmitter.emit('list',data);
				network.devices.online = data;
				for( let k in data ){
					network.devices.times[k] = network.time();
				}
				if(network._config.debug) console.log('[REDI:NETWORK-SCANNER]','Init. Found ',Object.keys(data).length,'items.');
				if(network._config.debug) console.log('[REDI:NETWORK-SCANNER]',data);
				network.check();
			});
		});
	}
}
module.exports = network
