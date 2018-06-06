const CDP = require('chrome-remote-interface');
const fs = require('fs');

CDP(async (client) => {
  try {
    const {Page, Tracing} = client;
    await Page.enable();

    const events = [];
    Tracing.dataCollected(({value}) => {
      events.push(...value);
    });

    await Tracing.start();
    await Page.navigate({url: 'https://github.com'});
    await Page.loadEventFired();
    await Tracing.end();
    await Tracing.tracingComplete();

    fs.writeFileSync('timeline.json', JSON.stringify(events));
  } catch (err) {
    console.error(err);
  } finally {
    await client.close();
  }
}).on('error', (err) => {
  console.error(err);
});