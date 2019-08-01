import * as Storage from './storage';
import * as DefaultOptions from './options';

const createSecureStorage = (options = {}) => {
    const replaceCharacter = options.replaceCharacter || DefaultOptions.replaceCharacter;
    const replacer = options.replacer || DefaultOptions.replacer;

    Storage.createDirectory();

    return {
        setItem: (key, value) =>
            Storage.setAsync(replacer(key, replaceCharacter), value, options),

        getItem: (key) =>
            Storage.getAsync(replacer(key, replaceCharacter), options),

        removeItem: (key) =>
            Storage.removeAsync(replacer(key, replaceCharacter), options),
    };
};

export default createSecureStorage;
