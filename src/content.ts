import {Faker, faker as fakerEN} from '@faker-js/faker';
import {faker as fakerPT} from '@faker-js/faker/locale/pt_BR';
import {faker as fakerES} from '@faker-js/faker/locale/es';
import {fakerBr} from '@js-brasil/fakerbr';
// @ts-ignore
import {br as jsFakerBr} from 'faker-br';

async function fillFocusedInput() {
    const activeElement = document.activeElement as | HTMLInputElement | HTMLTextAreaElement;
    if (activeElement && (activeElement.tagName === 'INPUT' || activeElement.tagName === 'TEXTAREA')) {
        const inputType = activeElement instanceof HTMLInputElement ? activeElement.type : 'textarea';
        const randomString = await getRandomData(inputType);
        if (randomString !== '') {
            activeElement.value = randomString;
            showPassword(activeElement);
            const event = new Event('input', {bubbles: true});
            activeElement.dispatchEvent(event);
        }
    }
}

async function fillAllInputs() {
    const inputs = document.querySelectorAll('input, textarea');
    for (const input of inputs) {
        if (input instanceof HTMLInputElement || input instanceof HTMLTextAreaElement) {
            const inputType = input instanceof HTMLInputElement ? input.type : 'textarea';
            const randomString = await getRandomData(inputType);
            if (randomString !== '') {
                input.value = randomString;
                showPassword(input);
                const event = new Event('input', {bubbles: true});
                input.dispatchEvent(event);
            }
        }
    }
}

async function getRandomData(inputType: string): Promise<string> {
    const faker = await getFaker();
    const {limitTextLength, maxTextLength} = await getLimitSettings();
    const maxLen = limitTextLength ? maxTextLength : undefined;
    switch (inputType) {
        case 'text':
        case 'search':
            return generateLimitedText(faker.person.firstName(), maxLen);
        case 'email': {
            const domain = await getCustomDomain();
            const emailUser = faker.internet.username();
            const totalMax = maxLen ? maxLen - domain.length - 1 : undefined;
            return generateLimitedText(emailUser, totalMax) + '@' + domain;
        }
        case 'number':
            return faker.string.numeric(maxLen ?? 2);
        case 'password':
            return generateLimitedText(faker.internet.password(), maxLen);
        case 'textarea':
            return generateLimitedText(faker.lorem.sentences(2), maxLen);
        case 'date':
            return faker.date.anytime().toISOString().split('T')[0];
        case 'time':
            return faker.date.anytime().toISOString().split('T')[1].substring(0, 5);
        case 'datetime-local': {
            const date = faker.date.anytime();
            return date.toISOString().slice(0, 16);
        }
        case 'month': {
            const date = faker.date.anytime();
            return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        }
        case 'week': {
            const date = faker.date.anytime();
            const week = Math.ceil(date.getDate() / 7);
            return `${date.getFullYear()}-W${String(week).padStart(2, '0')}`;
        }
        case 'color':
            return faker.color.rgb();
        case 'url':
            return faker.internet.url();
        case 'tel':
            return faker.phone.number();
        case 'range':
            return String(faker.number.int({min: 1, max: 100}));
        default:
            return '';
    }
}

async function getCustomDomain(): Promise<string> {
    return new Promise((resolve) => {
        chrome.storage.sync.get(['customDomain'], (data) => {
            const domain = data.customDomain || 'example.com';
            resolve(domain);
        });
    });
}

await chrome.runtime.sendMessage({
    type: 'updateIcon',
    isDarkMode: window.matchMedia('(prefers-color-scheme: dark)').matches
});

window
    .matchMedia('(prefers-color-scheme: dark)')
    .addEventListener('change', async (event) => {
        await chrome.runtime.sendMessage({
            type: 'updateIcon',
            isDarkMode: event.matches
        });
    });

function showPassword(activeElement: HTMLInputElement | HTMLTextAreaElement) {
    chrome.storage.sync.get(['showPassword'], (data) => {
        if (data.showPassword && activeElement.type === 'password') {
            activeElement.setAttribute('type', 'text');
        }
    });
}

async function getLanguage(): Promise<string> {
    return new Promise((resolve) => {
        chrome.storage.sync.get(['language'], (data) => {
            resolve(data.language || 'pt_BR');
        });
    });
}

async function getFaker(): Promise<Faker> {
    const language = await getLanguage();
    let faker = fakerEN;
    switch (language) {
        case 'pt_BR':
            faker = fakerPT;
            break;
        case 'es':
            faker = fakerES;
            break;
    }
    return faker;
}

async function getLimitSettings(): Promise<{ limitTextLength: boolean; maxTextLength: number; }> {
    return new Promise((resolve) => {
        chrome.storage.sync.get(['limitTextLength', 'maxTextLength'], (data) => {
            resolve({
                limitTextLength: data.limitTextLength || false,
                maxTextLength: data.maxTextLength || 255
            });
        });
    });
}

function generateLimitedText(text: string, maxLen?: number): string {
    if (maxLen && text.length > maxLen) {
        return text.slice(0, maxLen);
    }
    return text;
}

async function fillAllSelects() {
    const selects = document.querySelectorAll<HTMLSelectElement>('select');
    const randomSelects = await getRandomSelectsSetting();
    for (const select of selects) {
        if (randomSelects) {
            selectRandomOption(select);
        } else {
            selectFirstAvailableOption(select);
        }
    }
}

