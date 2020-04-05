import React, {Component} from 'react';
import {Text, View, Button, TextInput, Picker} from 'react-native';
import {WEIGHTS} from '../data/Units';

export default class Settings extends Component {
  constructor(props) {
    super(props);
    const {navigation} = this.props;
    const basicData = navigation.getParam('basicData', {
      sex: 'fail',
      weight: '0',
      weightUnit: 'kg',
    });
    this.state = basicData;
  }

  componentWillUnmount() {
    this.props.navigation.state.params.onSave(this.state);
  }

  render() {
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
              this.setState({weight: text}, this.updateList)
            }
          />
        </View>
        <Picker
          selectedValue={this.state.weightUnit}
          style={{height: 50, width: 200}}
          onValueChange={itemValue => this.setState({weightUnit: itemValue})}>
          <Picker.Item label="Kg" value="kg" />
          <Picker.Item label="Lbs" value="lbs" />
          <Picker.Item label="Stone" value="stone" />
        </Picker>
        <Button
          title="Go back"
          onPress={() => this.props.navigation.goBack()}
        />
      </View>
    );
  }
}
