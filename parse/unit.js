
import {parse} from '@activewidgets/options';
import {mount} from '@activewidgets/testing';


test('present', () => {
    expect(typeof parse).toBe('function');
});


test('parse fn', () => {

    let rows = [['cell']],
        columns = [{parse: 'double', field: 0}],
        options = [parse('double', v => v + v)],
        result = mount('ax-datagrid', {columns, rows, options}),
        cell = result.getByText('cellcell');

    expect(cell).toBeInTheDocument();
});

