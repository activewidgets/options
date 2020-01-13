
import {Datagrid} from '@activewidgets/components';
import {format} from '@activewidgets/options';
import {render} from '@activewidgets/testing';


test('present', () => {
    expect(typeof format).toBe('function');
});


test('format fn', () => {

    let rows = [['cell']],
        columns = [{format: 'double', field: 0}],
        options = [format('double', v => v + v)],
        result = render(Datagrid, {columns, rows, options}),
        cell = result.getByText('cellcell');

    expect(cell).toBeInTheDocument();
});

