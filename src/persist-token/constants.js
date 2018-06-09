const REQUEST_STATUSES = {
  OPEN: 'OPEN',
  FINISHED: 'FINISHED',
};

const STORAGE_TYPES = {
  LOCAL_STORAGE: 'localStorage',
  SESSION_STORAGE: 'sessionStorage',
};

const EVENTS = {
  SUCCESS: 'success',
  FAIL: 'fail',
};

const RESULT_PROCESS_TYPE = {
  SAVE: 'save',
  CALLBACK: 'callback',
};

const ERROR_MESSAGES = {
  NO_OPTIONS: 'No options were passed as argument!',
  WRONG_STORAGE_TYPE: 'Given storage type is not supported! Please check docs for a list of supported storage types.',
  NO_STORAGE_KEY: 'No key for storage was given!',
  NO_CALLBACK: (event) => `Result handle type '${RESULT_PROCESS_TYPE.CALLBACK}'
    was given but no '${event}' callback was specified!`,
  WRONG_EVENT_TYPE: 'Given event type is not supported. Please, check docs for a list of event types',
  NOT_A_FUNCTION: `Second parameter must have a 'function' type!`,
  NO_URL_PASSED: 'Url is undefined or null!',
  NO_TIMEOUT_PASSED: 'Timeout is undefined or null!',
};

module.exports = {
  REQUEST_STATUSES,
  STORAGE_TYPES,
  EVENTS,
  RESULT_PROCESS_TYPE,
  ERROR_MESSAGES,
};

