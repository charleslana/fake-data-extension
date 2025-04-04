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
            title: 'Preencher aleatoriamente este campo (Ctrl+Shift+F)',
            contexts: ['editable']
        });

        chrome.contextMenus.create({
            id: 'fillAll',
            parentId: 'fakerDataMenu',
            title: 'Preencher todos os campos (Ctrl+Shift+Y)',
            contexts: ['editable']
        });

        chrome.contextMenus.create({
            id: 'fillCpf',
            parentId: 'fakerDataMenu',
            title: 'Preencher CPF (Ctrl+Shift+L)',
            contexts: ['editable']
        });

        chrome.contextMenus.create({
            id: 'fillPhone',
            parentId: 'fakerDataMenu',
            title: 'Preencher Telefone (Ctrl+Shift+H)',
            contexts: ['editable']
        });

        chrome.contextMenus.create({
            id: 'fillBirthdate',
            parentId: 'fakerDataMenu',
            title: 'Preencher Data de Nascimento',
            contexts: ['editable']
        });

        chrome.contextMenus.create({
            id: 'fillEmail',
            parentId: 'fakerDataMenu',
            title: 'Preencher E-mail',
            contexts: ['editable']
        });

        chrome.contextMenus.create({
            id: 'fillFullName',
            parentId: 'fakerDataMenu',
            title: 'Preencher Nome e Sobrenome',
            contexts: ['editable']
        });

        chrome.contextMenus.create({
            id: 'fillCep',
            parentId: 'fakerDataMenu',
            title: 'Preencher CEP',
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
            target: {tabId: tab!.id!},
            files: ['dist/content.js']
        });
        await chrome.scripting.executeScript({
            target: {tabId: tab!.id!},
            func: () => {
                (window as any).fillFocusedInput();
            }
        });
    } else if (info.menuItemId === 'fillAll') {
        await chrome.scripting.executeScript({
            target: {tabId: tab!.id!},
            files: ['dist/content.js']
        });
        await chrome.scripting.executeScript({
            target: {tabId: tab!.id!},
            func: () => {
                (window as any).fillAllInputs();
                (window as any).fillAllSelects();
                (window as any).fillAllCheckboxes();
                (window as any).fillAllRadios();
            }
        });
    } else if (info.menuItemId === 'fillCpf') {
        await chrome.scripting.executeScript({
            target: {tabId: tab!.id!},
            files: ['dist/content.js']
        });
        await chrome.scripting.executeScript({
            target: {tabId: tab!.id!},
            func: () => {
                (window as any).fillCpfInput();
            }
        });
    } else if (info.menuItemId === 'fillPhone') {
        await chrome.scripting.executeScript({
            target: {tabId: tab!.id!},
            files: ['dist/content.js']
        });
        await chrome.scripting.executeScript({
            target: {tabId: tab!.id!},
            func: () => {
                (window as any).fillPhoneInput();
            }
        });
    } else if (info.menuItemId === 'fillBirthdate') {
        await chrome.scripting.executeScript({
            target: {tabId: tab!.id!},
            files: ['dist/content.js']
        });
        await chrome.scripting.executeScript({
            target: {tabId: tab!.id!},
            func: () => {
                (window as any).fillBirthdateInput();
            }
        });
    } else if (info.menuItemId === 'fillEmail') {
        await chrome.scripting.executeScript({
            target: {tabId: tab!.id!},
            files: ['dist/content.js']
        });
        await chrome.scripting.executeScript({
            target: {tabId: tab!.id!},
            func: () => {
                (window as any).fillEmailInput();
            }
        });
    } else if (info.menuItemId === 'fillFullName') {
        await chrome.scripting.executeScript({
            target: {tabId: tab!.id!},
            files: ['dist/content.js']
        });
        await chrome.scripting.executeScript({
            target: {tabId: tab!.id!},
            func: () => {
                (window as any).fillFullNameInput();
            }
        });
    } else if (info.menuItemId === 'fillCep') {
        await chrome.scripting.executeScript({
            target: {tabId: tab!.id!},
            files: ['dist/content.js']
        });
        await chrome.scripting.executeScript({
            target: {tabId: tab!.id!},
            func: () => {
                (window as any).fillCepInput();
            }
        });
    }
});

chrome.commands.onCommand.addListener((command) => {
    chrome.tabs.query({active: true, currentWindow: true}, async (tabs) => {
        if (!tabs[0].id) return;

        if (command === 'fill-focused') {
            await chrome.scripting.executeScript({
                target: {tabId: tabs[0].id},
                func: () => {
                    (window as any).fillFocusedInput();
                }
            });
        } else if (command === 'fill-all') {
            await chrome.scripting.executeScript({
                target: {tabId: tabs[0].id},
                func: () => {
                    (window as any).fillAllInputs();
                    (window as any).fillAllSelects();
                    (window as any).fillAllCheckboxes();
                    (window as any).fillAllRadios();
                }
            });
        } else if (command === "fill-cpf") {
            await chrome.scripting.executeScript({
                target: {tabId: tabs[0].id},
                func: () => {
                    (window as any).fillCpfInput();
                }
            });
        } else if (command === "fill-phone") {
            await chrome.scripting.executeScript({
                target: {tabId: tabs[0].id},
                func: () => {
                    (window as any).fillPhoneInput();
                }
            });
        } else if (command === "fill-birthdate") {
            await chrome.scripting.executeScript({
                target: {tabId: tabs[0].id},
                func: () => {
                    (window as any).fillBirthdateInput();
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

        await chrome.action.setIcon({path: iconPath});
    }
});
