import React from 'react'
import {StyleSheet} from 'react-native'
import {NavigationContainer} from "@react-navigation/native"
import Axios from 'axios'

import AppNavigator from "./AppNavigator"
import AsyncStorage from "@react-native-community/async-storage";
import Toast from "react-native-tiny-toast";


export default class App extends React.Component {
    render() {
        return (
            <NavigationContainer>
                <AppNavigator />
            </NavigationContainer>
        );
    }
}
