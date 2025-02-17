import { faker } from '@faker-js/faker';

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
	switch (inputType) {
		case 'text':
			return faker.person.firstName();
		case 'email': {
			const domain = await getCustomDomain();
			return faker.internet.email({ provider: domain });
		}
		case 'number':
			return faker.string.numeric(10);
		case 'password':
			return faker.internet.password();
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
