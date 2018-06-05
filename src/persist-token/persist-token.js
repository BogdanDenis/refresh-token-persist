const StorageService = require('../storage-service/storage-service');
const HttpService = require('../http-service/http-service');
const persistConstants = require('./constants.js');
const requestConstants = require('../http-service/constants.js');

const PersistToken = (function() {
  let savedOptions = null;
  const eventBindings = {};

  const saveResult = (res) => {
    const storageType = savedOptions.storageType;
    const storageKey = savedOptions.storageKey;
    const supportedTypes = persistConstants.STORAGE_TYPES;
    switch (storageType) {
      case supportedTypes.LOCAL_STORAGE:
        localStorage.setItem(storageKey, JSON.stringify(res));
        return;
      case supportedTypes.SESSION_STORAGE:
        sessionStorage.setItem(storageKey, JSON.stringify(res));
        return;
    }
  };

  const storageTypeIsSupported = (storageType) => {
    return Object.keys(persistConstants.STORAGE_TYPES).find(key =>
      persistConstants.STORAGE_TYPES[key] === storageType) !== null;
  };
  
  const loadData = () => {
    const loadedData = StorageService.getItem();
    if (!loadedData || loadedData.status === persistConstants.REQUEST_STATUSES.FINISHED) {
      return;
    }
    const currentTime = new Date().getTime();
    const startTime = loadedData.startTime;
    const timePassed = currentTime - startTime;
    const timeout = loadedData.timeout;
    const timeoutWithCorrection = timeout - timePassed;
    loadedData.timeout = timeoutWithCorrection;
    savedOptions = Object.assign({}, loadedData);
    start();
  };

	const saveData = () => {
    StorageService.setItem(savedOptions);
  };

  const create = (options) => {
    if (!options) {
      throw new Error('No options were passed as argument!');
    }
    if (!storageTypeIsSupported(options.storageType)) {
      throw new Error('Given storage type is not supported! Please check docs for a list of supported storage types.');
    }
    if (!options.storageKey) {
      throw new Error('No key for storage was given!');
    }
    savedOptions = Object.assign({}, options);
  };

  const saveFinishedOptions = () => {
    savedOptions = Object.assign(
      {},
      savedOptions,
      { status: persistConstants.REQUEST_STATUSES.FINISHED },
    );
    StorageService.setItem(savedOptions);
  };

  const onSuccess = (res) => {
    saveFinishedOptions();
    saveResult(res);
    const callback = eventBindings[persistConstants.EVENTS.SUCCESS];
    if (callback) {
      callback(res);
    }
  };

  const onFail = (err) => {
    saveFinishedOptions();
    saveResult(err);
    const callback = eventBindings[persistConstants.EVENTS.FAIL];
    if (callback) {
      callback(err);
    }
  };
	
	const start = () => {
    savedOptions = Object.assign(
        {},
        savedOptions,
        {
          startTime: savedOptions.startTime || new Date().getTime(),
          status: persistConstants.REQUEST_STATUSES.OPEN,
        },
    );

    setTimeout(() => {
      HttpService.create(savedOptions);
      HttpService.on(requestConstants.EVENTS.SUCCESS, onSuccess);
      HttpService.on(requestConstants.EVENTS.FAIL, onFail);
      HttpService.start();

      if (savedOptions.recurring) {
        start();
      }
    }, savedOptions.timeout);
	};

	const isEventTypeValid = (event) =>
    Object.values(persistConstants.EVENTS).indexOf(event) !== -1;

	const on = (event, callback) => {
    if (!isEventTypeValid(event)) {
      throw new Error('Given event type is not supported. Please, check docs for a list of event types');
    }
    if (typeof callback !== 'function') {
      throw new Error(`Second parameter must have a 'function' type!`);
    }
    eventBindings[event] = callback;
  };

  window.addEventListener('load', loadData);
  window.addEventListener('beforeunload', saveData);

	return {
    create,
    start,
    on,
  };
}());

module.exports = PersistToken;
