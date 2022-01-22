const handleOnMessage = async (request, sender, sendResponse) => {
    if (request.message === 'start') {
        start();
        sendResponse();
    } else if (request.message === 'end') {
        end();
        sendResponse();
    } else if (request.url) {
        const storage = await chrome.storage.sync.get(['ts']);
        if (storage.ts.started === false) return;
        fetch(request.url).then((r) => {
            r.json().then((json) => {
                console.log('process from background');
                process(json.itemList);
                sendResponse();
            });
        });
    }
    return true;
};

const handleWindowMessage = async (event) => {
    if (event.data.type && event.data.type == "FROM_PAGE") {
        const storage = await chrome.storage.sync.get(['ts']);
        if (storage.ts.started === false) return;
        const details = event.data.details;
        console.log('process from web_accessible_resources');
        process(Object.values(details));
    }
};

const injectScript = (filePath, tag) => {
    var node = document.getElementsByTagName(tag)[0];
    var script = document.createElement('script');
    script.setAttribute('type', 'text/javascript');
    script.setAttribute('src', filePath);
    script.setAttribute('id', 'inject');
    node.appendChild(script);
}

const removeInjectScript = () => {
    const scriptElement = document.querySelector('#inject');
    if (!scriptElement) return;
    scriptElement.remove();
};

const process = (items) => {
    Promise.all(items.map(async (i) => {
        const storage = await chrome.storage.sync.get('ts');
        const url = storage.ts.url;
        return fetch(url, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 'data': i })
        })
    }))
};

const scrollToBottom = async (event) => {
    document.scrollingElement.scrollBy(0, document.scrollingElement.scrollHeight)
};

const start = () => {
    window.addEventListener('message', handleWindowMessage);
    window.addEventListener('scroll', scrollToBottom);
    injectScript(chrome.runtime.getURL('web_accessible_resources.js'), 'body');
}

const end = () => {
    window.removeEventListener('message', handleWindowMessage);
    window.removeEventListener('scroll', scrollToBottom);
    removeInjectScript();
};

chrome.runtime.onMessage.addListener(handleOnMessage);

(async () => {
    const storage = await chrome.storage.sync.get(['ts']);
    setInterval(() => {
        window.dispatchEvent(new Event('scroll'));
    }, storage.ts.interval);
})();