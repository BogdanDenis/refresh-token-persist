const PersistToken = require('../src/persist-token/persist-token');

const requestBtn = document.querySelector('#request-btn');

requestBtn.addEventListener('click', () => {
  const options = {
    url: 'https://nghttp2.org/httpbin/ip',
    method: 'GET',
    timeout: 2000,
    storageType: 'localStorage',
    storageKey: 'mykey',
  };

  PersistToken.create(options);
  PersistToken.start();
});
