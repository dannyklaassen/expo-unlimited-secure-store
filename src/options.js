export const replacementCharacter = '_';

export const replacer = (string, char) => {
    return string.replace(/[^a-z0-9.\-_]/gi, char);
};
