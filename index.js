const CDP = require('chrome-remote-interface');

CDP((client) => {
  const {Network, Page} = client;

  Network.requestWillBeSent((params) => {
    console.log(params.request.url);
  });
  Page.loadEventFired(() => {
    client.close();
  });

  Promise.all([
    Network.enable(),
    Page.enable()
  ]).then(() => {
    return Page.navigate({url: 'https://github.com'});
  }).catch((err) => {
    console.error(`Error: ${err.message}`);
    client.close();
  });
}).on('error', (err) => {
  console.error('Cannot connect to remote endpoint:', err);
});