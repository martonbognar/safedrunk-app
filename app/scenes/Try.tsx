import React, { Component } from 'react';
import { View, FlatList, Button, Alert } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';

import DrinkComponent from '../Drink';
import Drink from '../data/Drink';
import Calculator from '../Calculator';
import { WeightUnit, Sex } from '../data/Units';
import BasicData, { getBasicDataFromStorage } from '../data/BasicData';

interface LightState {
  drinks: Drink[];
  keygen: number;
  basicData: BasicData;
  showNewDrink: boolean;
}

interface LightProps {
  navigation: {
    navigate: Function;
  };
}

export default class Try extends Component<LightProps, LightState> {
  constructor(props: Readonly<LightProps>) {
    super(props);
    this.state = {
      drinks: [],
      keygen: 0,
      showNewDrink: false,
      basicData: {
        sex: Sex.Female,
        weight: 60,
        weightUnit: WeightUnit.Kg,
      },
    };

    this.loadBasicData = this.loadBasicData.bind(this);
    this.removeDrink = this.removeDrink.bind(this);
    this.duplicateDrink = this.duplicateDrink.bind(this);
    this.submitDrink = this.submitDrink.bind(this);
    this.toggleDrinkForm = this.toggleDrinkForm.bind(this);
  }

  componentDidMount() {
    this.loadBasicData();
  }

  loadBasicData() {
    getBasicDataFromStorage().then(data => {
      if (data !== null) {
        this.setState({ basicData: data });
      }
    }).catch(e => Alert.alert('', e.toString()));
  }

  removeDrink(drink: Drink) {
    let index = -1;
    this.state.drinks.forEach(function (d, i) {
      if (d.key === drink.key) {
        index = i;
      }
    });
    const tempDrinks = this.state.drinks;
    tempDrinks.splice(index, 1);
    this.setState({ drinks: tempDrinks });
  }

  duplicateDrink(drink: Drink) {
    let drinkCopy = Object.assign({}, drink);
    drinkCopy.startTime = new Date();
    this.submitDrink(drinkCopy);
  }

  submitDrink(drink: Drink) {
    drink.key = this.state.keygen.toString();
    drink.id = this.state.keygen;
    this.setState({
      drinks: this.state.drinks.concat([drink]),
      keygen: this.state.keygen + 1,
    });
  }

  toggleDrinkForm() {
    this.setState({ showNewDrink: !this.state.showNewDrink });
  }

  render() {
    const self = this;
    return (
      <View>
        {/* {this.addDrinkComponent()} */}

        <Button
          title="My Quick add"
          onPress={() =>
            this.props.navigation.navigate('Quick add', {
              onSave: self.submitDrink,
            })
          }
        />

        <Button
          title="Beverage list"
          onPress={() =>
            this.props.navigation.navigate('Beverage list', {
              onSave: self.submitDrink,
            })
          }
        />

        <Button
          title="Go to Settings"
          onPress={() =>
            this.props.navigation.navigate('Settings', {
              onSave: self.loadBasicData,
            })
          }
        />

        <Button
          title="Login"
          onPress={() => this.props.navigation.navigate('Login')}
        />

        <View style={{ borderWidth: 0.5, borderColor: 'black', margin: 10 }} />
        <FlatList
          data={this.state.drinks}
          renderItem={({ item }) => (
            <DrinkComponent
              key={item.key}
              id={item.id}
              name={item.name}
              percentage={item.percentage}
              startTime={item.startTime}
              unit={item.unit}
              volume={item.volume}
              onRemove={this.removeDrink}
              onDuplicate={this.duplicateDrink}
            />
          )}
        />
        <Calculator
          drinks={this.state.drinks}
          basicData={this.state.basicData}
        />
      </View>
    );
  }
}
