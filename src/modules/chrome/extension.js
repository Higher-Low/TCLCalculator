chrome.action?.onClicked.addListener(async tab => {
  if (tab && tab.windowId !== undefined) {
    await chrome.sidePanel.open({ windowId: tab.windowId })
  }
})
