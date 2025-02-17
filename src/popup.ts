document.getElementById('fillForm')!.addEventListener('click', () => {
	chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
		chrome.scripting.executeScript({
			target: { tabId: tabs[0].id! },
			files: ['dist/content.js'],
		});
		chrome.scripting.executeScript({
			target: { tabId: tabs[0]!.id! },
			func: () => {
				(window as any).fillAllInputs();
			},
		});
	});
});

document.getElementById('openSettings')!.addEventListener('click', () => {
	chrome.runtime.openOptionsPage();
});
