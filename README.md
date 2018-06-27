# Keep It Refreshed
Keep It Refreshed is a library that provides a way to keep sending refresh token requests even after page reload.

## Dependencies
None

## Installation
For browserify, use ```npm install keep-it-refreshed ```.

## Usage
 ```javascript
 var KeepItRefreshed = require('keep-it-refreshed');

 KeepItRefreshed.PersistToken.create({
   url: 'some url',
   method: 'GET',
   headers = { ... },
   body: 'some data',
   storageType: KeepItRefreshed.STORAGE_TYPES.LOCAL_STORAGE,
   storageKey: 'key',
   resultHandleTypes: [
	   KeepItRefreshed.RESULT_PROCESS_TYPES.SAVE,
	   KeepItRefreshed.RESULT_PROCESS_TYPES.CALLBACK,
   ],
   timeout: 300000 // time in ms to send request in
   recurring: true, // try same request after previous one has finished
 });

 KeepItRefreshed.PersistToken.on(KeepItRefreshed.EVENTS.SUCCESS, function(res) { ... });
 KeepItRefreshed.PersistToken.on(KeepItRefreshed.EVENTS.FAIL, function(err) { ... });

 KeepItRefreshed.PersistToken.start();
```

## API

### ```create(options)```

Initializes PersistToken with passed options

#### Arguments

* ```options``` (Object): An object that holds parameters
Parameters:
   * url (string): Url to send a request to.

   * method (string): HTTP method.

      Default: ```'GET'```.

   * headers (Object): HTTP headers.

   * body (string): Request body.

      **PersistToken does not modify the given body in any way**
   * timeout (number): Time in milliseconds, after which PersistToken will send an HTTP request.
   * storageType (STORAGE_TYPES): Type of storage request response will be saved in.

      *Available types:*
      - ```LOCAL_STORAGE```
      - ```SESSION_STORAGE```
   * storageKey (string): A key, under which request response will be saved in a specified by ```storageType``` storage.
   * resultHandleTypes (Array[RESULT_PROCESS_TYPES]): Parameter to specify how request result will be handled.

      *Available types:*
      - ```SAVE```: save response to storage
      - ```CALLBACK```: call an added callback with response

      Default: ```[SAVE]```.
   * recurring (bool): If set to ```true```, then after a request finishes the same request will be sent again.

### ```on(event, callback)```

Adds a callback for event

#### Arguments

* ```event``` (EVENTS): Name of event.

   *Available events:*
   - ```SUCCESS```: function (result) - Raised after a successful request (status in 200 range).
   - ```FAIL```: function (error) - Raised after a failed request (status >= 400).
* ```callback``` (function): Callback function.

**Callbacks, added via ```on()``` will NOT be re-added after page refresh.
   Unfortunately, if you want to use callbacks, you will have to add them during app initialization.
   Sorry :(**

### ```start()```

Starts a request.

### ```stop()```

Stops sending requests. You can start sending requests with the same configuration again by calling ```start()```.

## Author

Denys Bohdan denys.bohdan123@gmail.com

## Support

If you find any problems with this module, please feel free to email / [open issue](https://github.com/BogdanDenis/refresh-token-persist/issues/new) on GitHub.
It will greatly help me to improve it.
