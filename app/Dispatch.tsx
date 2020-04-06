import React, {Component} from 'react';
import {View, Button} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';

import Sessions from './Sessions';
import Try from './scenes/Try';
import Settings from './scenes/Settings';
import Login from './forms/Login';
import QuickAdd from './forms/QuickAdd';
import DefaultNewDrink from './forms/Default';

interface DispatchState {
  token: String;
  email: String;
  loggedIn: Boolean;
}

interface DispatchProps {
  navigation: {
    navigate: Function;
  };
}

class Dispatch extends Component<DispatchProps, DispatchState> {
  constructor(props: Readonly<DispatchProps>) {
    super(props);
    this.state = {
      token: '',
      email: '',
      loggedIn: false,
    };

    this.getDataFromStorage = this.getDataFromStorage.bind(this);
  }

  componentDidMount(): void {
    this.getDataFromStorage().then(() =>
      fetch('https://safedrunk.com/api/personal', {
        headers: {
          Authorization: 'Bearer ' + this.state.token,
        },
      }).then(response => {
        if (response.status === 200) {
          this.setState({loggedIn: true});
        }
      }),
    );
  }

  async getDataFromStorage() {
    try {
      const token = await AsyncStorage.getItem('token');
      const email = await AsyncStorage.getItem('email');
      if (token !== null && email !== null) {
        this.setState({token: token, email: email});
      }
    } catch (e) {
      // error reading value
    }
  }

  render() {
    if (this.state.loggedIn) {
      return <Sessions token={this.state.token} />;
    } else {
      return (
        <View>
          <Button
            title="Login"
            onPress={() => this.props.navigation.navigate('Login')}
          />

          <Button
            title="Try it out"
            onPress={() => this.props.navigation.navigate('Try')}
          />
        </View>
      );
    }
  }
}

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Try">
        <Stack.Screen name="Dispatch" component={Dispatch} />
        <Stack.Screen name="Try" component={Try} />
        <Stack.Screen name="Settings" component={Settings} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Quick add" component={QuickAdd} />
        <Stack.Screen name="Beverage list" component={DefaultNewDrink} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
