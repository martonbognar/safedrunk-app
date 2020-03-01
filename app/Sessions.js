import React, { Component } from 'react';
import { intervalToText } from './utils/strings';
import { View, Button, Text, TextInput } from 'react-native';

export default class Sessions extends Component {
    constructor(props) {
        super(props);

        this.state = {
            sessions: [],
            name: '',
        };

        const self = this;

        fetch(`https://safedrunk.com/api/sessions`, {
            headers: {
                'Authorization': 'Bearer ' + this.props.token,
            }
        })
            .then((response) => response.json())
            .then(function (response) {
                self.setState({
                    sessions: response.map((session) => {
                        session.created_at = new Date(session.created_at);
                        return session;
                    })
                });
            })
            .catch(function (error) {
                alert(error);
            });

        this.handleNameChanged = this.handleNameChanged.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.removeSession = this.removeSession.bind(this);
    }

    handleNameChanged(event) {
        this.setState({ name: event.target.value });
    }

    handleSubmit() {
        const self = this;
        fetch('https://safedrunk.com/api/sessions', {
            method: 'post',
            headers: {
                'Content-type': 'application/json',
                'Authorization': 'Bearer ' + this.props.token,
            },
            body: JSON.stringify({ 'name': this.state.name }),
        })
            .then((response) => response.json())
            .then((response) => {
                const id = response.id;
                const sessions = [{ 'id': id, 'name': self.state.name, 'created_at': new Date() }].concat(self.state.sessions);
                self.setState({ sessions: sessions, name: '' });
            })
            .catch(function (error) {
                alert(error);
            });
    }

    removeSession(id) {
        // TODO: https://reactnative.dev/docs/alert.html
        // const confirmed = confirm('Are you sure you want to delete this session? This will also delete all logged drinks for this session.');
        // if (!confirmed) {
        //     return;
        // }

        const self = this;
        let index = -1;
        this.state.sessions.forEach(function (s, i) {
            if (s.id === id) {
                index = i;
            }
        });
        const temp = this.state.sessions;
        temp.splice(index, 1);

        fetch(`https://safedrunk.com/api/sessions/${id}`, {
            method: 'delete',
            headers: {
                'Authorization': 'Bearer ' + this.props.token,
            },
        })
            .then((response) => {
                self.setState({ sessions: temp });
            })
            .catch(function (error) {
                alert(error);
            });
    }

    render() {
        const sessions = this.state.sessions.map(function (session) {
            return <View key={session.id}><Text>{session.name} ({intervalToText(session.created_at)})</Text><Button title="Remove" onPress={() => this.removeSession(session.id)} /></View>
        }, this);

        return (
            <View>
                <TextInput
                    placeholder="New session"
                    value={this.state.name}
                    onChangeText={(text) => this.setState({ name: text })}
                />
                <Button title="Create" onPress={this.handleSubmit} />
                {sessions}
            </View>
        );
    }
}
