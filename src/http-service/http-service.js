var constants = require('./constants');

var HttpService = (function() {
	var eventBindings = {};
  var mergedConfig;
  var req = null;

	function isEventTypeValid(event) {
		var keys = Object.keys(constants.EVENTS);
		var values = [];
		for (var i = 0; i < keys.length; i++) {
		  values.push(constants.EVENTS[keys[i]]);
    }
		return values.indexOf(event) !== -1;
	}

  function checkCallbacksExist() {
	  var keys = Object.keys(eventBindings);
	  for (var i = 0; i < keys.length; i++) {
			if (!eventBindings[keys[i]]) {
				console.warn('Event listener of type ' + keys[i] + ' was not specified!');
			}
		}
	}

  function readyStateChangeListener() {
		if (req.readyState === 4) {
			if (req.status >= 200 && req.status < 300) {
				var successCallback = eventBindings[constants.EVENTS.SUCCESS];
				if (successCallback) {
				  var res = {
				    code: req.status,
            response: req.response,
          };
					successCallback(res);
				}
			} else if (req.status >= 400) {
				var failCallback = eventBindings[constants.EVENTS.FAIL];
				if (failCallback) {
				  var err = {
				    code: req.status,
            response: req.response,
          };
					failCallback(err);
				}
			}
		}
	}

  function create(config) {
		mergedConfig = Object.assign({}, constants.DEFAULT_CONFIG, config);

		req = new XMLHttpRequest();
		req.responseType = 'json';
		req.onreadystatechange = readyStateChangeListener;
		req.open(mergedConfig.method, mergedConfig.url);
		if (!mergedConfig.headers) {
			return;
		}
		var keys = Object.keys(mergedConfig.headers);
		for (var i = 0; i < keys.length; i++) {
			var val = mergedConfig.headers[keys[i]];
			req.setRequestHeader(keys[i], val);
		}
	}

	function start() {
    checkCallbacksExist();
    req.send(mergedConfig.body);
	}

  function on(event, callback) {
		if (!isEventTypeValid(event)) {
			throw new Error(constants.ERROR_MESSAGES.EVENT_NOT_SUPPORTED);
		}
		if (typeof callback !== 'function') {
			throw new Error(constants.ERROR_MESSAGES.CALLBACK_IS_NOT_A_FUNCTION);
		}
		eventBindings[event] = callback;
	}

	return {
		create: create,
		start: start,
		on: on,
	};
}());

module.exports = HttpService;
