/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';

import 'react-native-gesture-handler';

// if (!global.btoa) {  global.btoa = encode }
// if (!global.atob) { global.atob = decode } 
console.disableYellowBox = true
AppRegistry.registerComponent(appName, () => App);
