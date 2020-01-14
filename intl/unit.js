
import {Datagrid} from '@activewidgets/components';
import {intl} from '@activewidgets/options';
import {render} from '@activewidgets/testing';


test('present', () => {
    expect(typeof intl).toBe('function');
});


test('format fn', () => {

    let rows = [[1234]],
        columns = [{format: {style: 'decimal', minimumFractionDigits: 2}, field: 0}],
        options = [intl('en-US')],
        result = render(Datagrid, {columns, rows, options}),
        cell = result.getByText('1,234.00');

    expect(cell).toBeInTheDocument();
});

