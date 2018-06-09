const sinon = require('sinon');

const constants = require('./constants');
const PersistToken = require('./persist-token');
const HttpService = require('../http-service/http-service');

jest.mock('../http-service/http-service.js', () => ({
	create: jest.fn(),
	on: jest.fn(),
	start: jest.fn(),
}));

global.localStorage = {
	getItem: sinon.spy(),
	setItem: sinon.spy(),
};


describe('PersistToken', () => {
	afterEach(() => {
		HttpService.create.mockReset();
		HttpService.on.mockReset();
		HttpService.start.mockReset();
	});

	it(`should throw 'no options' error`, () => {
		expect(() => PersistToken.create()).toThrow(constants.ERROR_MESSAGES.NO_OPTIONS);
	});

	it(`should throw 'storage type not supported' error`, () => {
		expect(() => PersistToken.create({ storageType: 'asd' })).toThrow(constants.ERROR_MESSAGES.WRONG_STORAGE_TYPE);
	});

	it(`should throw 'no storage key' error`, () => {
		expect(() => PersistToken.create({
			storageType: constants.STORAGE_TYPES.LOCAL_STORAGE,
		})).toThrow(constants.ERROR_MESSAGES.NO_STORAGE_KEY);
	});

	it('should return without an error', () => {
		expect(() => PersistToken.create({
			storageType: constants.STORAGE_TYPES.LOCAL_STORAGE,
			storageKey: '123',
		})).not.toThrow();
	});

	it(`should throw 'not url passed' error'`, () => {
		expect(() => PersistToken.start()).toThrow(constants.ERROR_MESSAGES.NO_URL_PASSED);
	});

	it(`should throw 'no timeout passed' error`, () => {
		PersistToken.create({
			storageType: constants.STORAGE_TYPES.LOCAL_STORAGE,
			storageKey: '123',
			url: 'asd',
		});
		expect(() => PersistToken.start()).toThrow(constants.ERROR_MESSAGES.NO_TIMEOUT_PASSED);
	});

	it('should start sending requests', (done) => {
		PersistToken.create({
			storageType: constants.STORAGE_TYPES.LOCAL_STORAGE,
			storageKey: '123',
			url: 'url',
			timeout: 100,
		});
		PersistToken.start();
		setTimeout(() => {
			expect(HttpService.start.mock.calls.length).toBe(1);
			done();
		});
	});

	it('should send correct number of requests for a specified interval', (done) => {
		PersistToken.create({
			storageType: constants.STORAGE_TYPES.LOCAL_STORAGE,
			storageKey: '123',
			url: 'url',
			timeout: 1000,
			recurring: true,
		});
		PersistToken.start();
		setTimeout(() => {
			expect(HttpService.start.mock.calls.length).toBe(3);
			done();
		}, 3000);
	});

	it('should stop sending requests', (done) => {
		PersistToken.create({
			storageType: constants.STORAGE_TYPES.LOCAL_STORAGE,
			storageKey: '123',
			url: 'url',
			timeout: 1000,
			recurring: true,
		});
		PersistToken.start();
		PersistToken.stop();
		setTimeout(() => {
			expect(HttpService.start.mock.calls.length).toBe(0);
			done();
		}, 1200);
	});

	it(`should throw 'wrong event type' error`, () => {
		expect(() => PersistToken.on()).toThrow(constants.ERROR_MESSAGES.WRONG_EVENT_TYPE);
	});

	it(`should throw 'not a function' error`, () => {
		expect(() => PersistToken.on(constants.EVENTS.FAIL, ''))
			.toThrow(constants.ERROR_MESSAGES.NOT_A_FUNCTION);
	});

	it('should return without an error', () => {
		expect(() => PersistToken.on(constants.EVENTS.SUCCESS, () => {})).not.toThrow();
	});
});