function selectFirstAvailableOption(select: HTMLSelectElement) {
    for (const option of select.options) {
        if (option.value.trim() !== '') {
            select.value = option.value;
            const event = new Event('change', {bubbles: true});
            select.dispatchEvent(event);
            break;
        }
    }
}

function selectRandomOption(select: HTMLSelectElement) {
    const availableOptions = Array.from(select.options).filter((option) => option.value.trim() !== '');
    if (availableOptions.length > 0) {
        const randomIndex = Math.floor(Math.random() * availableOptions.length);
        select.value = availableOptions[randomIndex].value;
        const event = new Event('change', {bubbles: true});
        select.dispatchEvent(event);
    }
}

async function getRandomSelectsSetting(): Promise<boolean> {
    return new Promise((resolve) => {
        chrome.storage.sync.get(['randomSelects'], (data) => {
            resolve(data.randomSelects || false);
        });
    });
}

async function fillAllCheckboxes() {
    const checkboxes = document.querySelectorAll<HTMLInputElement>('input[type="checkbox"]');
    const autoCheckCheckboxes = await getAutoCheckCheckboxesSetting();
    if (autoCheckCheckboxes) {
        for (const checkbox of checkboxes) {
            checkbox.checked = true;
            const event = new Event('change', {bubbles: true});
            checkbox.dispatchEvent(event);
        }
    }
}

async function getAutoCheckCheckboxesSetting(): Promise<boolean> {
    return new Promise((resolve) => {
        chrome.storage.sync.get(['autoCheckCheckboxes'], (data) => {
            resolve(data.autoCheckCheckboxes ?? true);
        });
    });
}

async function fillAllRadios() {
    const radios = document.querySelectorAll<HTMLInputElement>('input[type="radio"]');
    const randomRadios = await getRandomRadiosSetting();
    const groups: { [key: string]: HTMLInputElement[] } = {};
    radios.forEach((radio) => {
        if (!groups[radio.name]) {
            groups[radio.name] = [];
        }
        groups[radio.name].push(radio);
    });
    Object.values(groups).forEach((group) => {
        if (group.length > 0) {
            const selectedRadio = randomRadios
                ? group[Math.floor(Math.random() * group.length)]
                : group[0];
            selectedRadio.checked = true;
            const event = new Event('change', {bubbles: true});
            selectedRadio.dispatchEvent(event);
        }
    });
}

async function getRandomRadiosSetting(): Promise<boolean> {
    return new Promise((resolve) => {
        chrome.storage.sync.get(['randomRadios'], (data) => {
            resolve(data.randomRadios || false);
        });
    });
}

async function fillCpfInput() {
    const activeElement = document.activeElement as HTMLInputElement | HTMLTextAreaElement;
    if (activeElement && (activeElement.tagName === 'INPUT' || activeElement.tagName === 'TEXTAREA')) {
        chrome.storage.sync.get('formatCpf', (data) => {
            const useFormattedCpf = data.formatCpf ?? true;
            activeElement.value = jsFakerBr.cpf({format: useFormattedCpf});
            const event = new Event('input', {bubbles: true});
            activeElement.dispatchEvent(event);
        });
    }
}

async function fillPhoneInput() {
    const activeElement = document.activeElement as HTMLInputElement | HTMLTextAreaElement;
    if (activeElement && (activeElement.tagName === 'INPUT' || activeElement.tagName === 'TEXTAREA')) {
        activeElement.value = fakerBr.celular();
        const event = new Event('input', {bubbles: true});
        activeElement.dispatchEvent(event);
    }
}

async function fillBirthdateInput() {
    const activeElement = document.activeElement as HTMLInputElement | HTMLTextAreaElement;
    if (activeElement && (activeElement.tagName === 'INPUT' || activeElement.tagName === 'TEXTAREA')) {
        const pessoa = fakerBr.pessoa();
        activeElement.value = pessoa.dataNascimento;
        const event = new Event('input', {bubbles: true});
        activeElement.dispatchEvent(event);
    }
}

async function fillEmailInput() {
    const activeElement = document.activeElement as HTMLInputElement | HTMLTextAreaElement;
    if (activeElement && (activeElement.tagName === 'INPUT' || activeElement.tagName === 'TEXTAREA')) {
        activeElement.value = await getRandomData('email');
        const event = new Event('input', {bubbles: true});
        activeElement.dispatchEvent(event);
    }
}

async function fillFullNameInput() {
    const activeElement = document.activeElement as HTMLInputElement | HTMLTextAreaElement;
    if (activeElement && (activeElement.tagName === 'INPUT' || activeElement.tagName === 'TEXTAREA')) {
        const faker = await getFaker();
        activeElement.value = `${faker.person.firstName()} ${faker.person.lastName()}`;
        const event = new Event('input', {bubbles: true});
        activeElement.dispatchEvent(event);
    }
}

(window as any).fillFocusedInput = fillFocusedInput;
(window as any).fillAllInputs = fillAllInputs;
(window as any).fillAllSelects = fillAllSelects;
(window as any).fillAllCheckboxes = fillAllCheckboxes;
(window as any).fillAllRadios = fillAllRadios;
(window as any).fillCpfInput = fillCpfInput;
(window as any).fillPhoneInput = fillPhoneInput;
(window as any).fillBirthdateInput = fillBirthdateInput;
(window as any).fillEmailInput = fillEmailInput;
(window as any).fillFullNameInput = fillFullNameInput;