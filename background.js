let _cacheUrl = '';
chrome.runtime.onInstalled.addListener(() => {
    chrome.webRequest.onCompleted.addListener(
        async (details) => {
            if (!/item_list/.test(details.url)) {
                return;
            }
            console.log('found item_list request');
            console.log(details.url);
            if (_cacheUrl === details.url) {
                console.log('cached! details.url');
                return;
            }
            const tab = await getCurrentTab();
            // バックグラウンドからコンテンツスクリプトに送信するためにはタブ経由である必要がある
            chrome.tabs.sendMessage(tab.id, details, (response) => { });
            // コンテンツスクリプトから同じurlでfetchしてループするので、キャッシュし弾くようにする。
            _cacheUrl = details.url;
        },
        {
            urls: [
                "https://www.tiktok.com/*"
            ]
        },
        // 必要ないけど、色々ヘッダーつくので追加
        ["responseHeaders"]
    );
});

const getCurrentTab = async () => {
    const queryOptions = { url: ["https://www.tiktok.com/*"] };
    const tabs = await chrome.tabs.query(queryOptions);
    const activeTabs = tabs.filter((t) => t.active === true)
    return activeTabs.length > 0 ? activeTabs[0] : tabs[0];
}