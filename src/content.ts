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
		const value = await getRandomData(inputType);
		activeElement.value = value;
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
			const value = await getRandomData(inputType);
			input.value = value;
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
			return faker.string.numeric(maxLen || 10);
		case 'password':
			const password = faker.internet.password();
			return generateLimitedText(password, maxLen);
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

(window as any).fillFocusedInput = fillFocusedInput;
(window as any).fillAllInputs = fillAllInputs;

chrome.runtime.sendMessage({
	type: 'updateIcon',
	isDarkMode: window.matchMedia('(prefers-color-scheme: dark)').matches,
});

window
	.matchMedia('(prefers-color-scheme: dark)')
	.addEventListener('change', (event) => {
		chrome.runtime.sendMessage({
			type: 'updateIcon',
			isDarkMode: event.matches,
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
				maxTextLength: data.maxTextLength || 255,
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
