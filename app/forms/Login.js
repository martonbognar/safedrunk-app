import React, { Component } from 'react';
import { Text, View, Button, TextInput, Picker } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';

export default class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: '',
            token: '',
            success: false,
        }

        this.login = this.login.bind(this);
        this.saveToken = this.saveToken.bind(this);
    }

    login() {
        fetch('https://safedrunk.com/api/airlock/token', {
            method: 'post',
            headers: {
                'Content-type': 'application/json',
            },
            body: JSON.stringify({ email: this.state.email, password: this.state.password, device_name: 'DUMMY' })
        })
            .then((response) => {
                if (response.status === 200) {
                    response.text().then(text => this.saveToken(text));
                } else {
                    this.setState({ token: JSON.stringify(response) });
                }
            })
            .catch(function (error) {
                alert('There was a connection error. Please try reloading the page.');
            });
    }

    async saveToken(token) {
        try {
            await AsyncStorage.setItem('token', token);
            await AsyncStorage.setItem('email', this.state.email);
            this.setState({ success: true });
        } catch (e) {
            // saving error
        }
    }

    render() {
        if (this.state.success) {
            return (<View><Text>Logged in.</Text></View>);
        } else {
            return (
                <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                    <TextInput
                        placeholder='e-mail'
                        keyboardType='email-address'
                        value={this.state.email}
                        onChangeText={(text) => this.setState({ email: text })}
                    />
                    <TextInput
                        placeholder='password'
                        textContentType='password'
                        secureTextEntry={true}
                        value={this.state.password}
                        onChangeText={(text) => this.setState({ password: text })}
                    />
                    <Text>{this.state.token}</Text>
                    <Button
                        title="Submit"
                        onPress={this.login}
                    />
                </View>
            );
        }
    }
};
