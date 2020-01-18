
import {column} from '@activewidgets/options';
import {render} from '@activewidgets/testing';


test('present', () => {
    expect(typeof column).toBe('function');
});


test('width', () => {

    let rows = [['cell']],
        options = [column({width: 222})];

    let {getByText} = render('ax-datagrid', {rows, options});

    expect(getByText('cell')).toHaveStyle('width: 222px');
});


test('applies format', () => {

    let rows = [['cell']],
        options = [column({format: v => v + v})],
        result = render('ax-datagrid', {rows, options}),
        cell = result.getByText('cellcell');

    expect(cell).toBeInTheDocument();
});

