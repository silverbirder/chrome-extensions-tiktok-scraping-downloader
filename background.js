let _cacheUrl = '';

const handleWebRequest = async (details) => {
    if (!/item_list/.test(details.url)) return;
    if (_cacheUrl === details.url) return;
    const tab = await getCurrentTab();
    console.log(`post ${details.url}`);
    chrome.tabs.sendMessage(tab.id, details, (response) => { });
    _cacheUrl = details.url;
};

chrome.runtime.onInstalled.addListener(() => {
    chrome.webRequest.onCompleted.addListener(handleWebRequest, { urls: ["https://www.tiktok.com/*"] })
});

const getCurrentTab = async () => {
    const queryOptions = { url: ["https://www.tiktok.com/*"] };
    const tabs = await chrome.tabs.query(queryOptions);
    const activeTabs = tabs.filter((t) => t.active === true)
    return activeTabs.length > 0 ? activeTabs[0] : tabs[0];
}