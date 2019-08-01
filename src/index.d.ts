declare module "@neverdull-agency/expo-unlimited-secure-store" {
    export interface Options {
      replaceCharacter?: string;
      replacer: (key: string, replaceCharacter: string) => string;
    }
  
    export interface ExpoUnlimitedSecureStore {
      getItem(key: string, value: string): Promise<void>;
  
      setItem(key: string): Promise<string | null>;
  
      removeItem(key: string): Promise<void>;
    }
  
    export default function(options?: Options): ExpoUnlimitedSecureStore;
  }