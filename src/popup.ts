document.getElementById('fillForm')!.addEventListener('click', () => {
    chrome.tabs.query({active: true, currentWindow: true}, async (tabs) => {
        await chrome.scripting.executeScript({
            target: {tabId: tabs[0].id!},
            files: ['dist/content.js']
        });
        await chrome.scripting.executeScript({
            target: {tabId: tabs[0].id!},
            func: () => {
                (window as any).fillAllInputs();
                (window as any).fillAllSelects();
                (window as any).fillAllCheckboxes();
                (window as any).fillAllRadios();
            }
        });
    });
});

document.getElementById('openSettings')!.addEventListener('click', async () => {
    await chrome.runtime.openOptionsPage();
});
