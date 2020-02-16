import React, { Component } from 'react';
import { Text, View, FlatList, TextInput, TouchableHighlight, Alert, StyleSheet, Button, Picker, ToastAndroid } from 'react-native';
import { UNITS } from '../data/units';
import DateTimePicker from '@react-native-community/datetimepicker';

export default class QuickAdd extends Component {
  constructor(props) {
    super(props);
    const { navigation } = this.props;
    const drinkDefault = { 
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

    const previousBeverage = navigation.getParam('previousBeverage', drinkDefault);

    if (previousBeverage === null) {
      this.state = drinkDefault;
    } else {
      this.state = previousBeverage;
    }

    // time picking utils
    this.currentDate = new Date ();
    this.show = false;

    this.hasValidInput = this.hasValidInput.bind(this);
    this.onTimeChanged = this.onTimeChanged.bind(this);
    this.showTimepicker = this.showTimepicker.bind(this);
  }

  hasValidInput() {
    if (this.state.name         === '' || 
        this.state.amount       === '' ||
        this.state.percentage   === '') 
      return false;
    
    return true;      
  }

  componentWillUnmount() {
    if (this.hasValidInput ())
      this.props.navigation.state.params.onSave(this.state);
  }

  onTimeChanged (event, selectedDate) {
    this.currentDate = selectedDate || this.currentDate;
    this.setState ({startTime: this.currentDate});
    this.show = false;
  };

  showTimepicker () {
    this.show = true;
    this.setState ({startTime: new Date ()});
  };

  render() {

    const pickerUnits = [];

    var id = 0;
    Object.keys(UNITS).forEach(function (unit) {
      pickerUnits.push(<Picker.Item label={unit} key={id++} value={unit}/>);
    });

    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Text>Name: </Text>
          <TextInput
            placeholder="Name (optional)"
            value={this.state.name.toString()}
            onChangeText={(text) => this.setState({ name: text })}
          /> 
        </View>

        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Text>Percentage: </Text>
          <TextInput
            placeholder="Percentage"
            keyboardType='numeric'
            value={this.state.percentage.toString()}
            onChangeText={(text) => this.setState({ percentage: text })}
          /> 
        </View>

        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Text>Amount: </Text>
          <TextInput
            placeholder="Amount"
            keyboardType='numeric'
            value={this.state.amount.toString()}
            onChangeText={(text) => this.setState({ amount: text })}
          /> 
        </View>

        <Picker 
          selectedValue={Object.keys(UNITS)[0]} 
          style={{height: 50, width: 200}}
          onValueChange={(itemValue) => this.setState({ unit: itemValue })}>
          {pickerUnits}
        </Picker>
        
        <Text onPress={this.showTimepicker} >time: {this.state.startTime.toTimeString()}</Text>
        {this.show && (<DateTimePicker
          testID="dateTimePicker"
          timeZoneOffsetInMinutes={0}
          value={this.currentDate}
          mode={'time'}
          is24Hour={true}
          display="default"
          onChange={this.onTimeChanged}
        />)}

        <Button
          title="Go back"
          onPress={() => this.props.navigation.goBack()}
        />
      </View>
    );
  }
};