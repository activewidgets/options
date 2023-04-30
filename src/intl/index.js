/**
 * Copyright (c) ActiveWidgets SARL. All Rights Reserved.
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */


import {format} from '../format';

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


export function intl(locale){
    return format(pattern => {

        if (typeof pattern != 'object'){
            return;
        }

        let Type = Object.keys(pattern).reduce((result, key) => result || lookup[key], null);

        if (!Type){
            return;
        }

        let instance = new Type(locale, pattern),
            parse = v => v;

        if (Type === Intl.DateTimeFormat){
            parse = v => (typeof v == 'number') ? v : Date.parse(v);
        }

        return function(value){
            try {
                return instance.format(parse(value));
            } 
            catch(err){ 
                return value;
            }
        }
    });
}