const startButton = document.querySelector('#start');
const endButton = document.querySelector('#end');

startButton.addEventListener('click', async () => {
  const tab = await getCurrentTab();
  chrome.tabs.sendMessage(tab.id, {"message": "start"});
});

endButton.addEventListener('click', async () => {
  const tab = await getCurrentTab();
  chrome.tabs.sendMessage(tab.id, {"message": "end"});
});

const getCurrentTab = async () => {
  const queryOptions = { url: ["https://www.tiktok.com/*"] };
  const tabs = await chrome.tabs.query(queryOptions);
  const activeTabs = tabs.filter((t) => t.active === true)
  return activeTabs.length > 0 ? activeTabs[0] : tabs[0];
}