import React, { Component } from 'react';
import { FlatList, Alert, StyleSheet } from 'react-native';
import { Container, Header, View, Button, Icon, Fab, Text, List, ListItem, Left, Body, Right } from 'native-base';

import DrinkComponent from '../Drink';
import { IDrink, loadDrinksFromStore, deleteDrinkFromStore, saveDrinkToStore } from '../data/Drink';
import Calculator from '../Calculator';
import { WeightUnit, Sex, stringToVolumeUnit, volumeUnitToString } from '../data/Units';
import { IBasicData, getBasicDataFromStorage } from '../data/BasicData';
import { intervalToText } from '../utils/Strings';
import { ScrollView } from 'react-native-gesture-handler';

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
      basicDataUpdate: boolean;
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
    if (this.props.route === undefined) {
      return;
    }

    if (this.props.route.params?.drink !== undefined) {
      let drink = this.props.route.params.drink;
      drink.unit = stringToVolumeUnit(drink.unit);
      this.submitDrink(drink);
      this.props.navigation.setParams({ drink: undefined });
    }
    if (this.props.route.params?.basicDataUpdate === true) {
      this.loadBasicData();
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
    loadDrinksFromStore().then(tuple => this.setState({ drinks: tuple[0], keygen: tuple[1] + 1 }));
  }

  removeDrink(drink: IDrink) {
    let index = -1;
    this.state.drinks.forEach(function (d, i) {
      if (d.id === drink.id) {
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
    console.log('key: ', this.state.keygen);
    saveDrinkToStore(drink).then(_ => this.setState({
      drinks: this.state.drinks.concat([drink]),
      keygen: this.state.keygen + 1,
    }));
  }

  render() {
    const self = this;
    return (
      <View style={styles.container}>
        <View style={{ justifyContent: 'space-between', flexDirection: 'row', margin: 5, alignItems: 'center', borderBottomColor: 'black', borderBottomWidth: 2 }}>
          <Text style={{fontSize: 25}}>BAC: 0.34%</Text>
          <Button small warning rounded
            onPress={() =>
              this.props.navigation.navigate('Settings')
            }><Text>⚙️</Text></Button>
        </View>
        <View>
          <List
            dataArray={this.state.drinks}
            renderItem={({ item }) => (
              <ListItem avatar>
                <Left>
                  <Text>{item.percentage}%</Text>
                </Left>
                <Body>
                  {/* <DrinkComponent
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
                  /> */}
                  <Text>{item.name}</Text>
                <Text note>{item.volume} {volumeUnitToString(item.unit)}</Text>
                </Body>
                <Right>
                  <Text>{intervalToText(item.startTime)}</Text>
                </Right>
              </ListItem>
            )}
          />
        </View>
        <View style={{ borderWidth: 0.5, borderColor: 'black', margin: 10 }} />

        <View>
          <Calculator
            drinks={this.state.drinks}
            basicData={this.state.basicData}
            currentTime={this.state.currentTime}
          />
        </View>
        <Fab
          active={true}
          direction="up"
          style={{ backgroundColor: '#5067FF' }}
          position="bottomRight"
          onPress={() =>
            self.props.navigation.navigate('DrinkAdd')
          }>
          <Text>+</Text>
        </Fab>
      </View>
    );
  }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: 'space-between'
  }
})
