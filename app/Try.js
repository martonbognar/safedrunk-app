import React, { Component } from 'react';
import { Text, View, FlatList, TextInput } from 'react-native';

export default class Try extends Component {
  constructor(props) {
    super(props);
    this.state = {
      beverages: [],
      filter: '',
    };

    this.updateList = this.updateList.bind(this);
  }

  updateList() {
    if (this.state.filter == "") {
      this.setState({ beverages: [] });
      return;
    }

    fetch(`https://safedrunk.com/api/beverages/filter/${this.state.filter}`)
      .then((response) => response.json())
      .then((responseJson) => {
        this.setState({
          beverages: responseJson.map((beverage) => {
            beverage.id = beverage.id.toString();
            return beverage;
          }),
        });
      })
      .catch((error) => {
        console.error(error);
      });
  }

  render() {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <TextInput
          placeholder="Search for a beverage..."
          value={this.state.filter}
          onChangeText={(text) => this.setState({ filter: text }, this.updateList)}
        />
        <FlatList
          data={this.state.beverages}
          renderItem={({ item }) => <Text>{item.name}, {item.percentage}</Text>}
        />
      </View>
    );
  }
}
