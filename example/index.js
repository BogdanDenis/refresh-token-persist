const KeepItRefreshed  = require('../index');
const PersistToken = KeepItRefreshed.PersistToken;

const startBtn = document.querySelector('#start-btn');
const stopBtn = document.querySelector('#stop-btn');

startBtn.addEventListener('click', () => {
  const options = {
    url: 'https://nghttp2.org/httpbin/ip',
    method: 'GET',
    timeout: 2000,
    storageType: KeepItRefreshed.STORAGE_TYPES.LOCAL_STORAGE,
    storageKey: 'mykey',
    resultHandleTypes: [
      KeepItRefreshed.RESULT_PROCESS_TYPE.SAVE,
      KeepItRefreshed.RESULT_PROCESS_TYPE.CALLBACK,
    ],
    recurring: true,
  };

  PersistToken.create(options);
  PersistToken.start();
  PersistToken.on(KeepItRefreshed.EVENTS.SUCCESS, (res) => {
    console.log('success', res);
  });
  PersistToken.on(KeepItRefreshed.EVENTS.FAIL, (err) => {
    console.log('fail', err);
  });
});

stopBtn.addEventListener('click', () => {
  PersistToken.stop();
});
