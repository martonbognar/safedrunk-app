import React, { Component } from 'react';
import { Text, View, FlatList } from 'react-native';

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = { beverages: [{ id: '1', name: 'Dreher Bak', percentage: 7.3 }, { id: '2', name: 'Whiskey', percentage: 40 }] };

    fetch('https://safedrunk.com/api/beverages/filter/a')
      .then((response) => response.json())
      .then((responseJson) => {
        this.setState({
          beverages: responseJson,
        });
      })
      .catch((error) => {
        console.error(error);
      });
  }

  render() {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <FlatList
          data={this.state.beverages}
          renderItem={({ item }) => <Text>{item.name}, {item.percentage}</Text>}
        />
      </View>
    );
  }
}
