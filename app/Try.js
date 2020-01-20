import React, { Component } from 'react';
import { Text, View, FlatList, TextInput, TouchableHighlight, Alert, StyleSheet, Button } from 'react-native';
import Drink from './Drink.js';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import Settings from './Settings.js'
import Calculator from './Calculator'
import { WEIGHTS } from './data/units';

class Try extends Component {
  constructor(props) {
    super(props);
    this.state = {
      beverages: [],
      filter: '',
      drinks: [],
      keygen: 0,
      basicData: {
        sex: 'female',
        weight: 60,
        weightUnit: 'kg',
      },
    };

    this.updateList = this.updateList.bind(this);
    this.removeDrink = this.removeDrink.bind(this);
    this.duplicateDrink = this.duplicateDrink.bind(this);
    this.submitDrink = this.submitDrink.bind(this);
  }

  updateList() {
    if (this.state.filter == "") {
      this.setState({ beverages: [] });
      return;
    }

    fetch(`https://safedrunk.com/api/beverages/filter/${this.state.filter}`)
      .then((response) => response.json())
      .then((responseJson) => {
        this.setState({
          beverages: responseJson.map((beverage) => {
            beverage.id = beverage.id.toString();
            return beverage;
          }),
        });
      })
      .catch((error) => {
        console.error(error);
      });
  }

  removeDrink(drink) {
    let index = -1;
    this.state.drinks.forEach(function (d, i) {
      if (d.key === drink.id) {
        index = i;
      }
    });
    const tempDrinks = this.state.drinks;
    tempDrinks.splice(index, 1);
    this.setState({ drinks: tempDrinks }, this.saveDrinks);
  }

  duplicateDrink(drink) {
    this.submitDrink({
      name: drink.name,
      amount: drink.amount,
      percentage: drink.percentage,
      unit: drink.unit,
      startTime: new Date(),
    });
  }

  myAlert(alertTitle, alertText) {
    Alert.alert(
      alertTitle,
      alertText,
      [
        { text: 'Ask me later', onPress: () => console.log('Ask me later pressed') },
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        { text: 'OK', onPress: () => console.log('OK Pressed') },
      ]
      , { cancelable: true })
  }

  submitDrink(item) {
    let self = this;
    this.setState({
      drinks: self.state.drinks.concat([{
        key: self.state.keygen.toString(),
        name: item.name,
        percentage: item.percentage,
        amount: 5,
        unit: 'dl',
        startTime: new Date(),
      }]),
      keygen: self.state.keygen + 1,
    });
  }

  render() {
    return (
      <View>
        <TextInput
          placeholder="Search for a beverage..."
          value={this.state.filter}
          onChangeText={(text) => this.setState({ filter: text }, this.updateList)}
        />
        <FlatList
          data={this.state.beverages}
          renderItem={
            ({ item }) =>
              <TouchableHighlight
                style={styles.button}
                underlayColor={'rgb(100, 100, 100)'}
                onPress={() => this.submitDrink(item)}>
                <Text>{item.name}, {item.percentage}</Text>
              </TouchableHighlight>
          }
        />
        <Button
          title="Go to Settings"
          onPress={() => this.props.navigation.navigate('My Settings')}
        />
        <View style={{ borderWidth: 0.5, borderColor: 'black', margin: 10 }} />
        <FlatList
          data={this.state.drinks}
          renderItem={
            ({ item }) =>
              <Drink
                key={item.key}
                id={item.key}
                name={item.name}
                percentage={item.percentage}
                startTime={item.startTime}
                onRemove={this.removeDrink}
                onDuplicate={this.duplicateDrink}
              />
          }
        />
        <Calculator drinks={this.state.drinks} weight={this.state.basicData.weight * WEIGHTS[this.state.basicData.weightUnit]} sex={this.state.basicData.sex} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    backgroundColor: '#DDDDDD',
    padding: 10,
    margin: 2,
    borderRadius: 5
  }
});

const AppNavigator = createStackNavigator(
  {
    Home: Try,
    "My Settings": Settings,
  },
  {
    initialRouteName: 'Home',
  },
);

export default createAppContainer(AppNavigator);
