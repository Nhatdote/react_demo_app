import React from 'react'
import {StyleSheet} from 'react-native'
import {NavigationContainer} from "@react-navigation/native"
import Axios from 'axios'

import AppNavigator from "./AppNavigator"

Axios.defaults.baseURL = 'http://192.168.3.28';

export default class App extends React.Component {
    render() {
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