function createContextMenus() {
	chrome.contextMenus.removeAll(() => {
		chrome.contextMenus.create({
			id: 'fakerDataMenu',
			title: 'Faker Data',
			contexts: ['editable'],
		});

		chrome.contextMenus.create({
			id: 'fillFocused',
			parentId: 'fakerDataMenu',
			title: 'Preencher campo focado',
			contexts: ['editable'],
		});

		chrome.contextMenus.create({
			id: 'fillAll',
			parentId: 'fakerDataMenu',
			title: 'Preencher todos os campos',
			contexts: ['editable'],
		});
	});
}

chrome.runtime.onInstalled.addListener(() => {
	createContextMenus();
});

chrome.runtime.onStartup.addListener(() => {
	createContextMenus();
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
	if (info.menuItemId === 'fillFocused') {
		chrome.scripting.executeScript({
			target: { tabId: tab!.id! },
			files: ['dist/content.js'],
		});
		chrome.scripting.executeScript({
			target: { tabId: tab!.id! },
			func: () => {
				(window as any).fillFocusedInput();
			},
		});
	} else if (info.menuItemId === 'fillAll') {
		chrome.scripting.executeScript({
			target: { tabId: tab!.id! },
			files: ['dist/content.js'],
		});
		chrome.scripting.executeScript({
			target: { tabId: tab!.id! },
			func: () => {
				(window as any).fillAllInputs();
			},
		});
	}
});

chrome.commands.onCommand.addListener((command) => {
	chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
		if (!tabs[0].id) return;

		if (command === 'fill-focused') {
			chrome.scripting.executeScript({
				target: { tabId: tabs[0].id },
				func: () => (window as any).fillFocusedInput(),
			});
		} else if (command === 'fill-all') {
			chrome.scripting.executeScript({
				target: { tabId: tabs[0].id },
				func: () => (window as any).fillAllInputs(),
			});
		}
	});
});

chrome.runtime.onMessage.addListener((message) => {
	if (message.type === 'updateIcon') {
		const iconPath = message.isDarkMode
			? {
					16: chrome.runtime.getURL('icons/icon16-dark.png'),
					48: chrome.runtime.getURL('icons/icon48-dark.png'),
					128: chrome.runtime.getURL('icons/icon128-dark.png'),
			  }
			: {
					16: chrome.runtime.getURL('icons/icon16.png'),
					48: chrome.runtime.getURL('icons/icon48.png'),
					128: chrome.runtime.getURL('icons/icon128.png'),
			  };

		chrome.action.setIcon({ path: iconPath });
	}
});
