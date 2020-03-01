/**
 * @format
 */

import { AppRegistry } from 'react-native';
import 'react-native-gesture-handler';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { name as appName } from './app.json';

import Try from './app/scenes/Try';
import Dispatch from './app/Dispatch';
import Settings from './app/scenes/Settings'
import Login from './app/forms/Login';
import QuickAdd from './app/forms/QuickAdd';
import DefaultNewDrink from './app/forms/Default'

const AppNavigator = createStackNavigator(
    {
        "Try": Try,
        "My Settings": Settings,
        "Quick add": QuickAdd,
        "Beverage list": DefaultNewDrink,
        "Login": Login,
        "Dispatch": Dispatch,
    },
    {
        initialRouteName: 'Dispatch',
    },
);

const container = createAppContainer(AppNavigator);

AppRegistry.registerComponent(appName, () => container);
