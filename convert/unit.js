
import {convert} from '@activewidgets/options';
import {mount} from '@activewidgets/testing';


test('present', () => {
    expect(typeof convert).toBe('function');
});


test('convert fn', () => {

    let rows = [['cell']],
        columns = [{convert: 'double', field: 0}],
        options = [convert('double', v => v + v)],
        result = mount('ax-datagrid', {columns, rows, options}),
        cell = result.getByText('cellcell');

    expect(cell).toBeInTheDocument();
});

