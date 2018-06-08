const sinon = require('sinon');

const constants = require('./constants');
const HttpService = require('./http-service');

const reqStub = {
  open: sinon.spy(),
  setRequestHeader: sinon.spy(),
  send: sinon.spy(),
};

global.XMLHttpRequest = function() {
  return reqStub;
};

describe('(Service) HttpService', () => {
  afterEach(() => {
    reqStub.open.resetHistory();
    reqStub.setRequestHeader.resetHistory();
    reqStub.send.resetHistory();
  });

  it('should create XmlHttpRequest object with default properties', () => {
    HttpService.create();

    expect(reqStub.open.firstCall.args).toEqual([constants.DEFAULT_CONFIG.method, constants.DEFAULT_CONFIG.url]);
  });

  it('should create XmlHttpRequest object with overridden properties', () => {
    const config = {
      url: 'testurl',
      method: constants.METHODS.POST,
    };
    HttpService.create(config);

    expect(reqStub.open.firstCall.args).toEqual([config.method, config.url]);
  });

  it('should add headers to request', () => {
    const key = 'Content-Type';
    const value = 'application/json';
    const config = {
      headers: {},
    };
    config.headers[key] = value;

    HttpService.create(config);

    expect(reqStub.setRequestHeader.firstCall.args).toEqual([key, value]);
  });

  it('should start request', () => {
    const config = {
      body: 'data',
    };

    HttpService.create(config);
    HttpService.start();

    expect(reqStub.send.firstCall.args).toEqual([config.body]);
  });

  it(`should throw 'event not supported' error`, () => {
    expect(() => HttpService.on('wrong')).toThrow(constants.ERROR_MESSAGES.EVENT_NOT_SUPPORTED);
  });

  it(`should throw 'not a function' error`, () => {
    expect(() => HttpService.on(constants.EVENTS.SUCCESS, ''))
      .toThrow(constants.ERROR_MESSAGES.CALLBACK_IS_NOT_A_FUNCTION);
  });

  it('should exit without an error', () => {
    expect(() => HttpService.on(constants.EVENTS.SUCCESS, () => {})).not.toThrow();
  });

  it('should call success callback', () => {
    reqStub.readyState = 4;
    reqStub.status = 200;
    reqStub.response = 'resp';
    const successSpy = sinon.spy();
    HttpService.on(constants.EVENTS.SUCCESS, successSpy);

    reqStub.onreadystatechange();

    expect(successSpy.firstCall.args).toMatchObject([{ code: 200, response: 'resp' }]);
  });

  it('should call fail callback', () => {
    reqStub.readyState = 4;
    reqStub.status = 404;
    reqStub.response = 'resp';
    const failSpy = sinon.spy();
    HttpService.on(constants.EVENTS.FAIL, failSpy);

    reqStub.onreadystatechange();

    expect(failSpy.firstCall.args).toMatchObject([{ code: 404, response: 'resp' }]);
  });
});
