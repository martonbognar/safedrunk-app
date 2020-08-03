import React, {Component} from 'react';
import {Text, View, Button, TextInput, Alert} from 'react-native';
import {Picker} from '@react-native-community/picker';
import {
  IBasicData,
  getBasicDataFromStorage,
  saveBasicDataToStorage,
} from '../data/BasicData';
import {
  WeightUnit,
  weightUnitToString,
  Sex,
  listOfSexValues,
  sexToString,
  listOfWeightUnitValues,
} from '../data/Units';

interface SettingsProps {
  navigation: {
    navigate: Function;
  };
}

interface SettingsState extends IBasicData {}

export default class Settings extends Component<SettingsProps, SettingsState> {
  constructor(props: Readonly<SettingsProps>) {
    super(props);
    this.state = {
      sex: Sex.Female,
      weight: 60,
      weightUnit: WeightUnit.Kg,
    };

    this.saveData = this.saveData.bind(this);
  }

  componentDidMount() {
    getBasicDataFromStorage()
      .then(data => {
        if (data !== null) {
          this.setState(data);
        }
      })
      .catch(e => Alert.alert('', e.toString()));
  }

  saveData() {
    saveBasicDataToStorage(this.state)
      .then(_ => {
        this.props.navigation.navigate('Try', {basicDataUpdate: true});
      })
      .catch(e => Alert.alert('', e.toString()));
  }

  render() {
    const sexPicker = listOfSexValues.map(value => (
      <Picker.Item label={sexToString(value)} value={value} key={sexToString(value)} />
    ));
    const weightUnitPicker = listOfWeightUnitValues.map(value => (
      <Picker.Item label={weightUnitToString(value)} value={value} />
    ));

    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <Picker
          selectedValue={this.state.sex}
          style={{height: 50, width: 200}}
          onValueChange={itemValue => this.setState({sex: itemValue})}>
          {sexPicker}
        </Picker>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Text>Weight: </Text>
          <TextInput
            placeholder="65"
            keyboardType="numeric"
            value={this.state.weight.toString()}
            onChangeText={text => this.setState({weight: parseFloat(text)})}
          />
        </View>
        <Picker
          selectedValue={this.state.weightUnit}
          style={{height: 50, width: 200}}
          onValueChange={itemValue => this.setState({weightUnit: itemValue})}>
          {weightUnitPicker}
        </Picker>
        <Button title="Save" onPress={this.saveData} />
      </View>
    );
  }
}
