import React, { Component } from 'react';
import {
  Text,
  View,
  TextInput,
  Alert,
  Button,
  Picker,
} from 'react-native';
import { VolumeUnit, listOfVolumeUnitValues, volumeUnitToString } from '../data/Units';
import DateTimePicker from '@react-native-community/datetimepicker';

interface Beverage {
  id: number;
  name: string;
  percentage: number;
}

interface DrinkAddState {
  name: string;
  beveragePercentage: null | number;
  manualPercentage: null | number;
  startTime: Date;
  unit: VolumeUnit;
  volume: null | number;
  modifyStart: boolean;
  beverageList: Beverage[];
  beverageId: null | number;
  keyword: string;
  stage: Selection;
  loading: boolean;
  dateTimeChange: DateTimeChange;
}

interface DrinkAddProps {
  navigation: {
    navigate: Function;
    goBack: Function;
  };
  route: {
    params: {
      onSubmit: Function;
    }
  }
}

enum Selection {
  Initial,
  Quick,
  Beverage,
}

enum DateTimeChange {
  None,
  Date,
  Time,
}

export default class DefaultNewDrink extends Component<DrinkAddProps, DrinkAddState> {
  constructor(props: Readonly<DrinkAddProps>) {
    super(props);

    this.state = {
      name: '',
      volume: null,
      unit: listOfVolumeUnitValues[0],
      beveragePercentage: null,
      manualPercentage: null,
      startTime: new Date(),
      beverageId: null,
      beverageList: [],
      keyword: '',
      modifyStart: false,
      stage: Selection.Initial,
      loading: false,
      dateTimeChange: DateTimeChange.None,
    };

    this.handlePercentageChange = this.handlePercentageChange.bind(this);
    this.handleBeverageChange = this.handleBeverageChange.bind(this);
    this.handleKeywordChange = this.handleKeywordChange.bind(this);
    this.handleVolumeChange = this.handleVolumeChange.bind(this);
    this.handleUnitChange = this.handleUnitChange.bind(this);
    this.submit = this.submit.bind(this);
    this.percentageScreen = this.percentageScreen.bind(this);
    this.onTimeChanged = this.onTimeChanged.bind(this);
    this.timeSelector = this.timeSelector.bind(this);
    this.volumeSelectScreen = this.volumeSelectScreen.bind(this);
  }

  handlePercentageChange(value: string): void {
    value = value.replace(',', '.');
    const numeric = parseFloat(value);
    if (isNaN(numeric)) {
      this.setState({ manualPercentage: null });
    } else {
      this.setState({ manualPercentage: numeric });
    }
  }

  handleBeverageChange(value: number): void {
    this.state.beverageList.forEach(function (beverage) {
      if (beverage.id === value) {
        this.setState({
          name: beverage.name,
          percentage: beverage.percentage,
          beverageId: beverage.id,
        });
      }
    }, this);
  }

  handleKeywordChange(input: string): void {
    const keyword = input.trim();
    this.setState({ keyword: keyword, loading: true });

    if (keyword !== '') {
      const self = this;

      fetch(`https://safedrunk.com/api/public/beverages/filter/${keyword}`)
        .then(response => response.json())
        .then(response => {
          self.setState({ beverageList: response });
          if (response.length === 0) {
            self.setState({ beverageId: null, loading: false });
          } else {
            const beverage = response[0];
            self.setState({
              name: beverage.name,
              beveragePercentage: beverage.percentage,
              beverageId: beverage.id,
              loading: false,
            });
          }
        })
        .catch(function () {
          Alert.alert('There was a connection error. Please try reloading the page.');
        });
    } else {
      this.setState({ beverageList: [] });
    }
  }

  handleVolumeChange(value: string): void {
    value = value.replace(',', '.');
    const numeric = parseFloat(value);
    if (isNaN(numeric)) {
      this.setState({ volume: null });
    } else {
      this.setState({ volume: numeric });
    }
  }

