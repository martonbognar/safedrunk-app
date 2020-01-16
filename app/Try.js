import React, { Component } from 'react';
import { Text, View, FlatList, TextInput, TouchableHighlight, Alert, StyleSheet } from 'react-native';
import { Drink } from './Drink.js';

export default class Try extends Component {
  constructor(props) {
    super(props);
    this.state = {
      beverages: [],
      filter: '',
      drinks: []
    };

    this.updateList = this.updateList.bind(this);
    this.onListItemPressed = this.onListItemPressed.bind(this);
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

  myAlert (alertTitle, alertText) {
    Alert.alert (
        alertTitle, 
        alertText, 
        [
          {text: 'Ask me later', onPress: () => console.log('Ask me later pressed')},
          {
            text: 'Cancel',
            onPress: () => console.log('Cancel Pressed'),
            style: 'cancel',
          },
          {text: 'OK', onPress: () => console.log('OK Pressed')},
        ]
        ,{cancelable: true})
  }

  onListItemPressed(item) {
    this.setState({
      drinks: this.state.drinks.concat ([{name: item.name, percentage: item.percentage}])
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
          renderItem={
            ({ item }) => 
              <TouchableHighlight 
                style={styles.button} 
                underlayColor={'rgb(100, 100, 100)'}
                onPress={() => this.onListItemPressed(item)}> 

                  <Text>{item.name}, {item.percentage}</Text> 

              </TouchableHighlight>
          }
        />
        <View style = {{borderWidth: 0.5, borderColor:'black', margin:10}} />
        <FlatList
          data={this.state.drinks}
          renderItem={
            ({ item }) =>  
              <Drink
                name={item.name}
                percentage={item.percentage}
                //onRemove={this.myAlert ('OnRemoveCallback', 'Item name: ' + item.name + 'Item percentage: ' + item.percentage)}
                //onDuplicate={this.myAlert ('OnduplicateCallback', 'Item name: ' + item.name + 'Item percentage: ' + item.percentage)}
              />
          }
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    backgroundColor: '#DDDDDD',
    padding: 10,
    margin: 2,
    borderRadius: 5
  }
})
