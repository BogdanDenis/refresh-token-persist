# Persistent Token
Author: Denys Bohdan denys.bohdan123@gmail.com

Persistent Token is a library that provides a way to automatically keep access token refreshed and up to date.

## Dependencies
None
## Installation
For browserify, use ``npm install persistent-token ``,
## Usage
 ```javascript
 var PersistentToken = require('persistent-token');
 PersistentToken.create({
	url: 'some url',
	method: 'GET',
	headers = { ... },
	body: 'somedata',
	storageType: 'localStorage',
	storageKey: 'key',
	timeout: 300000 // time in ms to send request in
	recurring: true, // try same request after previous one has finished
 });
 PersistentToken.on('success', function(res) { ... });
 PersistentToken.on('fail', function(err) { ... });
 PersistentToken.start();
```

## Methods of PersistentToken Object
