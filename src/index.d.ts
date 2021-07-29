import { keychainAccessibilityConstant} from 'expo-secure-store';
declare module "@neverdull-agency/expo-unlimited-secure-store" {

    export interface Options {
      replacementCharacter?: string;
      replacer?: (key: string, replacementCharacter: string) => string;
      keychainService?: string;
      keyChainAccessibilityConstant?: KeychainAccessibilityConstant;
    }
  
    export interface ExpoUnlimitedSecureStore {
      setItem(key: string, value: string): Promise<void>;
  
      getItem(key: string): Promise<string | null>;
  
      removeItem(key: string): Promise<void>;
    }
  
    export default function(options?: Options): ExpoUnlimitedSecureStore;
  }