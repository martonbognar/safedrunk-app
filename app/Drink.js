import React, { Component } from 'react';
import { Text } from 'react-native';
import { intervalToText } from './utils/strings.js';

export default class Drink extends Component {
    constructor(props) {
        super(props);

        this.state = {
            //favorite: !!this.props.favoriteId,
            timeText: intervalToText(this.props.startTime),
        };

        this.remove = this.remove.bind(this);
        this.duplicate = this.duplicate.bind(this);
        //this.favorite = this.favorite.bind(this);
    }

    componentDidMount() {
        this.timerID = setInterval(
            () => this.setState({
                timeText: intervalToText(this.props.startTime),
            }),
            1000
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

    //   favorite() {

    //   }

    render() {
        return (
            <Text style={'color: rgb(100,0,100)'}>
                {this.props.name} ({this.props.percentage}%) · {this.state.timeText}
            </Text>
        );
    }
};
