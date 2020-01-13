
export default function(name, param){

    let number = Intl.NumberFormat,
        datetime = Intl.DateTimeFormat;

    let lookup = {
        style: number,
        currency: number,
        useGrouping: number,
        minimumIntegerDigits: number,
        minimumFractionDigits: number,
        maximumFractionDigits: number,
        minimumSignificantDigits: number,
        maximumSignificantDigits: number,
        year: datetime,
        month: datetime,
        day: datetime,
        weekday: datetime,
        hour: datetime,
        minute: datetime,
        second: datetime
    };

    let Type = Object.keys(param).reduce((result, key) => result || lookup[key], null);


    return function({state, on}){

        if (Type){
            let {locale} = state(),
                instance = new Type(locale, param);

            param = v => {try { return instance.format(v)} catch(e){ return v }};
        }
        else if (typeof fn == 'object'){
            throw new Error('Cannot find format data type');
        }
        else if (typeof param != 'function'){
            throw new Error('Incorrect format param');
        }

        on('column', null, column => {
            if (column.format === name){
                column.format = param;
            }
        });
    };
}
