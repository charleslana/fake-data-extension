// document.getElementById('saveSettings')!.addEventListener('click', () => {
// 	const customDomain = (
// 		document.getElementById('customDomain') as HTMLInputElement
// 	).value;
// 	chrome.storage.sync.set({ customDomain }, () => {
// 		alert('Domínio salvo!');
// 	});
// });

document.addEventListener('DOMContentLoaded', () => {
	chrome.storage.sync.get(['customDomain', 'language'], (data) => {
		if (data.customDomain) {
			(document.getElementById('customDomain') as HTMLInputElement).value =
				data.customDomain;
		}
		if (data.language) {
			(document.getElementById('language') as HTMLSelectElement).value =
				data.language;
		}
	});
});

fetch(chrome.runtime.getURL('manifest.json'))
	.then((response) => response.json())
	.then((data) => {
		const versionElement = document.getElementById('version');
		if (versionElement) {
			versionElement.textContent = data.version;
		}
	})
	.catch((err) => console.error('Erro ao carregar versão do manifest:', err));

document.addEventListener('DOMContentLoaded', () => {
	chrome.storage.sync.get(['showPassword'], (data) => {
		const showPasswordCheckbox = document.getElementById('showPassword');
		if (showPasswordCheckbox && data.showPassword) {
			(showPasswordCheckbox as HTMLInputElement).checked = true;
		}
	});
});

document.getElementById('saveSettings')!.addEventListener('click', () => {
	const customDomain = (
		document.getElementById('customDomain') as HTMLInputElement
	).value;
	const showPassword = (
		document.getElementById('showPassword') as HTMLInputElement
	).checked;
	const language = (document.getElementById('language') as HTMLInputElement)
		.value;
	chrome.storage.sync.set({ customDomain, showPassword, language }, () => {
		alert('Configurações salva!');
	});
});
