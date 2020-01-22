
import {intl} from '@activewidgets/options';
import {mount} from '@activewidgets/testing';


test('present', () => {
    expect(typeof intl).toBe('function');
});


test('format fn', () => {

    let rows = [[1234]],
        columns = [{format: {style: 'decimal', minimumFractionDigits: 2}, field: 0}],
        options = [intl('en-US')],
        result = mount('ax-datagrid', {columns, rows, options}),
        cell = result.getByText('1,234.00');

    expect(cell).toBeInTheDocument();
});

