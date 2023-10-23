import CryptoJS from 'crypto-js';

var key = process.env.NEXT_PUBLIC_ENCRYPT_KEY ?? '';
var iv = CryptoJS.enc.Utf8.parse(process.env.NEXT_PUBLIC_VT_ENCRYPT_KEY ?? '');

export function encrypt(plaintext: any) {
    const keyParsed = CryptoJS.enc.Utf8.parse(key);
    var encrypted = CryptoJS.AES.encrypt(plaintext, keyParsed, { iv: iv, mode: CryptoJS.mode.CBC });
    return encrypted.toString();
    // return CryptoJS.AES.encrypt(JSON.stringify(plaintext), key, { iv: iv, }).toString();
}

export function decrypt(hash: string) {
    let bytes = CryptoJS.AES.decrypt(hash, key, { iv: iv });
    return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
}