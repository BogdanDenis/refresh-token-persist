const PersistToken = require('../src/persist-token/persist-token');

const startBtn = document.querySelector('#start-btn');
const stopBtn = document.querySelector('#stop-btn');

startBtn.addEventListener('click', () => {
  const options = {
    url: 'https://nghttp2.org/httpbin/ip',
    method: 'GET',
    timeout: 2000,
    storageType: 'localStorage',
    storageKey: 'mykey',
    recurring: true,
  };

  PersistToken.create(options);
  PersistToken.start();
});

stopBtn.addEventListener('click', () => {
  PersistToken.stop();
});
