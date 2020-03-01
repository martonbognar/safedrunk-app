/**
 * @format
 */

import { AppRegistry } from 'react-native';
import 'react-native-gesture-handler';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { name as appName } from './app.json';

import Try from './app/scenes/Try';
import Settings from './app/scenes/Settings'
import Login from './app/forms/Login';
import QuickAdd from './app/forms/QuickAdd';
import DefaultNewDrink from './app/forms/Default'

const AppNavigator = createStackNavigator(
    {
        Home: Try,
        "My Settings": Settings,
        "Quick add": QuickAdd,
        "Beverage list": DefaultNewDrink,
        "Login": Login,
    },
    {
        initialRouteName: 'Home',
    },
);

const container = createAppContainer(AppNavigator);

AppRegistry.registerComponent(appName, () => container);
