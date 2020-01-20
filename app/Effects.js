import React, { Component } from 'react';
import EFFECT_LIST from './data/effectList';
import ProgressBar from './ProgressBar';
import { View, Text, FlatList } from 'react-native';

class Effects extends Component {
    render() {
        let stage = null;

        EFFECT_LIST.forEach(function (obj) {
            if (this.props.percentage >= obj.percentageFloor && this.props.percentage < obj.percentageCeiling) {
                stage = obj;
            }
        }, this);

        if (stage === null) {
            return (null);
        }

        let behaviorList = [];
        stage.behavior.forEach(function (string, index) {
            behaviorList.push({ key: index, name: string });
        });

        let impairmentList = [];
        stage.impairment.forEach(function (string, index) {
            impairmentList.push({ key: index, name: string });
        });

        return (
            <View>
                {/* <ProgressBar percentage={this.props.percentage} /> */}
                <Text>
                    Effects
                </Text>
                <FlatList
                    data={behaviorList}
                    renderItem={
                        ({ item }) =>
                            <Text>{item.name}</Text>
                    }
                />
                <Text>
                    Impairment
                </Text>
                <FlatList
                    data={impairmentList}
                    renderItem={
                        ({ item }) =>
                            <Text>{item.name}</Text>
                    }
                />
            </View>
        );
    }
}

export default Effects;
