import React, { Component } from 'react';
import { Text, View, Button, BackHandler } from 'react-native';

export default class Settings extends Component {
  constructor(props) {
    super(props);
    const { navigation } = this.props;
    this.state = {
      basicData: navigation.getParam('basicData', { sex: 'fail', weight: '0', weightUnit: 'kg' }),
    };
  }

  componentWillUnmount() {
    this.props.navigation.state.params.onSave(this.state.basicData);
  }

  render() {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>{this.state.basicData.sex} {this.state.basicData.weight} {this.state.basicData.weightUnit}</Text>
        <Button
          title="Go back"
          onPress={() => this.props.navigation.goBack()}
        />
      </View>
    );
  }
};
