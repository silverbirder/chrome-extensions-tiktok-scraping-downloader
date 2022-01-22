const handleOnMessage = (request, sender, sendResponse) => {
    fetch(request.url).then((r) => {
        r.json().then((json) => {
            console.log('process from background');
            process(json.itemList);
            sendResponse();
        });
    });
    return true;
};

const handleWindowMessage = (event) => {
    if (event.data.type && event.data.type == "FROM_PAGE") {
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
        const urlStorage = await chrome.storage.sync.get('url');
        const url = urlStorage.url ? urlStorage.url : "http://localhost:3000";
        console.log(url);
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
    chrome.runtime.onMessage.addListener(handleOnMessage);
    window.addEventListener('message', handleWindowMessage);
    window.addEventListener('scroll', scrollToBottom);
    injectScript(chrome.runtime.getURL('web_accessible_resources.js'), 'body');
}

const end = () => {
    chrome.runtime.onMessage.removeListener(handleOnMessage);
    window.removeEventListener('message', handleWindowMessage);
    window.removeEventListener('scroll', scrollToBottom);
    removeInjectScript();
};

setInterval(() => {
    window.dispatchEvent(new Event('scroll'));
}, 1000);

const handleInitOnMessage = (request, sender, sendResponse) => {
    console.log(request);
    if (request.message === 'start') {
        start();
    } else {
        end();
    }
};

chrome.runtime.onMessage.addListener(handleInitOnMessage);