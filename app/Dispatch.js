import React, { Component } from 'react';
import { View, Text, Button } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import Sessions from './Sessions';

export default class Dispatch extends Component {
    constructor(props) {
        super(props);
        this.state = {
            token: '',
            email: '',
            loggedIn: false,
        };

        this.getDataFromStorage = this.getDataFromStorage.bind(this);
    }

    componentDidMount() {
        this.getDataFromStorage().then(() =>
            fetch(`https://safedrunk.com/api/personal`, {
                headers: {
                    'Authorization': 'Bearer ' + this.state.token,
                }
            })
                .then((response) => {
                    if (response.status === 200) {
                        this.setState({ loggedIn: true });
                    }
                }));
    }

    async getDataFromStorage() {
        try {
            const token = await AsyncStorage.getItem('token');
            const email = await AsyncStorage.getItem('email');
            if (token !== null && email !== null) {
                this.setState({ token: token, email: email });
            }
        } catch (e) {
            // error reading value
        }
    }

    render() {
        if (this.state.loggedIn) {
            return (<Sessions token={this.state.token} />);
        } else {
            return (
                <View>
                    <Button
                        title="Login"
                        onPress={() => this.props.navigation.navigate('Login')} />

                    <Button
                        title="Try it out"
                        onPress={() => this.props.navigation.navigate('Try')} />
                </View>
            );
        }
    }
};
