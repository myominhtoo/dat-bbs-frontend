
export function encode( data : string | object ){
    return window.btoa(unescape(encodeURIComponent(JSON.stringify(data))));
}

export function decode( data : string | null ){
    if( data == null ) return null;
    return JSON.parse(decodeURIComponent(escape(window.atob(data!))));
}