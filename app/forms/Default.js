import React, { Component } from 'react';
import { Text, View, FlatList, TextInput, TouchableHighlight, Alert, StyleSheet, Button, Picker } from 'react-native';
import { UNITS } from '../data/units';

export default class DefaultNewDrink extends Component {
  constructor(props) {
    super(props);

    this.state = {
      name: '',
      amount: '',
      unit: Object.keys(UNITS)[0],
      percentage: '',
      startTime: new Date(),
      beverage_id: undefined,
      beverageList: [],
      keyword: '',
      modifyStart: false,
    };

    this.handlePresetChanged = this.handlePresetChanged.bind(this);
    this.handleAmountChanged = this.handleAmountChanged.bind(this);
    this.handleKeywordChanged = this.handleKeywordChanged.bind(this);
    this.handleStartTimeChanged = this.handleStartTimeChanged.bind(this);
    this.handleUnitChanged = this.handleUnitChanged.bind(this);
    this.submitData = this.submitData.bind(this);
  }

  handlePresetChanged(value, index) {
    this.state.beverageList.forEach(function (beverage) {
      if (beverage.id === Number(value)) {
        this.setState({ name: beverage.name, percentage: beverage.percentage, beverage_id: beverage.id });
      }
    }, this);
  }

  handleAmountChanged(input) {
    input = input.replace(',', '.');
    if (isNaN(input)) {
      this.setState({ amount: '' });
    } else {
      this.setState({ amount: parseFloat(input) });
    }
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

  handleKeywordChanged(input) {
    const keyword = input.trim();
    this.setState({ keyword: keyword });

    if (keyword !== '') {
      const self = this;

      fetch(`https://safedrunk.com/api/beverages/filter/${keyword}`)
        .then((response) => response.json())
        .then((response) => {
          self.setState({ beverageList: response });
          if (response.length === 0) {
            self.setState({ beverage_id: undefined });
          } else {
            const beverage = response[0];
            self.setState({ name: beverage.name, percentage: beverage.percentage, beverage_id: beverage.id });
          }
        })
        .catch(function (error) {
          alert('There was a connection error. Please try reloading the page.');
        });
    } else {
      this.setState({ beverageList: [] });
    }
  }

  handleUnitChanged(value, index) {
    this.setState({ unit: value });
  }

  handleStartTimeChanged(input) {
    const arr = input.split(/[-T :]/).map((num) => parseInt(num));
    const date = new Date(arr[0], arr[1] - 1, arr[2], arr[3], arr[4]);
    this.setState({ startTime: date });
  }

  submitData() {
    this.props.onChange(this.state);
    this.setState({ name: '', amount: '', percentage: '', startTime: new Date() });
    this.props.cancel();
  }

  render() {
    const startString = this.state.startTime.getFullYear() + '-' + ('0' + (this.state.startTime.getMonth() + 1)).slice(-2) + '-' + ('0' + this.state.startTime.getDate()).slice(-2) + 'T' + ('0' + this.state.startTime.getHours()).slice(-2) + ':' + ('0' + this.state.startTime.getMinutes()).slice(-2);

    const drinks = [];

    this.state.beverageList.forEach(function (drink) {
      drinks.push(<Picker.Item value={drink.id} key={drink.id} label={`${drink.name} (${drink.percentage}%)`} />);
    });

    const unitList = Object.keys(UNITS).map((unit) => <Picker.Item key={unit} value={unit} label={UNITS[unit].name} />);

    return (
      <View>
        <TextInput
          placeholder="Search for a beverage..."
          value={this.state.keyword}
          onChangeText={this.handleKeywordChanged}
        />
        <Picker
          selectedValue={this.state.beverage_id}
          onValueChange={this.handlePresetChanged}>
          {drinks}
        </Picker>
        <TextInput
          placeholder="Amount"
          value={this.state.amount.toString()}
          onChangeText={this.handleAmountChanged}
        />
        <Picker
          selectedValue={this.state.unit}
          onValueChange={this.handleUnitChanged}>
          {unitList}
        </Picker>
        <Button
          onPress={this.submitData}
          title="Submit" />
        <Button
          onPress={this.props.cancel}
          title="Cancel" />
      </View>
    );
  }
}