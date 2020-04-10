import React, { Component } from 'react';
import { Text, Button, View } from 'react-native';
import { intervalToText } from './utils/Strings';
import { IDrink } from './data/Drink';
import { volumeUnitToString } from './data/Units';

interface DrinkProps extends IDrink {
  onRemove: Function;
  onDuplicate: Function;
  currentTime: Date;
}

interface DrinkState {
}

export default class Drink extends Component<DrinkProps, DrinkState> {

  constructor(props: Readonly<DrinkProps>) {
    super(props);

    this.remove = this.remove.bind(this);
    this.duplicate = this.duplicate.bind(this);
  }

  remove() {
    this.props.onRemove(this.props);
  }

  duplicate() {
    this.props.onDuplicate(this.props);
  }

  render() {
    const timeText = intervalToText(this.props.startTime);
    return (
      <View>
        <Text>
          {this.props.volume} {volumeUnitToString(this.props.unit)} of {this.props.name} ({this.props.percentage}%) · {timeText}
        </Text>
        <Button title="+" onPress={this.duplicate} />
        <Button title="-" onPress={this.remove} />
      </View>
    );
  }
}
