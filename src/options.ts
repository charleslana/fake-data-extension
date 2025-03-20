document.addEventListener('DOMContentLoaded', () => {
    chrome.storage.sync.get(
        [
            'customDomain',
            'showPassword',
            'language',
            'limitTextLength',
            'maxTextLength',
            'randomSelects',
            'autoCheckCheckboxes',
            'randomRadios',
            'formatCpf'
        ],
        (data) => {
            const customDomainInput = document.getElementById('customDomain') as HTMLInputElement;
            const showPasswordCheckbox = document.getElementById('showPassword') as HTMLInputElement;
            const languageSelect = document.getElementById('language') as HTMLSelectElement;
            const limitTextLengthCheckbox = document.getElementById('limitTextLength') as HTMLInputElement;
            const maxTextLengthInput = document.getElementById('maxTextLength') as HTMLInputElement;
            const randomSelectsCheckbox = document.getElementById('randomSelects') as HTMLInputElement;
            const autoCheckCheckboxesCheckbox = document.getElementById('autoCheckCheckboxes') as HTMLInputElement;
            const randomRadiosCheckbox = document.getElementById('randomRadios') as HTMLInputElement;
            const formatCpfCheckbox = document.getElementById('formatCpf') as HTMLInputElement;
            if (data.customDomain) {
                customDomainInput.value = data.customDomain;
            }
            if (data.showPassword !== undefined) {
                showPasswordCheckbox.checked = data.showPassword;
            }
            languageSelect.value = data.language ? data.language : 'pt_BR';
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
            if (data.randomSelects !== undefined) {
                randomSelectsCheckbox.checked = data.randomSelects;
            }
            if (data.autoCheckCheckboxes !== undefined) {
                autoCheckCheckboxesCheckbox.checked = data.autoCheckCheckboxes;
            }
            if (data.randomRadios !== undefined) {
                randomRadiosCheckbox.checked = data.randomRadios;
            }
            if (data.formatCpf !== undefined) {
                formatCpfCheckbox.checked = data.formatCpf;
            }
        }
    );
});

document.getElementById('saveSettings')!.addEventListener('click', () => {
    const customDomain = (document.getElementById('customDomain') as HTMLInputElement).value;
    const showPassword = (document.getElementById('showPassword') as HTMLInputElement).checked;
    const language = (document.getElementById('language') as HTMLInputElement).value;
    const limitTextLength = (document.getElementById('limitTextLength') as HTMLInputElement).checked;
    const maxTextLength = (document.getElementById('maxTextLength') as HTMLInputElement).value;
    const randomSelects = (document.getElementById('randomSelects') as HTMLInputElement).checked;
    const autoCheckCheckboxes = (document.getElementById('autoCheckCheckboxes') as HTMLInputElement).checked;
    const randomRadios = (document.getElementById('randomRadios') as HTMLInputElement).checked;
    const formatCpf = (document.getElementById('formatCpf') as HTMLInputElement).checked;
    chrome.storage.sync.set(
        {
            customDomain,
            showPassword,
            language,
            limitTextLength,
            maxTextLength,
            randomSelects,
            autoCheckCheckboxes,
            randomRadios,
            formatCpf
        },
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
