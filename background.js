chrome.runtime.onInstalled.addListener(() => {
    console.log('Extension installed!');
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'runAnalysis') {
        console.log('Run Analysis action received in background script');
        
        chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
            chrome.tabs.sendMessage(tabs[0].id, {action: 'startAnalysis'}, (response) => {
                sendResponse(response);
            });
        });

        return true;
    }
});
