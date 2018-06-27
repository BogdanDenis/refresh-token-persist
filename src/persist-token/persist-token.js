var StorageService = require('../storage-service/storage-service');
var HttpService = require('../http-service/http-service');
var persistConstants = require('./constants.js');
var requestConstants = require('../http-service/constants.js');

var PersistToken = (function() {
  var userConfig = {};
  var internalData = {};
  var defaultOptions = {
    resultHandleTypes: [persistConstants.RESULT_PROCESS_TYPES.SAVE],
  };
  var eventBindings = {};

  function saveResult(res) {
    var storageType = userConfig.storageType;
    var storageKey = userConfig.storageKey;
    var supportedTypes = persistConstants.STORAGE_TYPES;
    switch (storageType) {
      case supportedTypes.LOCAL_STORAGE:
        localStorage.setItem(storageKey, JSON.stringify(res));
        return;
      case supportedTypes.SESSION_STORAGE:
        sessionStorage.setItem(storageKey, JSON.stringify(res));
        return;
    }
  }

  function storageTypeIsSupported(storageType) {
    var keys = Object.keys(persistConstants.STORAGE_TYPES);
    var values = [];
    for (var i = 0; i < keys.length; i++) {
      values.push(persistConstants.STORAGE_TYPES[keys[i]]);
    }
    return values.indexOf(storageType) !== -1;
  }

  function userConfigIsValid(config) {
    if (!config.url) {
      throw new Error(persistConstants.ERROR_MESSAGES.NO_URL_PASSED);
    }
    if (!config.timeout) {
      throw new Error(persistConstants.ERROR_MESSAGES.NO_TIMEOUT_PASSED);
    }
    return true;
  }
  
  function loadData() {
    var loadedUserConfig = StorageService.getItem();
    var loadedInternalData = StorageService.getItem(true);
    if (!loadedUserConfig || !loadedInternalData ||
        !userConfigIsValid(loadedUserConfig) ||
        (loadedInternalData.status === persistConstants.REQUEST_STATUSES.FINISHED && !loadedUserConfig.recurring)) {
      return false;
    }
    var currentTime = new Date().getTime();
    var startTime = loadedInternalData.startTime;
    var timePassed = currentTime - startTime;
    var timeout = loadedUserConfig.timeout;
    var timeoutWithCorrection = timeout - timePassed;
    loadedInternalData.timeout = timeoutWithCorrection < 0 ? userConfig.timeout : timeoutWithCorrection;
    userConfig = Object.assign({}, defaultOptions, loadedUserConfig);
    internalData = Object.assign({}, loadedInternalData);
    return true;
  }

  function init() {
    if (loadData()) {
      _start();
    }
  }

  function saveData() {
    StorageService.setItem(userConfig);
    StorageService.setItem(internalData, true);
  }

  function create(options) {
    if (!options) {
      throw new Error(persistConstants.ERROR_MESSAGES.NO_OPTIONS);
    }
    if (!storageTypeIsSupported(options.storageType)) {
      throw new Error(persistConstants.ERROR_MESSAGES.WRONG_STORAGE_TYPE);
    }
    if (!options.storageKey) {
      throw new Error(persistConstants.ERROR_MESSAGES.NO_STORAGE_KEY);
    }
    userConfig = Object.assign({}, defaultOptions, options);
  }

  function saveFinishedOptions() {
    internalData = Object.assign(
      {},
      internalData,
      { status: persistConstants.REQUEST_STATUSES.FINISHED }
    );
    StorageService.setItem(internalData, true);
  }

  function shouldSaveToStorage() {
    return userConfig.resultHandleTypes.indexOf(persistConstants.RESULT_PROCESS_TYPES.SAVE) !== -1;
  }

  function shouldCallCallback() {
    return userConfig.resultHandleTypes.indexOf(persistConstants.RESULT_PROCESS_TYPES.CALLBACK) !== -1;
  }

  function onSuccess(res) {
    saveFinishedOptions();
    if (shouldSaveToStorage()) {
      saveResult(res);
    }
    if (shouldCallCallback()) {
      var callback = eventBindings[persistConstants.EVENTS.SUCCESS];
      if (!callback) {
        throw new Error(persistConstants.ERROR_MESSAGES.NO_CALLBACK(persistConstants.EVENTS.SUCCESS));
      }
      callback(res);
    }
  }

  function onFail(err) {
    saveFinishedOptions();
    if (shouldSaveToStorage()) {
      saveResult(err);
    }
    if (shouldCallCallback()) {
      var callback = eventBindings[persistConstants.EVENTS.FAIL];
      if (!callback) {
        throw new Error(persistConstants.ERROR_MESSAGES.NO_CALLBACK(persistConstants.EVENTS.FAIL));
      }
      callback(err);
    }
  }

  function _start() {
    if (!userConfigIsValid(userConfig)) {
      return;
    }

    setTimeout(function() {
      if (internalData.stopped) {
        return;
      }

      HttpService.create(userConfig);
      HttpService.on(requestConstants.EVENTS.SUCCESS, onSuccess);
      HttpService.on(requestConstants.EVENTS.FAIL, onFail);
      HttpService.start();

      if (userConfig.recurring) {
        _start();
      }
    }, internalData.timeout);

    internalData = Object.assign(
      {},
      internalData,
      {
        startTime: new Date().getTime(),
        status: persistConstants.REQUEST_STATUSES.OPEN,
        timeout: userConfig.timeout,
      }
    );
  };
	
	function start() {
	  internalData = Object.assign(
      {},
      internalData,
      { stopped: false }
    );
	  _start();
	}

	function isEventTypeValid(event) {
    var keys = Object.keys(persistConstants.EVENTS);
    var values = [];
    for (var i = 0; i < keys.length; i++) {
      values.push(persistConstants.EVENTS[keys[i]]);
    }
	  return values.indexOf(event) !== -1;
  }

	function on(event, callback) {
    if (!isEventTypeValid(event)) {
      throw new Error(persistConstants.ERROR_MESSAGES.WRONG_EVENT_TYPE);
    }
    if (typeof callback !== 'function') {
      throw new Error(persistConstants.ERROR_MESSAGES.NOT_A_FUNCTION);
    }
    eventBindings[event] = callback;
  }

	function stop() {
	  internalData = Object.assign(
      {},
      internalData,
      { stopped: true }
    );
  }

  window.addEventListener('load', init);
  window.addEventListener('beforeunload', saveData);

	return {
    create: create,
    start: start,
    on: on,
    stop: stop,
  };
}());

module.exports = {
  PersistToken: PersistToken,
  STORAGE_TYPES: persistConstants.STORAGE_TYPES,
  EVENTS: persistConstants.EVENTS,
  RESULT_PROCESS_TYPE: persistConstants.RESULT_PROCESS_TYPES,
};
