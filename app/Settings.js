import React, { Component } from 'react';
import { Text, View, Button, TextInput } from 'react-native';

export default class Settings extends Component {
  constructor(props) {
    super(props);
    const { navigation } = this.props;
    const basicData = navigation.getParam('basicData', { sex: 'fail', weight: '0', weightUnit: 'kg' });
    this.state = basicData;
  }

  componentWillUnmount() {
    this.props.navigation.state.params.onSave(this.state);
  }

  render() {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <TextInput
          placeholder="Sex"
          value={this.state.sex}
          onChangeText={(text) => this.setState({ sex: text }, this.updateList)}
        />
        <TextInput
          placeholder="Weight"
          value={this.state.weight.toString()}
          onChangeText={(text) => this.setState({ weight: text }, this.updateList)}
        />
        <TextInput
          placeholder="Weight unit"
          value={this.state.weightUnit}
          onChangeText={(text) => this.setState({ weightUnit: text }, this.updateList)}
        />
        <Button
          title="Go back"
          onPress={() => this.props.navigation.goBack()}
        />
      </View>
    );
  }
};
