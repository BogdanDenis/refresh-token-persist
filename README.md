
# Persist Token  
Persist Token is a library that provides a way to automatically keep access token refreshed and up to date.  
  
## Dependencies  
None  
  
## Installation  
For browserify, use ```npm install persist-token ```.  
  
## Usage  
 ```javascript  
 var PersistToken = require('persist-token');  
 PersistToken.create({  
   url: 'some url',  
   method: 'GET',  
   headers = { ... },  
   body: 'somedata',  
   storageType: 'localStorage',  
   storageKey: 'key',  
   timeout: 300000 // time in ms to send request in  
   recurring: true, // try same request after previous one has finished  
 });  
  
 PersistToken.on('success', function(res) { ... });  
 PersistToken.on('fail', function(err) { ... });  
 PersistToken.start();  
```  
  
## API  
  
### ```create(options)```  
  
Initializes PersistToken with passed options  
  
#### Arguments  
  
* ```options``` (Object): An object that holds parameters  
Parameters:  
   * url (string): Url to send a request to.  
  
   * method (string): HTTP method.  
      Default: 'GET'.  
  
   * headers (Object): HTTP headers.  
  
   * body (string): Request body.  
  
      **PersistToken does not modify the given body in any way**  
   * timeout (number): Time in milliseconds, after which PersistToken will send a HTTP request.  
   * storageType (string): Type of storage request response will be saved in.  
  
      *Available types:*  
      - ```localStorage```  
      - ```sessionStorage```  
   * storageKey (string): A key, under which request response will be saved in a specified by ```storageType``` storage.
   * resultHandleTypes (Array[string]): Parameter to specify how request result will be handled.
		
		*Available types:*
		- ```'save'```: save response to storage
		- ```'callback'```: call an added callback with response
   * recurring (bool): If set to ```true```, then after a request finishes the same request will be sent again.  
  
### ```on(event, callback)```  
  
Adds a callback for event  
  
#### Arguments  
  
* ```event``` (string): Name of event.  
  
   *Available events:*  
   - ```'success'```: function (result) - Raised after a successful request (status in 200 range).  
   - ```'fail'```: function (error) - Raised after a failed request (status >= 400).  
* ```callback``` (function): Callback function.  
  
### ```start()```  
  
Starts a request.  
  
## Author  
  
Denys Bohdan denys.bohdan123@gmail.com  
  
## Support  
  
If you find any problems with this modules, please email / [open issue](https://github.com/BogdanDenis/refresh-token-persist/issues/new) on GitHub