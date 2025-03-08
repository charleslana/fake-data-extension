function createContextMenus() {
	chrome.contextMenus.removeAll(() => {
		chrome.contextMenus.create({
			id: 'fakerDataMenu',
			title: 'Faker Data',
			contexts: ['editable']
		});

		chrome.contextMenus.create({
			id: 'fillFocused',
			parentId: 'fakerDataMenu',
			title: 'Preencher campo focado (Ctrl+Shift+F)',
			contexts: ['editable']
		});

		chrome.contextMenus.create({
			id: 'fillAll',
			parentId: 'fakerDataMenu',
			title: 'Preencher todos os campos (Ctrl+Shift+Y)',
			contexts: ['editable']
		});
	});
}

chrome.runtime.onInstalled.addListener(() => {
	createContextMenus();
});

chrome.runtime.onStartup.addListener(() => {
	createContextMenus();
});

chrome.contextMenus.onClicked.addListener(async (info, tab) => {
	if (info.menuItemId === 'fillFocused') {
		await chrome.scripting.executeScript({
			target: { tabId: tab!.id! },
			files: ['dist/content.js']
		});
		await chrome.scripting.executeScript({
			target: { tabId: tab!.id! },
			func: () => {
				(window as any).fillFocusedInput();
			}
		});
	} else if (info.menuItemId === 'fillAll') {
		await chrome.scripting.executeScript({
			target: { tabId: tab!.id! },
			files: ['dist/content.js']
		});
		await chrome.scripting.executeScript({
			target: { tabId: tab!.id! },
			func: () => {
				(window as any).fillAllInputs();
				(window as any).fillAllSelects();
				(window as any).fillAllCheckboxes();
			}
		});
	}
});

chrome.commands.onCommand.addListener((command) => {
	chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
		if (!tabs[0].id) return;

		if (command === 'fill-focused') {
			await chrome.scripting.executeScript({
				target: { tabId: tabs[0].id },
				func: () => {
					(window as any).fillFocusedInput();
				}
			});
		} else if (command === 'fill-all') {
			await chrome.scripting.executeScript({
				target: { tabId: tabs[0].id },
				func: () => {
					(window as any).fillAllInputs();
					(window as any).fillAllSelects();
					(window as any).fillAllCheckboxes();
				}
			});
		}
	});
});

chrome.runtime.onMessage.addListener(async (message) => {
	if (message.type === 'updateIcon') {
		const iconPath = message.isDarkMode
			? {
				16: chrome.runtime.getURL('icons/icon16-dark.png'),
				48: chrome.runtime.getURL('icons/icon48-dark.png'),
				128: chrome.runtime.getURL('icons/icon128-dark.png')
			}
			: {
				16: chrome.runtime.getURL('icons/icon16.png'),
				48: chrome.runtime.getURL('icons/icon48.png'),
				128: chrome.runtime.getURL('icons/icon128.png')
			};

		await chrome.action.setIcon({ path: iconPath });
	}
});
