import React, {Component} from 'react';
import {View, FlatList, Button} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';

import Drink from '../Drink';
import Calculator from '../Calculator';
import {
  WeightUnit,
  weightUnitToString,
  weightToKg,
  VolumeUnit,
  volumeUnitToString,
  volumeToCl,
} from '../data/Units';

export default class Try extends Component {
  constructor(props) {
    super(props);
    this.state = {
      beverages: [],
      filter: '',
      drinks: [],
      keygen: 0,
      showNewDrink: 'none',
      basicData: {
        sex: 'female',
        weight: 60,
        weightUnit: 'kg',
      },
    };

    this.getDataFromStorage = this.getDataFromStorage.bind(this);
    this.updateBasicData = this.updateBasicData.bind(this);
    this.removeDrink = this.removeDrink.bind(this);
    this.duplicateDrink = this.duplicateDrink.bind(this);
    this.submitDrink = this.submitDrink.bind(this);
    this.toggleDrinkForm = this.toggleDrinkForm.bind(this);
    this.cancelDrinkForm = this.cancelDrinkForm.bind(this);
    //this.addDrinkComponent = this.addDrinkComponent.bind(this);

    this.getDataFromStorage();
  }

  async getDataFromStorage() {
    try {
      const value = await AsyncStorage.getItem('basicData');
      if (value !== null) {
        this.setState({basicData: JSON.parse(value)});
      }
    } catch (e) {
      this.myAlert('', e.toString());
      // error reading value
    }
  }

  async updateBasicData(basicData) {
    this.setState({basicData: basicData});
    try {
      await AsyncStorage.setItem('basicData', JSON.stringify(basicData));
    } catch (e) {
      // saving errorhttps://github.com/react-native-community/react-native-device-info#getdevicename
    }
  }

  removeDrink(drink) {
    let index = -1;
    this.state.drinks.forEach(function(d, i) {
      if (d.key === drink.id) {
        index = i;
      }
    });
    const tempDrinks = this.state.drinks;
    tempDrinks.splice(index, 1);
    this.setState({drinks: tempDrinks}, this.saveDrinks);
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

  submitDrink(item) {
    let self = this;
    this.setState({
      drinks: self.state.drinks.concat([
        {
          key: self.state.keygen.toString(),
          name: item.name,
          percentage: item.percentage,
          amount: 5,
          unit: 'dl',
          startTime: new Date(),
        },
      ]),
      keygen: self.state.keygen + 1,
    });
  }

  toggleDrinkForm(param) {
    this.setState({showNewDrink: param});
  }

  cancelDrinkForm() {
    this.setState({showNewDrink: 'none'});
  }

  // addDrinkComponent() {
  //   switch (this.state.showNewDrink) {
  //     case 'none':
  //       return <View>
  //         <Button title="Quick add" onPress={() => this.toggleDrinkForm('quick')} />
  //         <Button title="Beverage list" onPress={() => this.toggleDrinkForm('default')} />
  //       </View>;
  //     case 'quick': return <QuickNewDrink onChange={this.submitDrink} cancel={this.cancelDrinkForm} />;
  //     default: return <DefaultNewDrink onChange={this.submitDrink} cancel={this.cancelDrinkForm} />;
  //   }
  // }

  render() {
    const self = this;
    return (
      <View>
        {/* {this.addDrinkComponent()} */}

        <Button
          title="My Quick add"
          onPress={() =>
            this.props.navigation.navigate('Quick add', {
              previousBeverage:
                self.state.drinks.length === 0 ? null : drinks[0],
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
              basicData: self.state.basicData,
              onSave: self.updateBasicData,
            })
          }
        />

        <Button
          title="Login"
          onPress={() => this.props.navigation.navigate('Login')}
        />

        <View style={{borderWidth: 0.5, borderColor: 'black', margin: 10}} />
        <FlatList
          data={this.state.drinks}
          renderItem={({item}) => (
            <Drink
              key={item.key}
              id={item.key}
              name={item.name}
              percentage={item.percentage}
              startTime={item.startTime}
              onRemove={this.removeDrink}
              onDuplicate={this.duplicateDrink}
            />
          )}
        />
        <Calculator
          drinks={this.state.drinks}
          weight={weightToKg(
            this.state.basicData.weight,
            this.state.basicData.weightUnit,
          )}
          sex={this.state.basicData.sex}
        />
      </View>
    );
  }
}
