
import {column} from '@activewidgets/options';
import {mount} from '@activewidgets/testing';


test('present', () => {
    expect(typeof column).toBe('function');
});


test('width', () => {

    let rows = [['cell']],
        options = [column({width: 222})],
        result = mount('ax-datagrid', {rows, options}),
        cell = result.getByText('cell');

    expect(cell).toHaveStyle('width: 222px');
});


test('align', () => {

    let rows = [['cell']],
        options = [column({align: 'right'})],
        result = mount('ax-datagrid', {rows, options}),
        cell = result.getByText('cell');

    expect(cell).toHaveClass('ax-align-right');
});

