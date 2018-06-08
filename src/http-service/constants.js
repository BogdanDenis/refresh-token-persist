const METHODS = {
	GET: 'GET',
	POST: 'POST',
};

const EVENTS = {
	SUCCESS: 'success',
	FAIL: 'fail',
};

const DEFAULT_CONFIG = {
  url: '',
  method: METHODS.GET,
  headers: null,
  body: null,
};

const ERROR_MESSAGES = {
  EVENT_NOT_SUPPORTED: 'Given event type is not supported. Please, check docs for a list of event types',
  CALLBACK_IS_NOT_A_FUNCTION: 'Second parameter must have a \'function\' type!',
};

module.exports = {
	METHODS: METHODS,
	EVENTS: EVENTS,
  DEFAULT_CONFIG,
  ERROR_MESSAGES,
};
