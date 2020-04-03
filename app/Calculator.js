import React, { Component } from 'react';
import { calculateEbac } from './utils/ebac';
import Effects from './Effects';
import Graph from './Graph';
import { View, Text } from 'react-native';

class Calculator extends Component {
    constructor(props) {
        super(props);

        this.state = { value: 0 };
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
        const value = calculateEbac(this.props.drinks, new Date(), { sex: this.props.sex, weight: this.props.weight });
        if (value !== this.state.value) {
            this.setState({ value: value });
        }
    }

    componentWillUnmount() {
        clearInterval(this.timerID);
    }

    render() {
        return (
            <View>
                <Text>Blood alcohol content: {this.state.value}%</Text>
                <Effects percentage={this.state.value} />
                <Graph drinks={this.props.drinks} userData={{weight: this.props.weight, sex: this.props.sex}}/>
                </View>
        );
    }
}

export default Calculator;
