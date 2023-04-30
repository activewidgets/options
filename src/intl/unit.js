
import {intl} from '@activewidgets/options';
import {mount} from '@activewidgets/testing';


test('present', () => {
    expect(typeof intl).toBe('function');
});


test('number', () => {

    let rows = [[1234]],
        columns = [{format: {style: 'decimal', minimumFractionDigits: 2}, field: 0}],
        options = [intl('en-US')],
        result = mount('ax-datagrid', {columns, rows, options}),
        cell = result.getByText('1,234.00');

    expect(cell).toBeInTheDocument();
});


test('date string', () => {

    let rows = [['2021-12-21']],
        columns = [{format: {year: 'numeric', month: 'short', day: 'numeric'}, field: 0}],
        options = [intl('en-US')],
        result = mount('ax-datagrid', {columns, rows, options}),
        cell = result.getByText('Dec 21, 2021');

    expect(cell).toBeInTheDocument();
});


test('date object', () => {

    let rows = [[new Date('2021-12-21')]],
        columns = [{format: {year: 'numeric', month: 'short', day: 'numeric'}, field: 0}],
        options = [intl('en-US')],
        result = mount('ax-datagrid', {columns, rows, options}),
        cell = result.getByText('Dec 21, 2021');

    expect(cell).toBeInTheDocument();
});


test('date num', () => {

    let rows = [[Date.parse('2021-12-21')]],
        columns = [{format: {year: 'numeric', month: 'short', day: 'numeric'}, field: 0}],
        options = [intl('en-US')],
        result = mount('ax-datagrid', {columns, rows, options}),
        cell = result.getByText('Dec 21, 2021');

    expect(cell).toBeInTheDocument();
});


test('date fallback', () => {

    let rows = [['x2021']],
        columns = [{format: {year: 'numeric', month: 'short', day: 'numeric'}, field: 0}],
        options = [intl('en-US')],
        result = mount('ax-datagrid', {columns, rows, options}),
        cell = result.getByText('x2021');

    expect(cell).toBeInTheDocument();
});
