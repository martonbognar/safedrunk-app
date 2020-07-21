/**
 * @format
 */
import 'react-native-gesture-handler';
import {AppRegistry} from 'react-native';
import Try from './app/scenes/Try';
import {name as appName} from './app.json';

AppRegistry.registerComponent(appName, () => Try);
