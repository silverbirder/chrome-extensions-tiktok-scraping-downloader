const button = document.querySelector('button');
// chrome.storage.sync.get("working", (data) => {
//   if (!data.working) {
//     chrome.storage.sync.set({ working: false });
//     button.innerText = "Start";
//   } else {
//     button.innerText = "Stop";
//   }
// });

function getTitle() {
  return document.title;
}

button.addEventListener('click', async () => {
  // chrome.storage.sync.get("working", (data) => {
  //   const changeWorkingStatus = !data.working;
  //   chrome.storage.sync.set({ working: changeWorkingStatus });
  //   button.innerText = changeWorkingStatus ? "Start" : "Stop";
  // });
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    function: getTitle
  },
    (a) => {
      alert(a);
    });
});
