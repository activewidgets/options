
import {Datagrid} from '@activewidgets/components';
import {locale} from '@activewidgets/options';
import {render} from '@activewidgets/testing';


test('present', () => {
    expect(typeof locale).toBe('function');
});


test('locale', () => {

    function inspect({state}){
       let {locale} = state();
       expect(locale).toBe('fr-CH');
    }

    render(Datagrid, {options: [locale('fr-CH'), inspect]});
});

