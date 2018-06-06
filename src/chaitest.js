const chai = require('chai');
const fs = require('fs');
const CDP = require('chrome-remote-interface');

CDP(async (client) => {
  try{
    const {Network, Page, Memory} = client;
    Network.requestWillBeSent((params) => {
      console.log(params.request.url);
    });
    await Page.enable();
    await Network.enable();

    await Memory.startSampling();
    await Page.navigate({url: 'http://perked.co'});
    await Page.loadEventFired();
    await Memory.stopSampling();
    const sample = await Memory.getSamplingProfile();
    fs.writeFileSync('../profile.json', JSON.stringify(sample));
    console.log(JSON.stringify(sample));

  } catch (err) {
    console.error(err);
  } finally {
    await client.close();
  }

}).on('error', (err) => {
  console.error(err);
});