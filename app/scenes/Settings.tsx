import React, {Component} from 'react';
import {Text, View, Button, TextInput, Picker} from 'react-native';
import BasicData from '../data/BasicData';
import { WeightUnit, weightUnitToString } from '../data/Units';

interface SettingsProps {
  navigation: {
    navigate: Function;
    goBack: Function;
  };
  route: {
    params: {
      onSave: Function;
      basicData: BasicData;
    }
  }
}

interface SettingsState extends BasicData {}

export default class Settings extends Component<SettingsProps, SettingsState> {
  constructor(props: Readonly<SettingsProps>) {
    super(props);
    const {route} = this.props;
    const {basicData} = route.params;
    this.state = basicData;
  }

  componentWillUnmount() {
    this.props.route.params.onSave(this.state);
  }

  render() {
    const weightUnitPicker = [];
    for (let unit in WeightUnit) {
      weightUnitPicker.push(<Picker.Item label={weightUnitToString(WeightUnit[unit])} value={unit} />)
    }

    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <Picker
          selectedValue={this.state.sex}
          style={{height: 50, width: 200}}
          onValueChange={itemValue => this.setState({sex: itemValue})}>
          <Picker.Item label="Male" value="male" />
          <Picker.Item label="Female" value="female" />
        </Picker>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Text>Weight: </Text>
          <TextInput
            placeholder="65"
            keyboardType="numeric"
            value={this.state.weight.toString()}
            onChangeText={text =>
              this.setState({weight: parseFloat(text)})
            }
          />
        </View>
        <Picker
          selectedValue={this.state.weightUnit}
          style={{height: 50, width: 200}}
          onValueChange={itemValue => this.setState({weightUnit: itemValue})}>
          {weightUnitPicker}
        </Picker>
        <Button
          title="Go back"
          onPress={() => this.props.navigation.goBack()}
        />
      </View>
    );
  }
}
