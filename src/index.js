import * as Storage from './storage';
import * as DefaultOptions from './options';

const createSecureStorage = (options = {}) => {
    const replacementCharacter = options.replacementCharacter || DefaultOptions.replacementCharacter;
    const replacer = options.replacer || DefaultOptions.replacer;

    Storage.createDirectory();

    return {
        setItem: (key, value) =>
            Storage.setAsync(replacer(key, replacementCharacter), value, options),

        getItem: (key) =>
            Storage.getAsync(replacer(key, replacementCharacter), options),

        removeItem: (key) =>
            Storage.removeAsync(replacer(key, replacementCharacter), options),
    };
};

export default createSecureStorage;
