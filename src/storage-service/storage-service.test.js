const sinon = require('sinon');

const constants = require('./constants');
const StorageService = require('./storage-service');

global.localStorage = {
  getItem: sinon.spy(),
  setItem: sinon.spy(),
  removeItem: sinon.spy(),
};

describe('(Service) StorageService', () => {
  afterEach(() => {
    global.localStorage.getItem.resetHistory();
    global.localStorage.setItem.resetHistory();
    global.localStorage.removeItem.resetHistory();
  });

  it('should save passed data to user storage', () => {
    const item = { a: 1 };
    StorageService.setItem(item);
    expect(global.localStorage.setItem.firstCall.args)
      .toEqual([constants.USER_STORAGE_KEY, JSON.stringify(item)]);
  });

  it('should save passed data to internal storage', () => {
    const item = { a: 1 };
    StorageService.setItem(item, true);
    expect(global.localStorage.setItem.firstCall.args)
      .toEqual([constants.INTERNAL_STORAGE_KEY, JSON.stringify(item)]);
  });

  it('should get item from user storage', () => {
    StorageService.getItem();
    expect(global.localStorage.getItem.firstCall.args).toEqual([constants.USER_STORAGE_KEY]);
  });

  it('should get item from internal storage', () => {
    StorageService.getItem(true);
    expect(global.localStorage.getItem.firstCall.args).toEqual([constants.INTERNAL_STORAGE_KEY]);
  });

  it('should remove item from user storage', () => {
    StorageService.removeItem();
    expect(global.localStorage.removeItem.firstCall.args).toEqual([constants.USER_STORAGE_KEY]);
  });

  it('should remove item from internal storage', () => {
    StorageService.removeItem(true);
    expect(global.localStorage.removeItem.firstCall.args).toEqual([constants.INTERNAL_STORAGE_KEY]);
  });
});
