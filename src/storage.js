import * as FileSystem from 'expo-file-system';
import * as SecureStore from 'expo-secure-store';

import uuid from './uuid';
import * as AES from './aes';

const storageFileUriKey = 'storage_file_uri';
const storageDirectoryUri = `${FileSystem.documentDirectory}persist-storage/`;

export const createDirectory = async () => {
    const { exists } = await FileSystem.getInfoAsync(storageDirectoryUri);
    if (!exists) {
        await FileSystem.makeDirectoryAsync(storageDirectoryUri, { intermediates: true });
    }
};

export const tryDataRecovery = async (secureStoreOptions) => {
    const storageFileUri = await SecureStore.getItemAsync(storageFileUriKey, secureStoreOptions);
    if (storageFileUri.startsWith('file://')) {
        // Full paths is stored, means it's older version
        let storageString;
        const { exists } = await FileSystem.getInfoAsync(storageFileUri);
        if (exists) {
            // File exists at path, try to read contents
            storageString = await FileSystem.readAsStringAsync(storageFileUri);
            await FileSystem.deleteAsync(storageFileUri);
        } else {
            // File doesn't exists at path, documents dir may have changed
            const fileName = storageFileUri.split('persist-storage/')[1];
            const modifiedUri = `${storageDirectoryUri}${fileName}`;
            const { exists } = await FileSystem.getInfoAsync(modifiedUri);
            if (exists) {
                storageString = await FileSystem.readAsStringAsync(modifiedUri);
                await FileSystem.deleteAsync(modifiedUri);
            }
        }

        if (storageString) {
            // Storage could be read, save in new format
            const newStorageFileName = uuid();
            const newStorageFileUri = `${storageDirectoryUri}${newStorageFileName}`;
            await FileSystem.writeAsStringAsync(newStorageFileUri, storageString);
            await SecureStore.setItemAsync(storageFileUriKey, newStorageFileName, secureStoreOptions);
        }
    }
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

            const newStorageFileName = uuid();
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

                const newStorageFileName = uuid();
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
