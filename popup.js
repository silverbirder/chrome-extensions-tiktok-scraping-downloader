const startButton = document.querySelector('#start');
const endButton = document.querySelector('#end');

startButton.addEventListener('click', async () => {
  const storage = await chrome.storage.sync.get(['ts']);
  const ts = storage.ts;
  ts['started'] = true;
  await chrome.storage.sync.set({ ts: ts });
  await updateButton();
  const tab = await getCurrentTab();
  chrome.tabs.sendMessage(tab.id, { "message": "start" });
});

endButton.addEventListener('click', async () => {
  const storage = await chrome.storage.sync.get(['ts']);
  const ts = storage.ts;
  ts['started'] = false;
  await chrome.storage.sync.set({ ts: ts });
  await updateButton();
  const tab = await getCurrentTab();
  chrome.tabs.sendMessage(tab.id, { "message": "end" });
});

const getCurrentTab = async () => {
  const queryOptions = { url: ["https://www.tiktok.com/*"] };
  const tabs = await chrome.tabs.query(queryOptions);
  const activeTabs = tabs.filter((t) => t.active === true)
  return activeTabs.length > 0 ? activeTabs[0] : tabs[0];
}

const updateButton = async () => {
  const storage = await chrome.storage.sync.get(['ts']);
  if (storage.ts.started) {
    endButton.removeAttribute('disabled');
    startButton.setAttribute('disabled', 'true');
  } else {
    endButton.setAttribute('disabled', 'true');
    startButton.removeAttribute('disabled');
  };
};

(async () => {
  await updateButton();
})();