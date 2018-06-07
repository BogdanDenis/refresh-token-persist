const StorageService = (function() {
	const USER_STORAGE_KEY = '__TOKEN__STORAGE__PERSIST__USER__';
	const INTERNAL_STORAGE_KEY = '__TOKEN__STORAGE__PERSIST__INTERNAL__';

	const getItem = (internal) => {
		const storage = localStorage.getItem(internal ? INTERNAL_STORAGE_KEY : USER_STORAGE_KEY);
		return storage ? JSON.parse(storage) : null;
	};

	const setItem = (item, internal) => {
		localStorage.setItem(internal ? INTERNAL_STORAGE_KEY : USER_STORAGE_KEY, JSON.stringify(item));
	};

	const removeItem = (internal) => {
		localStorage.removeItem(internal ? INTERNAL_STORAGE_KEY : USER_STORAGE_KEY);
	};

	return {
		getItem,
		setItem,
		removeItem,
	};
}());

module.exports = StorageService;
