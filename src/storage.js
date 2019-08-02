import * as FileSystem from 'expo-file-system';
import * as SecureStore from 'expo-secure-store';

import uuid from './uuid';
import * as AES from './aes';

const storageFileUriKey = 'storage_file_uri';
const storageDirectoryUri = `${FileSystem.documentDirectory}persist-storage/`;

export const createDirectory = () => {
    FileSystem.getInfoAsync(storageDirectoryUri)
    .then(({ exists }) => {
        if (!exists) {
            FileSystem.makeDirectoryAsync(storageDirectoryUri, { intermediates: true });
        }
    });
};

export const getAsync = async (key, secureStoreOptions) => {
    return new Promise(async (resolve, reject) => {
        try {
            let value = null;
            const aesKey = await SecureStore.getItemAsync(key, secureStoreOptions);
            if (aesKey) {
                const storageFileUri = await SecureStore.getItemAsync(storageFileUriKey, secureStoreOptions);
                if (storageFileUri) {
                    const storageString = await FileSystem.readAsStringAsync(storageFileUri);
                    const storage = JSON.parse(storageString);
                    const encryptedValue = storage[key];
                    value = AES.decrypt(encryptedValue, aesKey);
                }
            }
            resolve(value);
        } catch (e) {
            reject(e);
        }
    });    
};

export const setAsync = async (key, value, secureStoreOptions) => {
    return new Promise(async (resolve, reject) => {
        try {
            let storage = {};
            const currentStorageFileUri = await SecureStore.getItemAsync(storageFileUriKey, secureStoreOptions);
            if (currentStorageFileUri) {
                const storageString = await FileSystem.readAsStringAsync(currentStorageFileUri);
                storage = JSON.parse(storageString);
            } 

            const { encryptionKey, encryptedData } = AES.encryptWithRandomKey(value);
            storage = { ...storage, [key]: encryptedData };
            const storageString = JSON.stringify(storage);

            const newStorageFileUri = await generateStorageFileUri();
            await FileSystem.writeAsStringAsync(newStorageFileUri, storageString);
            await SecureStore.setItemAsync(storageFileUriKey, newStorageFileUri, secureStoreOptions);
            await SecureStore.setItemAsync(key, encryptionKey, secureStoreOptions);
            if (currentStorageFileUri) {
                await FileSystem.deleteAsync(currentStorageFileUri);
            }
            
            resolve();
        } catch (e) {
            reject(e);
        }
    });
};

export const removeAsync = async (key, secureStoreOptions) => {
    return new Promise(async (resolve, reject) => {
        try {
            const currentStorageFileUri = await SecureStore.getItemAsync(storageFileUriKey, secureStoreOptions);
            if (currentStorageFileUri) {
                let storageString = await FileSystem.readAsStringAsync(currentStorageFileUri);
                storage = JSON.parse(storageString);
                delete storage.key;
                storageString = JSON.stringify(storage);

                const newStorageFileUri = await generateStorageFileUri();
                await FileSystem.writeAsStringAsync(newStorageFileUri, storageString);
                await SecureStore.setItemAsync(storageFileUriKey, newStorageFileUri, secureStoreOptions);
                await FileSystem.deleteAsync(currentStorageFileUri);
            } 

            await SecureStore.deleteItemAsync(key, secureStoreOptions);

            resolve();
        } catch (e) {
            reject(e);
        }
    });
};

const generateStorageFileUri = async () => {
    const fileName = uuid();
    const uri = `${storageDirectoryUri}${fileName}`;
    return uri;
};
