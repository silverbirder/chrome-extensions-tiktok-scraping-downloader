(async () => {
  document.querySelector('#save').addEventListener('click', async () => {
    const url = document.querySelector('#url').value;
    const interval = document.querySelector('#interval').value;
    const value = { url: url, interval: interval };
    await chrome.storage.sync.set({ ts: value });
    document.querySelector('#message').innerText = 'Saved!!!';
  });

  const storage = await chrome.storage.sync.get(['ts']);
  document.querySelector('#url').value = storage.ts.url;
  document.querySelector('#interval').value = storage.ts.interval;
})();