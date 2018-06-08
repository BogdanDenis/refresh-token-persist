const constants = require('./constants');

const HttpService = (function() {
	const defaultConfig = {
		url: '',
		method: constants.METHODS.GET,
		headers: null,
		body: null,
	};

	let eventBindings = {};
	let mergedConfig;
	let req = null;

	const isEventTypeValid = (event) => {
		return Object.values(constants.EVENTS).indexOf(event) !== -1;
	};

	const checkCallbacksExist = () => {
		Object.keys(eventBindings).forEach((key) => {
			if (!eventBindings[key]) {
				console.warn(`Event listener of type ${key} was not spicified!`);
			}
		});
	};

	const readyStateChangeListener = function() {
		if (req.readyState === 4) {
			if (req.status >= 200 && req.status < 300) {
				const successCallback = eventBindings[constants.EVENTS.SUCCESS];
				if (successCallback) {
				  const res = {
				    code: req.status,
            response: req.response,
          };
					successCallback(res);
				}
			} else if (req.status >= 400) {
				const failCallback = eventBindings[constants.EVENTS.FAIL];
				if (failCallback) {
				  const err = {
				    code: req.status,
            response: req.response,
          };
					failCallback(err);
				}
			}
		}
	};

	const create = (config) => {
		mergedConfig = Object.assign({}, defaultConfig, config);

		req = new XMLHttpRequest();
		req.responseType = 'json';
		req.onreadystatechange = readyStateChangeListener;
		req.open(mergedConfig.method, mergedConfig.url);
		if (!mergedConfig.headers) {
			return;
		}
		Object.keys(mergedConfig.headers).forEach((key) => {
			const val = mergedConfig.headers[key];
			req.setRequestHeader(key, val);
		});
	};

	const start = () => {
    checkCallbacksExist();
    req.send(mergedConfig.body);
	};

	const on = (event, callback) => {
		if (!isEventTypeValid(event)) {
			throw new Error('Given event type is not supported. Please, check docs for a list of event types');
		}
		if (typeof callback !== 'function') {
			throw new Error(`Second parameter must have a 'function' type!`);
		}
		eventBindings[event] = callback;
	};

	return {
		create,
		start,
		on,
	};
}());

module.exports = HttpService;
