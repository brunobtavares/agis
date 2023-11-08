import CryptoJS from 'crypto-js';

const key = process.env.NEXT_PUBLIC_ENCRYPT_KEY ?? '';
const iv = CryptoJS.enc.Utf8.parse(process.env.NEXT_PUBLIC_VT_ENCRYPT_KEY ?? '');

const keyParsed = CryptoJS.enc.Utf8.parse(key);

export function encrypt(plaintext: any) {
    var encrypted = CryptoJS.AES.encrypt(plaintext, keyParsed, { iv: iv, mode: CryptoJS.mode.CBC });
    return encrypted.toString();
}

export function decrypt(hash: string) {
    try {
        let bytes = CryptoJS.AES.decrypt(hash, keyParsed, { iv: iv, mode: CryptoJS.mode.CBC });
        return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    } catch (error) {
        return {};
    }
}
