// Inject script
const script = document.createElement("script")
script.src = chrome.runtime.getURL("check-in.js")
script.onload = () => script.remove()
document.head.appendChild(script)