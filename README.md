# expo-unlimited-secure-store

Key-Value based secured storage engine for applications built with [Expo](https://expo.io), which can be also used as the storage for [redux-persist](https://github.com/rt2zz/redux-persist).

Given data is encrypted (AES256) and saved to application's sandbox with Expo's [FileSystem](https://docs.expo.io/versions/latest/sdk/filesystem/) and the encryption keys are stored in Expo's [SecureStore](https://docs.expo.io/versions/latest/sdk/securestore/).

Main reason for creating this module is limitations of SecureStore starting from SDK 33:

> Size limit for a value is 2048 bytes. An attempt to store larger values may fail. Currently, we print a warning when the limit is reached, but we will throw an error starting from SDK 35.

## Installation

```bash
npm i @neverdull-agency/expo-unlimited-secure-store
```

It has two peer dependencies mentioned above (SecureStore & FileSystem) which you will have to install manually to your project if you haven't did already:

```bash
expo install expo-secure-store
expo install expo-file-system
```

## Usage

### For storing data securely

If you have some data that you want to store securely and read/delete it any time later:

```js
import createSecureStore from '@neverdull-agency/expo-unlimited-secure-store';

const secureStore = createSecureStore();

//...

// Saving Data
secureStore.setItem(key, value).then(() => {
	console.log('saved successfully');
});

// Retrieving Data
secureStore.getItem(key).then((value) => {
	console.log('retrieved successfully');
	// Do what you need with the returned value
});

// Deleting Data
secureStore.removeItem(key).then(() => {
	console.log('removed successfully');
});
```

### As `redux-persist` storage

If you are using redux, and redux-persist you can use this as the storage engine in the following way

```js
import createSecureStore from '@neverdull-agency/expo-unlimited-secure-store';

import { createStore } from 'redux';
import { persistStore, persistCombineReducers } from 'redux-persist';
import reducers from './reducers';

const storage = createSecureStore();

const config = {
  key: 'root',
  storage,
};

const reducer = persistCombineReducers(config, reducers);
const store = createStore(reducer);
const persistor = persistStore(store);

export { store, persistor };
```

## API

### `createSecureStore([options])`

Function that will create the secure store with options, which can have four values: two for Expo's [SecureStore](https://docs.expo.io/versions/latest/sdk/securestore/) and two for this module.

*You will only have to provide these options when creating the secure store, later if you want to save/get/remove data you will have to call the corresponding functions only.*

#### Options for SecureStore:

- `keychainService : string`
 
> iOS: The item's service, equivalent to `kSecAttrService`
 
> Android: Equivalent of the public/private key pair Alias

> **NOTE** If the item is set with the keychainService option, it will be required to later fetch the value.

- `keychainAccessible : enum`

> iOS only: Specifies when the stored entry is accessible, using iOS’s kSecAttrAccessible property. See Apple’s documentation on [keychain item accessibility](https://developer.apple.com/library/content/documentation/Security/Conceptual/keychainServConcepts/02concepts/concepts.html#//apple_ref/doc/uid/TP30000897-CH204-SW18). The available options are:

> `SecureStore.WHEN_UNLOCKED` (default): The data in the keychain item can be accessed only while the device is unlocked by the user

> `SecureStore.AFTER_FIRST_UNLOCK`: The data in the keychain item cannot be accessed after a restart until the device has been unlocked once by the user. This may be useful if you need to access the item when the phone is locked.

> `SecureStore.ALWAYS`: The data in the keychain item can always be accessed regardless of whether the device is locked. This is the least secure option.

> `SecureStore.WHEN_UNLOCKED_THIS_DEVICE_ONLY`: Similar to WHEN_UNLOCKED, except the entry is not migrated to a new device when restoring from a backup.

> `SecureStore.WHEN_PASSCODE_SET_THIS_DEVICE_ONLY`: Similar to WHEN\_UNLOCKED\_THIS\_DEVICE\_ONLY, except the user must have set a passcode in order to store an entry. If the user removes their passcode, the entry will be deleted.

> `SecureStore.AFTER_FIRST_UNLOCK_THIS_DEVICE_ONLY`: Similar to AFTER\_FIRST\_UNLOCK, except the entry is not migrated to a new device when restoring from a backup.

> `SecureStore.ALWAYS_THIS_DEVICE_ONLY`: Similar to ALWAYS, except the entry is not migrated to a new device when restoring from a backup.

#### Options for this module

- `replacementCharacter : string`
 
Keys for Expo's [SecureStore](https://docs.expo.io/versions/latest/sdk/securestore/) only support `[A-Za-z0-9.-_]`, so all other characters will be replaced with this provided replacement character. If you don't provide any it will use `_` by default.

- `replacer : function(key: string, replacementCharacter: string): string`

If you want you can provide your own function to replace unsupported characters, meaning all time when you will want to save/get/remove items from the store this function will be executed.

#### *You won't have to use functions below if using only for `redux-persist` storage, in that case redux will call these when needed*

### `store.setItem(key: string, value: string): Promise<void>`

Saves the given value to store under the provided key.

Returns a `Promise` wich will reject in case of errors. If you want to save object, or any type of data you will have to convert them to strings, and after reading them do the reversed actions.
 
*Like using `JSON.stringify` and `JSON.parse` for objects.*

### `getItem(key: string): Promise<string | null>`

Retrieves the value saved under the provided key. 

Returns a `Promise` which will resolve with the saved value or null, or will reject in case of errors.

### `store.removeItem(key: string): Promise<void>`

Deletes the value saved under the provided key.

Returns a `Promise` wich will reject in case of errors.

## Note

Inspired by [redux-persist-expo-securestore](https://github.com/Cretezy/redux-persist-expo-securestore) which saved data with Expo's SecureStore, that has been limited to 2KB per entry from SDK 33.


