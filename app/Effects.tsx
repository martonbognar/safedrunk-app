import React, {Component} from 'react';
import {
  getIntoxicationLevel,
  getBehaviorForIntoxication,
  getImpairmentForIntoxication,
} from './data/EffectList';
import {View, Text, FlatList} from 'react-native';

interface EffectsProps {
  percentage: number;
}

export default class Effects extends Component<EffectsProps, {}> {
  render() {
    if (this.props.percentage < 0.001) {
      return null;
    }

    const intoxicationLevel = getIntoxicationLevel(this.props.percentage);
    const behaviorList = getBehaviorForIntoxication(intoxicationLevel);
    const impairmentList = getImpairmentForIntoxication(intoxicationLevel);

    return (
      <View>
        {/* <ProgressBar percentage={this.props.percentage} /> */}
        <Text>Effects</Text>
        <FlatList
          data={behaviorList}
          renderItem={({item}) => <Text>{item}</Text>}
          keyExtractor={(item, index) => index.toString()}
        />
        <Text>Impairment</Text>
        <FlatList
          data={impairmentList}
          renderItem={({item}) => <Text>{item}</Text>}
          keyExtractor={(item, index) => index.toString()}
        />
      </View>
    );
  }
}
