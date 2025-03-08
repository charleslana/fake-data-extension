document.addEventListener('DOMContentLoaded', () => {
	chrome.storage.sync.get(
		[
			'customDomain',
			'showPassword',
			'language',
			'limitTextLength',
			'maxTextLength',
			'randomSelects',
			'autoCheckCheckboxes'
		],
		(data) => {
			const customDomainInput = document.getElementById(
				'customDomain'
			) as HTMLInputElement;
			const showPasswordCheckbox = document.getElementById(
				'showPassword'
			) as HTMLInputElement;
			const languageSelect = document.getElementById(
				'language'
			) as HTMLSelectElement;
			const limitTextLengthCheckbox = document.getElementById(
				'limitTextLength'
			) as HTMLInputElement;
			const maxTextLengthInput = document.getElementById(
				'maxTextLength'
			) as HTMLInputElement;
			const randomSelectsCheckbox = document.getElementById(
				'randomSelects'
			) as HTMLInputElement;
			const autoCheckCheckboxesCheckbox = document.getElementById(
				'autoCheckCheckboxes'
			) as HTMLInputElement;
			if (data.customDomain) {
				customDomainInput.value = data.customDomain;
			}
			if (data.showPassword) {
				showPasswordCheckbox.checked = data.showPassword;
			}
			if (data.language) {
				languageSelect.value = data.language;
			}
			if (data.limitTextLength !== undefined) {
				limitTextLengthCheckbox.checked = data.limitTextLength;
				maxTextLengthInput.disabled = !data.limitTextLength;
			}
			if (data.maxTextLength) {
				maxTextLengthInput.value = data.maxTextLength;
			}
			limitTextLengthCheckbox.addEventListener('change', () => {
				maxTextLengthInput.disabled = !limitTextLengthCheckbox.checked;
			});
			if (data.randomSelects) {
				randomSelectsCheckbox.checked = data.randomSelects;
			}
			if (data.autoCheckCheckboxes) {
				autoCheckCheckboxesCheckbox.checked = data.autoCheckCheckboxes;
			}
		}
	);
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
	const limitTextLength = (
		document.getElementById('limitTextLength') as HTMLInputElement
	).checked;
	const maxTextLength = (
		document.getElementById('maxTextLength') as HTMLInputElement
	).value;
	const randomSelects = (
		document.getElementById('randomSelects') as HTMLInputElement
	).checked;
	const autoCheckCheckboxes = (
		document.getElementById('autoCheckCheckboxes') as HTMLInputElement
	).checked;
	chrome.storage.sync.set(
		{ customDomain, showPassword, language, limitTextLength, maxTextLength, randomSelects, autoCheckCheckboxes },
		() => {
			alert('Configurações salva!');
		}
	);
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
