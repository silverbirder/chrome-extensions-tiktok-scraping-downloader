const handleFromBackground = async (request, sender, sendResponse) => {
    if (request.message === 'start') {
        start();
        sendResponse();
    } else if (request.message === 'end') {
        end();
        sendResponse();
    } else if (request.data) {
        console.log(`process from ${request.from}`);
        process(request.data);
        sendResponse();
    }
    return true;
};

const handleFromWeb = async (event) => {
    if (event.data.from) {
        const storage = await chrome.storage.sync.get(['ts']);
        if (storage.ts.started === false) return;
        const data = event.data.data;
        console.log(`process from ${event.data.from}`);
        process(Object.values(data));
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

const process = async (items) => {
    const storage = await chrome.storage.sync.get(['ts']);
    if (storage.ts.started === false) return;
    console.log('Will post data is below.');
    console.log(items);
    const url = storage.ts.url;
    Promise.all(items.map(async (i) => {
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
    window.addEventListener('message', handleFromWeb);
    window.addEventListener('scroll', scrollToBottom);
    injectScript(chrome.runtime.getURL('web_accessible_resources.js'), 'body');
}

const end = () => {
    window.removeEventListener('message', handleFromWeb);
    window.removeEventListener('scroll', scrollToBottom);
    removeInjectScript();
};

chrome.runtime.onMessage.addListener(handleFromBackground);

(async () => {
    const storage = await chrome.storage.sync.get(['ts']);
    setInterval(() => {
        window.dispatchEvent(new Event('scroll'));
    }, storage.ts.interval);
})();