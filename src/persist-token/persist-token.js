const StorageService = require('../storage-service/storage-service');
const HttpService = require('../http-service/http-service');
const persistConstants = require('./constants.js');
const requestConstants = require('../http-service/constants.js');

const PersistToken = (function() {
  let userConfig = {};
  let internalData = {};
  const defaultOptions = {
    resultHandleTypes: [persistConstants.RESULT_PROCESS_TYPE.SAVE],
  };
  const eventBindings = {};

  const saveResult = (res) => {
    const storageType = userConfig.storageType;
    const storageKey = userConfig.storageKey;
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

  const userConfigIsValid = (config) => {
    const urlIsPassed = config.url && true;
    const timeoutIsPassed = config.timeout && true;
    return urlIsPassed && timeoutIsPassed;
  };
  
  const loadData = () => {
    const loadedUserConfig = StorageService.getItem();
    const loadedInternalData = StorageService.getItem(true);
    if (!loadedUserConfig || !loadedInternalData ||
        !userConfigIsValid(loadedUserConfig) ||
        (loadedInternalData.status === persistConstants.REQUEST_STATUSES.FINISHED && !loadedUserConfig.recurring)) {
      return;
    }
    const currentTime = new Date().getTime();
    const startTime = loadedInternalData.startTime;
    const timePassed = currentTime - startTime;
    const timeout = loadedUserConfig.timeout;
    const timeoutWithCorrection = timeout - timePassed;
    loadedInternalData.timeout = timeoutWithCorrection < 0 ? userConfig.timeout : timeoutWithCorrection;
    userConfig = Object.assign({}, defaultOptions, loadedUserConfig);
    internalData = Object.assign({}, loadedInternalData);
    _start();
  };

	const saveData = () => {
    StorageService.setItem(userConfig);
    StorageService.setItem(internalData, true);
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
    userConfig = Object.assign({}, defaultOptions, options);
  };

  const saveFinishedOptions = () => {
    internalData = Object.assign(
      {},
      internalData,
      { status: persistConstants.REQUEST_STATUSES.FINISHED },
    );
    StorageService.setItem(internalData, true);
  };

  const shouldSaveToStorage = () => {
    return userConfig.resultHandleTypes.indexOf(persistConstants.RESULT_PROCESS_TYPE.SAVE) !== -1;
  };

  const shouldCallCallback = () => {
    return userConfig.resultHandleTypes.indexOf(persistConstants.RESULT_PROCESS_TYPE.CALLBACK) !== -1;
  };

  const onSuccess = (res) => {
    saveFinishedOptions();
    if (shouldSaveToStorage()) {
      saveResult(res);
    }
    if (shouldCallCallback()) {
      const callback = eventBindings[persistConstants.EVENTS.SUCCESS];
      if (!callback) {
        throw new Error(`Result handle type '${persistConstants.RESULT_PROCESS_TYPE.CALLBACK}'
          was given but no '${persistConstants.EVENTS.SUCCESS}' callback was specified!`);
      }
      callback(res);
    }
  };

  const onFail = (err) => {
    saveFinishedOptions();
    if (shouldSaveToStorage()) {
      saveResult(err);
    }
    if (shouldCallCallback()) {
      const callback = eventBindings[persistConstants.EVENTS.FAIL];
      if (!callback) {
        throw new Error(`Result handle type '${persistConstants.RESULT_PROCESS_TYPE.CALLBACK}'
          was given but no '${persistConstants.EVENTS.FAIL}' callback was specified!`);
      }
      callback(err);
    }
  };

  const _start = () => {
    if (!userConfigIsValid(userConfig)) {
      return;
    }

    setTimeout(() => {
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
      },
    );
  };
	
	const start = () => {
	  internalData = Object.assign(
      {},
      internalData,
      { stopped: false },
    );
	  _start();
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

	const stop = () => {
	  internalData = Object.assign(
      {},
      internalData,
      { stopped: true },
    );
  };

  window.addEventListener('load', loadData);
  window.addEventListener('beforeunload', saveData);

	return {
    create,
    start,
    on,
    stop,
  };
}());

module.exports = PersistToken;
