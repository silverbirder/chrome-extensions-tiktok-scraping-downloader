let _cacheUrl = '';

const handleWebRequest = async (details) => {
    if (!/item_list/.test(details.url)) return;
    if (_cacheUrl === details.url) return;
    const tab = await getCurrentTab();
    console.log(`post ${details.url}`);
    chrome.tabs.sendMessage(tab.id, details, (response) => { });
    _cacheUrl = details.url;
};

const initStorage = async () => {
    const storageValue = await chrome.storage.sync.get(['ts']);
    if (storageValue.ts !== undefined) return;
    const value = { url: "http://localhost:3000", interval: 1000, started: false };
    await chrome.storage.sync.set({ ts: value });
};

const getCurrentTab = async () => {
    const queryOptions = { url: ["https://www.tiktok.com/*"] };
    const tabs = await chrome.tabs.query(queryOptions);
    const activeTabs = tabs.filter((t) => t.active === true)
    return activeTabs.length > 0 ? activeTabs[0] : tabs[0];
}

chrome.runtime.onInstalled.addListener(async () => {
    chrome.webRequest.onCompleted.addListener(handleWebRequest, { urls: ["https://www.tiktok.com/*", "https://t.tiktok.com/*"] })
    await initStorage();
});

chrome.action.onClicked.addListener(
    async () => {
        const storage = await chrome.storage.sync.get(['ts']);
        const ts = storage.ts;
        const tab = await getCurrentTab();
        if (ts.started) {
            ts.started = false;
            chrome.action.setBadgeText({ text: '' });
            chrome.tabs.sendMessage(tab.id, { "message": "end" });
        } else {
            ts.started = true;
            chrome.action.setBadgeText({ text: 'ON' });
            chrome.tabs.sendMessage(tab.id, { "message": "start" });
        }
        await chrome.storage.sync.set({ ts: ts });
    }
)