
import {type} from '@activewidgets/options';
import {mount} from '@activewidgets/testing';


test('present', () => {
    expect(typeof type).toBe('function');
});


test('align, width', () => {

    let rows = [['cell']],
        columns = [{type: 'xyz', field: 0}],
        options = [type('xyz', {align: 'right', width: 123})],
        result = mount('ax-datagrid', {columns, rows, options}),
        cell = result.getByText('cell');

    expect(cell).toHaveClass('ax-align-right');
    expect(cell).toHaveStyle('width: 123px');
});

