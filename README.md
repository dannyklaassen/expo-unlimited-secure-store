# expo-unlimited-secure-store

Key-Value based secured storage engine for applications built with [Expo](https://expo.io), which can be also used as the storage for [redux-persist](https://github.com/rt2zz/redux-persist).

Given data is encrypted (AES256) and saved to application's sandbox with Expo's [FileSystem](https://docs.expo.io/versions/latest/sdk/filesystem/) and the encryption keys are stored in Expo's [SecureStore](https://docs.expo.io/versions/latest/sdk/securestore/).

Main reason for creating this module was that in Expo SDK v33 the SecureStore can only store 2KB for an entry, and attempting to save bigger data will result in an error in v35.

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

If you have some data (strings or objects) that you want to store securely and read/use it any time later

```js
import createSecureStore from '@neverdull-agency/expo-unlimited-secure-store';

const secureStore = createSecureStore();

//...

// Saving Data
secureStore.saveItem(key, value).then(() => {
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
