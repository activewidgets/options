
export default function(locale){
    return function({update}){
        update({locale});
    };
}