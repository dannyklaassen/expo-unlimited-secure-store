import CryptoJS from 'crypto-js';

export const encryptWithRandomKey = (data) => {
    const encryptionKey = generateKey(256);
    const encryptedData = CryptoJS.AES.encrypt(data, encryptionKey).toString();
    return { encryptionKey, encryptedData };
};

export const decrypt = (data, key) => {
    const decryptedBytes = CryptoJS.AES.decrypt(data, key);
    const decryptedValue = decryptedBytes.toString(CryptoJS.enc.Utf8);
    return decryptedValue;
};

const generateKey = (length) => {
    let key = '';
    const hex = '0123456789abcdef';

    for (i = 0; i < length; i++) {
        key += hex.charAt(Math.floor(Math.random() * 16));
    }

    return key;
};
