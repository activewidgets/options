
export default function(locale){

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


    function intl(column){

        let params = column.format;

        if (typeof params != 'object'){
            return;
        }

        let Type = Object.keys(params).reduce((result, key) => result || lookup[key], null);

        if (!Type){
            return;
        }

        let instance = new Type(locale, params);

        function format(value){
            try { return instance.format(value)} catch(err){ return value }
        }

        column.format = format;
    }


    return function({on}){
        on('column', null, intl);
    };
}