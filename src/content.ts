import { Faker, faker as fakerEN } from '@faker-js/faker';
import { faker as fakerPT } from '@faker-js/faker/locale/pt_BR';
import { faker as fakerES } from '@faker-js/faker/locale/es';

async function fillFocusedInput() {
	const activeElement = document.activeElement as
		| HTMLInputElement
		| HTMLTextAreaElement;
	if (
		activeElement &&
		(activeElement.tagName === 'INPUT' || activeElement.tagName === 'TEXTAREA')
	) {
		const inputType =
			activeElement instanceof HTMLInputElement ? activeElement.type : 'text';
		activeElement.value = await getRandomData(inputType);
		showPassword(activeElement);
		const event = new Event('input', { bubbles: true });
		activeElement.dispatchEvent(event);
	}
}

async function fillAllInputs() {
	const inputs = document.querySelectorAll('input, textarea');
	for (const input of inputs) {
		if (
			input instanceof HTMLInputElement ||
			input instanceof HTMLTextAreaElement
		) {
			const inputType = input instanceof HTMLInputElement ? input.type : 'text';
			input.value = await getRandomData(inputType);
			showPassword(input);
			const event = new Event('input', { bubbles: true });
			input.dispatchEvent(event);
		}
	}
}

async function getRandomData(inputType: string): Promise<string> {
	const faker = await getFaker();
	const { limitTextLength, maxTextLength } = await getLimitSettings();
	const maxLen = limitTextLength ? maxTextLength : undefined;
	switch (inputType) {
		case 'text':
			return generateLimitedText(faker.person.firstName(), maxLen);
		case 'email': {
			const domain = await getCustomDomain();
			const emailUser = faker.internet.username();
			const totalMax = maxLen ? maxLen - domain.length - 1 : undefined;
			return generateLimitedText(emailUser, totalMax) + '@' + domain;
		}
		case 'number':
			return faker.string.numeric(maxLen ?? 10);
		case 'password':
			return generateLimitedText(faker.internet.password(), maxLen);
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
			resolve(data.language || 'en');
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

async function getLimitSettings(): Promise<{
	limitTextLength: boolean;
	maxTextLength: number;
}> {
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
			const event = new Event('change', { bubbles: true });
			select.dispatchEvent(event);
			break;
		}
	}
}

function selectRandomOption(select: HTMLSelectElement) {
	const availableOptions = Array.from(select.options).filter(
		(option) => option.value.trim() !== ''
	);
	if (availableOptions.length > 0) {
		const randomIndex = Math.floor(Math.random() * availableOptions.length);
		select.value = availableOptions[randomIndex].value;
		const event = new Event('change', { bubbles: true });
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
			const event = new Event('change', { bubbles: true });
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

(window as any).fillFocusedInput = fillFocusedInput;
(window as any).fillAllInputs = fillAllInputs;
(window as any).fillAllSelects = fillAllSelects;
(window as any).fillAllCheckboxes = fillAllCheckboxes;