
export default function(locale){

    if (typeof locale != 'string'){
        throw new Error('locale argument should be a string');
    }

    return function({emit}){
        emit('locale', locale);
    }
}