  handleUnitChange(value: VolumeUnit): void {
    this.setState({ unit: value });
  }

  submit(): void {
    const drinkData = {
      name: this.state.name,
      volume: this.state.volume,
      unit: this.state.unit,
      startTime: this.state.startTime,
      beverageId: null,
    };
    if (this.state.stage === Selection.Beverage) {
      drinkData.beverageId = this.state.beverageId;
      drinkData.percentage = this.state.beveragePercentage;
    } else {
      drinkData.percentage = this.state.manualPercentage;
    }
    this.props.navigation.navigate('Try', { drink: drinkData });
  }

  percentageScreen(): Element {
    const drinks = this.state.beverageList.map(drink =>
      <Picker.Item
        value={drink.id}
        key={drink.id}
        label={`${drink.name} (${drink.percentage}%)`}
      />,
    );

    let picker = this.state.loading ?
      <Text>Loading...</Text>
      :
      this.state.beverageList.length == 0 ?
        <Text>No results.</Text>
        :
        <Picker
          selectedValue={this.state.beverageId}
          onValueChange={this.handleBeverageChange}>
          {drinks}
        </Picker>;

    const hairline = {
      backgroundColor: '#A2A2A2',
      height: 2,
      width: "100%",
      marginVertical: 10,
    };

    return (
      <View>
        <Text>Enter the alcohol percentage of your drink:</Text>

        <TextInput
          placeholder="Percentage"
          keyboardType="numeric"
          value={this.state.manualPercentage === null ? '' : this.state.manualPercentage.toString()}
          onChangeText={this.handlePercentageChange}
        />

        <Button title="Continue" onPress={() => this.setState({ stage: Selection.Quick })} />

        <View style={hairline} />
        <Text style={{ alignSelf: 'center' }}>OR</Text>
        <View style={hairline} />

        <Text>Or select it from our database:</Text>

        <TextInput
          placeholder="Search for a beverage..."
          value={this.state.keyword}
          onChangeText={this.handleKeywordChange}
        />

        {picker}

        <Button title="Continue" onPress={() => this.setState({ stage: Selection.Beverage })} />
      </View>
    );
  }

  onTimeChanged(_: any, selectedDate: Date | undefined) {
    let selected = selectedDate || new Date();
    // Alert.alert(selected.toISOString());
    this.setState({ startTime: selected, dateTimeChange: DateTimeChange.None });
  };

  timeSelector(): Element {
    if (this.state.dateTimeChange === DateTimeChange.None) {
      const self = this;
      return <View>
        <Button title="Change start date" onPress={_ => self.setState({ dateTimeChange: DateTimeChange.Date })} />
        <Button title="Change start time" onPress={_ => self.setState({ dateTimeChange: DateTimeChange.Time })} />
      </View>
    } else {
      const mode = this.state.dateTimeChange === DateTimeChange.Date ? 'date' : 'time';
      return <DateTimePicker
        value={this.state.startTime}
        mode={mode}
        is24Hour={true}
        display="default"
        onChange={this.onTimeChanged}
      />
    }
  }

  volumeSelectScreen(): Element {
    const unitList = listOfVolumeUnitValues.map(unit => (
      <Picker.Item key={unit} value={unit} label={volumeUnitToString(unit)} />
    ));

    return (
      <View>
        <TextInput
          placeholder="Volume"
          keyboardType="numeric"
          value={this.state.volume === null ? '' : this.state.volume.toString()}
          onChangeText={this.handleVolumeChange}
        />

        <Picker
          selectedValue={this.state.unit}
          onValueChange={this.handleUnitChange}>
          {unitList}
        </Picker>

        {this.timeSelector()}

        <Button title="Submit" onPress={this.submit} />
      </View>
    )
  }

  render() {
    switch (this.state.stage) {
      case Selection.Initial:
        return this.percentageScreen();
      default:
        return this.volumeSelectScreen();
    }
  }
}
