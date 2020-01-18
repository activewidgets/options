
import {format} from '@activewidgets/options';
import {render} from '@activewidgets/testing';


test('present', () => {
    expect(typeof format).toBe('function');
});


test('format fn', () => {

    let rows = [['cell']],
        columns = [{format: 'double', field: 0}],
        options = [format('double', v => v + v)],
        result = render('ax-datagrid', {columns, rows, options}),
        cell = result.getByText('cellcell');

    expect(cell).toBeInTheDocument();
});

