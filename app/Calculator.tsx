import React, { Component } from 'react';
import { calculateEbac } from './utils/BloodAlcohol';
import Effects from './Effects';
import Graph from './Graph';
import { View, Text, Dimensions } from 'react-native';
import { Sex, WeightUnit } from './data/Units';
import { IDrink } from './data/Drink';

interface CalculatorState {
  showEffects: boolean;
  showGraph: boolean;
}

interface CalculatorProps {
  basicData: {
    sex: Sex;
    weight: number;
    weightUnit: WeightUnit;
  };
  drinks: IDrink[];
  currentTime: Date;
}

export default class Calculator extends Component<
  CalculatorProps,
  CalculatorState
  > {
  constructor(props: Readonly<CalculatorProps>) {
    super(props);
    this.state = {
      showEffects: true,
      showGraph: true,
    }
  }

  render() {
    const ebac = calculateEbac(
      this.props.drinks,
      new Date(),
      this.props.basicData,
    );

    return (
      <View style={{ flex: 1, justifyContent: 'space-between'}}>
        <View style={{ flex: 0.5}}>
          <Text>Blood alcohol content: {ebac}%</Text>
          <Effects percentage={ebac} />
        </View>
        <View style={{ flex: 0.5}}>
          <Graph drinks={this.props.drinks} basicData={this.props.basicData} currentTime={this.props.currentTime} />
        </View>
      </View>
    );
  }
}
