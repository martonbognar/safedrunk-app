import React, {Component} from 'react';
import {calculateEbac} from './utils/ebac';
import Effects from './Effects';
import Graph from './Graph';
import {View, Text} from 'react-native';

export default class Calculator extends Component {
  timerID: number;

  constructor(props) {
    super(props);

    this.state = {ebac: 0};
    this.timerID = 0;
    this.calculate = this.calculate.bind(this);
  }

  componentDidMount() {
    this.calculate();
    this.timerID = setInterval(this.calculate, 5000);
  }

  componentDidUpdate() {
    this.calculate();
  }

  calculate() {
    const ebac = calculateEbac(this.props.drinks, new Date(), {
      sex: this.props.sex,
      weight: this.props.weight,
    });
    if (ebac !== this.state.ebac) {
      this.setState({ebac: ebac});
    }
  }

  componentWillUnmount() {
    clearInterval(this.timerID);
  }

  render() {
    return (
      <View>
        <Text>Blood alcohol content: {this.state.ebac}%</Text>
        <Effects percentage={this.state.ebac} />
        <Graph
          drinks={this.props.drinks}
          userData={{weight: this.props.weight, sex: this.props.sex}}
        />
      </View>
    );
  }
}
