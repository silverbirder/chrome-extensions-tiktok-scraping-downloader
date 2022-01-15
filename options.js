const button = document.querySelector('#save');
button.addEventListener('click', () => {
  const url = document.querySelector('#url').value;
  chrome.storage.sync.set({ url });
});