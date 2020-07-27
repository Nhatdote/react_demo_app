import React from 'react';
import {Caption, Title} from "react-native-paper";
import {View} from "react-native";

import Style from "../js/Style";
import Color from "./Color";
import {numberFormat} from "../js/main";

function Wallet (props) {
    const {color, value, label} = props;
    return (
        <View style={[Style.card, {alignItems: 'center', backgroundColor: color, paddingVertical: 25}]}>
            <Title style={{color: '#fff', fontSize: 30, marginBottom: 10}}>{numberFormat(value)} đ</Title>
            <Caption style={{color: '#fff'}}>{label}</Caption>
        </View>
    );
}

export default Wallet;