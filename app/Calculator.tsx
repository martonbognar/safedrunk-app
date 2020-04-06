import React, {Component} from 'react';
import {calculateEbac} from './utils/BloodAlcohol';
import Effects from './Effects';
import Graph from './Graph';
import {View, Text} from 'react-native';
import {Sex, WeightUnit} from './data/Units';
import Drink from './data/Drink';

interface CalculatorState {
  ebac: number;
}

interface CalculatorProps {
  basicData: {
    sex: Sex;
    weight: number;
    weightUnit: WeightUnit;
  };
  drinks: Drink[];
}

export default class Calculator extends Component<
  CalculatorProps,
  CalculatorState
> {
  timerID: number;

  constructor(props: Readonly<CalculatorProps>) {
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
    const ebac = calculateEbac(
      this.props.drinks,
      new Date(),
      this.props.basicData,
    );
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
        <Graph drinks={this.props.drinks} basicData={this.props.basicData} />
      </View>
    );
  }
}
