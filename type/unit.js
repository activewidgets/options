
import {type} from '@activewidgets/options';
import {mount} from '@activewidgets/testing';


test('present', () => {
    expect(typeof type).toBe('function');
});


test('applies format', () => {

    let rows = [['cell']],
        columns = [{type: 'xyz', field: 0}],
        options = [type('xyz', {format: v => v + v})],
        result = mount('ax-datagrid', {columns, rows, options}),
        cell = result.getByText('cellcell');

    expect(cell).toBeInTheDocument();
});

