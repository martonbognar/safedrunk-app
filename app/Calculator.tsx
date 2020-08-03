import React, {Component} from 'react';
import {calculateEbac} from './utils/BloodAlcohol';
import Effects from './Effects';
import Graph from './Graph';
import {View, Text, Button} from 'react-native';
import {Sex, WeightUnit} from './data/Units';
import {IDrink} from './data/Drink';

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
  ebac: number;
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
    };
  }

  render() {
    let effects;

    if (this.state.showEffects) {
      effects = (
        <View>
          <Button
            title="v Effects"
            onPress={() => this.setState({showEffects: false})}
          />
          <Effects percentage={this.props.ebac} />
        </View>
      );
    } else {
      effects = (
        <Button
          title="&gt; Effects"
          onPress={() => this.setState({showEffects: true})}
        />
      );
    }

    let graph;

    if (this.state.showGraph) {
      graph = (
        <View>
          <Button
            title="v Graph"
            onPress={() => this.setState({showGraph: false})}
          />
          <Graph
            drinks={this.props.drinks}
            basicData={this.props.basicData}
            currentTime={this.props.currentTime}
          />
        </View>
      );
    } else {
      graph = (
        <Button
          title="&gt; Graph"
          onPress={() => this.setState({showGraph: true})}
        />
      );
    }

    return (
      <View>
        <View>
          {effects}
        </View>
        {/* <View>{graph}</View> */}
      </View>
    );
  }
}
