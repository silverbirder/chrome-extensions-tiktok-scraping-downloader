chrome.runtime.onMessage.addListener(
    async (request, sender, sendResponse) => {
        const json = await (await fetch(request.url)).json();
        process(json.itemList);
        sendResponse();
        return true;
    }
);

window.addEventListener('message', (event) => {
    if (event.data.type && event.data.type == "FROM_PAGE") {
        const details = event.data.details;
        process(Object.values(details));
    }
});

const injectScript = (filePath, tag) => {
    var node = document.getElementsByTagName(tag)[0];
    var script = document.createElement('script');
    script.setAttribute('type', 'text/javascript');
    script.setAttribute('src', filePath);
    node.appendChild(script);
}

const _sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const process = (items) => {
    Promise.all(items.map(async (i) => {
        return fetch("http://localhost:3000", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 'data': i })
        })
    }))
}

const scrollToBottom = async (distance = 100, delay = 400) => {
    while (document.scrollingElement.scrollTop + window.innerHeight < document.scrollingElement.scrollHeight) {
        document.scrollingElement.scrollBy(0, distance)
        await _sleep(delay);
    }
}

injectScript(chrome.runtime.getURL('web_accessible_resources.js'), 'body');

scrollToBottom();