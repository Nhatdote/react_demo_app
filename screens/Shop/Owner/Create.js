import React from 'react';
import {SafeAreaView, View, Text} from "react-native";
import {Button, Caption, Paragraph, Title, Subheading} from "react-native-paper";

import Style from "../../../js/Style";
import Color from "../../../components/Color";



export default function Create() {

    return (
        <SafeAreaView style={[Style.container, {justifyContent: 'center'}]}>
            <Title style={{textAlign: 'center', color: Color.muted}}>Create Shop</Title>
        </SafeAreaView>
    );
}