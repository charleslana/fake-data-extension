import {describe, test, expect} from '@jest/globals';
import {Faker, faker as fakerEN} from '@faker-js/faker';
import {faker as fakerPT} from '@faker-js/faker/locale/pt_BR';
import {faker as fakerES} from '@faker-js/faker/locale/es';
import {fakerBr} from '@js-brasil/fakerbr';
// @ts-ignore
import {br as jsFakerBr} from 'faker-br';

describe('Testes', () => {
    test('deve gerar um CEP com estado', () => {
        const test = fakerBr.cep({estado: 'mg'});
        console.log(test);
        expect(test).toBeDefined();
    });
});