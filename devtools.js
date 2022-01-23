const getCurrentTab = async () => {
    const queryOptions = { url: ["https://www.tiktok.com/*"] };
    const tabs = await chrome.tabs.query(queryOptions);
    const activeTabs = tabs.filter((t) => t.active === true)
    return activeTabs.length > 0 ? activeTabs[0] : tabs[0];
}

chrome.devtools.network.onRequestFinished.addListener(
    (details) => {
        if (!/item_list/.test(details.request.url)) return;
        details.getContent(async (content, encoding) => {
            const j = JSON.parse(content);
            const tab = await getCurrentTab();
            console.log(`watch ${details.request.url}`);
            chrome.tabs.sendMessage(tab.id, { data: j.itemList, from: 'devtools.js' }, (response) => { });
        });
    }
);