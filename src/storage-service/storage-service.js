const constants = require('./constants');

const StorageService = (function() {
	const getItem = (internal) => {
		const storage = localStorage.getItem(internal ?
      constants.INTERNAL_STORAGE_KEY : constants.USER_STORAGE_KEY);
		return storage ? JSON.parse(storage) : null;
	};

	const setItem = (item, internal) => {
		localStorage.setItem(internal ?
      constants.INTERNAL_STORAGE_KEY : constants.USER_STORAGE_KEY, JSON.stringify(item));
	};

	const removeItem = (internal) => {
		localStorage.removeItem(internal ?
      constants.INTERNAL_STORAGE_KEY : constants.USER_STORAGE_KEY);
	};

	return {
		getItem,
		setItem,
		removeItem,
	};
}());

module.exports = StorageService;
