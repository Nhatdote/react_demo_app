import React from 'react';
import {Caption, Subheading, Title} from "react-native-paper";
import {View, TouchableOpacity, Alert, Text, Clipboard} from "react-native";
import {Button} from "react-native-paper";
import Toast from "react-native-tiny-toast";

import Style from "../js/Style";
import Color from "./Color";
import {copyToClipboard} from "../js/main";

function AffiliateLink (props) {
    const {color, link, qr_code, label, onPress} = props;

    return (
        <View style={[Style.card, {alignItems: 'center', backgroundColor: color}]}>
            <Text style={{fontWeight: 'bold'}}>{label}</Text>
            <TouchableOpacity onPress={() => onPress()}>
                <Caption>{link}</Caption>
            </TouchableOpacity>
            <Button onPress={() => copyToClipboard(link)} mode={'contained'} style={{borderRadius: 30, height: 30, marginTop: 5}} labelStyle={{fontSize: 10}}>Sao chép</Button>
        </View>
    );
}

export default AffiliateLink;