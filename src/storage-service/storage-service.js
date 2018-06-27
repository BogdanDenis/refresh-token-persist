var constants = require('./constants');

var StorageService = (function() {
	var getItem = function(internal) {
		var storage = localStorage.getItem(internal ?
      constants.INTERNAL_STORAGE_KEY : constants.USER_STORAGE_KEY);
		return storage ? JSON.parse(storage) : null;
	};

	var setItem = function(item, internal) {
		localStorage.setItem(internal ?
      constants.INTERNAL_STORAGE_KEY : constants.USER_STORAGE_KEY, JSON.stringify(item));
	};

	var removeItem = function(internal) {
		localStorage.removeItem(internal ?
      constants.INTERNAL_STORAGE_KEY : constants.USER_STORAGE_KEY);
	};

	return {
		getItem: getItem,
		setItem: setItem,
		removeItem: removeItem,
	};
}());

module.exports = StorageService;
