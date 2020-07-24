import React from 'react';
import {StyleSheet} from 'react-native';

function Style() {
    return StyleSheet.create({
        container: {
            flex: 1,
            justifyContent: 'flex-start',
            alignItems: 'stretch',
            backgroundColor: 'whitesmoke',
        },
        noData: {
            fontSize: 24,
            fontWeight: '100',
            color: 'red',
            textAlign: 'center',
            marginTop: 100
        },
        card: {
            backgroundColor: '#fff',
            borderRadius: 5,
            shadowColor: '#cdcdcd',
            shadowOpacity: 0.3,
            shadowRadius: 5,
            padding: 10,
            margin: 10
        },
    })
}

export default Style();