import React, {Component} from 'react';
import {Text, Button, View} from 'react-native';
import {intervalToText} from './utils/Strings';
import IDrink from './data/Drink';

interface DrinkProps extends IDrink {
  onRemove: Function;
  onDuplicate: Function;
}

interface DrinkState {
  timeText: string;
}

export default class Drink extends Component<DrinkProps, DrinkState> {
  timerID: number;

  constructor(props: Readonly<DrinkProps>) {
    super(props);

    this.state = {
      timeText: intervalToText(this.props.startTime),
    };

    this.timerID = 0;

    this.remove = this.remove.bind(this);
    this.duplicate = this.duplicate.bind(this);
  }

  componentDidMount() {
    this.timerID = setInterval(
      () =>
        this.setState({
          timeText: intervalToText(this.props.startTime),
        }),
      1000,
    );
  }

  componentWillUnmount() {
    clearInterval(this.timerID);
  }

  remove() {
    this.props.onRemove(this.props);
  }

  duplicate() {
    this.props.onDuplicate(this.props);
  }

  render() {
    return (
      <View>
        <Text>
          {this.props.name} ({this.props.percentage}%) · {this.state.timeText}
        </Text>
        <Button title="+" onPress={this.duplicate} />
        <Button title="-" onPress={this.remove} />
      </View>
    );
  }
}
