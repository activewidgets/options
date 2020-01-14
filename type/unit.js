
import {Datagrid} from '@activewidgets/components';
import {type} from '@activewidgets/options';
import {render} from '@activewidgets/testing';


test('present', () => {
    expect(typeof type).toBe('function');
});


test('applies format', () => {

    let rows = [['cell']],
        columns = [{type: 'xyz', field: 0}],
        options = [type('xyz', {format: v => v + v})],
        result = render(Datagrid, {columns, rows, options}),
        cell = result.getByText('cellcell');

    expect(cell).toBeInTheDocument();
});

