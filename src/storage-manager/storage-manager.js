const StorageService = (function() {
	const STORAGE_ITEM_KEY = '__TOKEN__STORAGE__PERSIST__';

	const getItem = () => {
		const storage = localStorage.getItem(STORAGE_ITEM_KEY);
		return storage ? JSON.parse(storage) : null;
	}

	const setItem = (item) => {
		localStorage.setItem(STORAGE_ITEM_KEY, JSON.stringify(item));
	}

	const removeItem = () => {
		localStorage.removeItem(STORAGE_ITEM_KEY);
	}

	return {
		getItem,
		setItem,
		removeItem,
	};
}());

module.exports = StorageService;
