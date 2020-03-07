/**
 * Copyright (c) ActiveWidgets SARL. All Rights Reserved.
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */


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


function plugin({on, assign, configs}){

    let {locale} = assign({}, ...configs);

    on('column', null, function(column){

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
    });
}


export default function(locale){
    return {plugin, config: {locale}};
}