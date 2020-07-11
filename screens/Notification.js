import React from 'react'
import {Text, SafeAreaView, StyleSheet} from 'react-native'

import Color from "../components/Color"

const Notification = () => {
    return (
        <Text style={{marginTop: 50, color: Color.muted, textAlign: 'center', fontSize: 24}}>Notifications Page</Text>
    );
};

const styles = StyleSheet.create({

});

export default Notification;