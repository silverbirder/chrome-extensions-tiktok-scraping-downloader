// windowの変数にアクセスするには、web_accessible_resources経由の必要がある。
// @see  https://www.freecodecamp.org/news/chrome-extension-message-passing-essentials/
window.postMessage({ type: "FROM_PAGE", details: window["SIGI_STATE"].ItemModule })