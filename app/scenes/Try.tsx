import React, { Component } from 'react';
import { FlatList, Alert, StyleSheet, TouchableHighlight, TouchableOpacity } from 'react-native';
import { Container, Header, View, Button, Icon, Fab, Text, List, ListItem, Left, Body, Right } from 'native-base';

import DrinkComponent from '../Drink';
import { IDrink, loadDrinksFromStore, deleteDrinkFromStore, saveDrinkToStore } from '../data/Drink';
import Calculator from '../Calculator';
import { WeightUnit, Sex, stringToVolumeUnit, volumeUnitToString } from '../data/Units';
import { IBasicData, getBasicDataFromStorage } from '../data/BasicData';
import { intervalToText } from '../utils/Strings';
import { ScrollView } from 'react-native-gesture-handler';
import { SwipeListView } from 'react-native-swipe-list-view';
import { calculateEbac } from '../utils/BloodAlcohol';

interface LightState {
  drinks: IDrink[];
  keygen: number;
  basicData: IBasicData;
  currentTime: Date;
  currentBAC: number;
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
      currentBAC: 0,
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

    this.interval = setInterval(() => {
      const currentTime = new Date();
      self.setState({
        currentTime: currentTime,
        currentBAC: calculateEbac(
          self.state.drinks,
          currentTime,
          self.state.basicData,
        )
      })
    }, 10000);
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
          <Text style={{ fontSize: 25 }}>BAC: {this.state.currentBAC.toFixed(3)}%</Text>
          <Button small warning rounded
            onPress={() =>
              this.props.navigation.navigate('Settings')
            }><Text>⚙️</Text></Button>
        </View>
        <View>
          <SwipeListView
            disableRightSwipe
            data={this.state.drinks}
            renderItem={({ item }) => (
              <TouchableHighlight
                onPress={() => console.log('You touched me')}
                style={styles.rowFront}
                underlayColor={'#AAA'}
              >
                <View style={{ flexDirection: 'row' }}>
                  <Text>{item.percentage}%</Text>
                  <Text>{item.name}</Text>
                  <Text note>{item.volume} {volumeUnitToString(item.unit)}</Text>
                  <Text>{intervalToText(item.startTime)}</Text>
                </View>
              </TouchableHighlight>
            )}
            renderHiddenItem={(data) => (
              <View style={styles.rowBack}>
                <Text>Left</Text>
                <TouchableOpacity
                  style={[styles.backRightBtn, styles.backRightBtnLeft]}
                  onPress={() => this.duplicateDrink(data.item)}
                >
                  <Text style={styles.backTextWhite}>Duplicate</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.backRightBtn, styles.backRightBtnRight]}
                  onPress={() => this.removeDrink(data.item)}
                >
                  <Text style={styles.backTextWhite}>Delete</Text>
                </TouchableOpacity>
              </View>
            )}
            leftOpenValue={75}
            rightOpenValue={-150}
            previewRowKey={'0'}
            previewOpenValue={-40}
            previewOpenDelay={3000}
          />
        </View>
        <View style={{ borderWidth: 0.5, borderColor: 'black', margin: 10 }} />

        <View>
          <Calculator
            drinks={this.state.drinks}
            basicData={this.state.basicData}
            currentTime={this.state.currentTime}
            ebac={this.state.currentBAC}
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
    backgroundColor: 'white',
    flex: 1,
  },
  backTextWhite: {
    color: '#FFF',
  },
  rowFront: {
    alignItems: 'center',
    backgroundColor: '#CCC',
    borderBottomColor: 'black',
    borderBottomWidth: 1,
    justifyContent: 'center',
    height: 50,
  },
  rowBack: {
    alignItems: 'center',
    backgroundColor: '#DDD',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingLeft: 15,
  },
  backRightBtn: {
    alignItems: 'center',
    bottom: 0,
    justifyContent: 'center',
    position: 'absolute',
    top: 0,
    width: 75,
  },
  backRightBtnLeft: {
    backgroundColor: 'blue',
    right: 75,
  },
  backRightBtnRight: {
    backgroundColor: 'red',
    right: 0,
  },
});
