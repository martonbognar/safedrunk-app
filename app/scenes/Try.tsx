import React, { Component } from 'react';
import { View, FlatList, Button, Alert, StyleSheet } from 'react-native';

import DrinkComponent from '../Drink';
import { IDrink, loadDrinksFromStore, deleteDrinkFromStore, saveDrinkToStore } from '../data/Drink';
import Calculator from '../Calculator';
import { WeightUnit, Sex } from '../data/Units';
import { IBasicData, getBasicDataFromStorage } from '../data/BasicData';

interface LightState {
  drinks: IDrink[];
  keygen: number;
  basicData: IBasicData;
  currentTime: Date;
}

interface LightProps {
  navigation: {
    navigate: Function;
    setParams: Function;
  };
  route: {
    params: {
      drink: IDrink;
    }
  }
}

export default class Try extends Component<LightProps, LightState> {
  interval: number;

  constructor(props: Readonly<LightProps>) {
    super(props);
    this.state = {
      drinks: [],
      keygen: 0,
      basicData: {
        sex: Sex.Female,
        weight: 60,
        weightUnit: WeightUnit.Kg,
      },
      currentTime: new Date(),
    };

    this.interval = -1;

    this.loadBasicData = this.loadBasicData.bind(this);
    this.loadDrinks = this.loadDrinks.bind(this);
    this.removeDrink = this.removeDrink.bind(this);
    this.duplicateDrink = this.duplicateDrink.bind(this);
    this.submitDrink = this.submitDrink.bind(this);
  }

  componentDidMount() {
    this.loadBasicData();
    this.loadDrinks();
    const self = this;
    this.interval = setInterval(() => self.setState({ currentTime: new Date() }), 10000);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  componentDidUpdate() {
    if (this.props.route.params?.drink !== undefined) {
      this.submitDrink(this.props.route.params.drink);
      this.props.navigation.setParams({ drink: undefined });
    }
  }

  loadBasicData() {
    getBasicDataFromStorage().then(data => {
      if (data !== null) {
        this.setState({ basicData: data });
      }
    }).catch(e => Alert.alert('', e.toString()));
  }

  loadDrinks() {
    loadDrinksFromStore().then(drinks => this.setState({ drinks: drinks }));
  }

  removeDrink(drink: IDrink) {
    let index = -1;
    this.state.drinks.forEach(function (d, i) {
      if (d.key === drink.key) {
        index = i;
      }
    });
    const tempDrinks = this.state.drinks;
    tempDrinks.splice(index, 1);
    deleteDrinkFromStore(drink).then(_ => this.setState({ drinks: tempDrinks }));
  }

  duplicateDrink(drink: IDrink) {
    let drinkCopy = Object.assign({}, drink);
    drinkCopy.startTime = new Date();
    this.submitDrink(drinkCopy);
  }

  submitDrink(drink: IDrink) {
    drink.key = this.state.keygen.toString();
    drink.id = this.state.keygen;
    saveDrinkToStore(drink).then(_ => this.setState({
      drinks: this.state.drinks.concat([drink]),
      keygen: this.state.keygen + 1,
    }));
  }

  render() {
    const self = this;
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Button
            title="Settings"
            onPress={() =>
              this.props.navigation.navigate('Settings', {
                onSave: self.loadBasicData,
              })
            }
          />

          <Button
            title="+ New drink"
            onPress={() =>
              this.props.navigation.navigate('DrinkAdd')
            }
          />

          {/* <Button
            title="Login"
            onPress={() => this.props.navigation.navigate('Login')}
          /> */}

          <View style={{ borderWidth: 0.5, borderColor: 'black', margin: 10 }} />
        {/* </View>

        <View style={styles.list}> */}
        <FlatList
          data={this.state.drinks}
          renderItem={({ item }) => (
            <DrinkComponent
              key={item.key}
              id={item.id}
              name={item.name}
              percentage={item.percentage}
              startTime={item.startTime}
              unit={item.unit}
              volume={item.volume}
              onRemove={this.removeDrink}
              onDuplicate={this.duplicateDrink}
              currentTime={this.state.currentTime}
            />
          )}
        />
        <View style={{ borderWidth: 0.5, borderColor: 'black', margin: 10 }} />
        </View>

        <View style={styles.calculator}>
          
          <Calculator
            drinks={this.state.drinks}
            basicData={this.state.basicData}
            currentTime={this.state.currentTime}
          />
        </View>

      </View>
    );
  }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between'
  },
  header: {
    flex: 0.5,
    //justifyContent: 'flex-start'
    borderColor: 'blue',
    borderWidth: 1,
  },
  list: {
    flex: 0.3,
    // justifyContent: 'space-between',
    borderColor: 'green',
    borderWidth: 1,
  },
  calculator: {
    flex: 0.5,
    // justifyContent: 'flex-end',
    // alignContent: 'flex-end',
    borderColor: 'red',
    borderWidth: 1,
  }
})
