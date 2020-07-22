import React from 'react'
import {StyleSheet} from 'react-native'
import {NavigationContainer} from "@react-navigation/native"
import Axios from 'axios'

import AppNavigator from "./AppNavigator"
import AsyncStorage from "@react-native-community/async-storage";
import Toast from "react-native-tiny-toast";

const LocalUrl = 'http://192.168.3.28/api';
const ServerUrl = 'https://tieudunghuutri.com/api';
Axios.defaults.baseURL = LocalUrl;


export default class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            token: null
        }
    }

    componentDidMount() {
        this.getAuth();
    }

    getAuth = async () => {
        try {
            const value = await AsyncStorage.getItem('userToken');
            if (value !== null) {
                this.setState({token: value});

            }
        } catch(e) {
            // error reading value
        }
    };

    render() {
        const {token} = this.state;
        if (token) {
            Axios.defaults.headers.common['Authorization'] = 'Bearer' + token;
        }
        return (
            <NavigationContainer>
                <AppNavigator />
            </NavigationContainer>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'stretch',
        backgroundColor: '#fff',
        justifyContent: 'center',
        paddingHorizontal: 15
    }
});