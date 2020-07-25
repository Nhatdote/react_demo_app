import React from 'react';
import {SafeAreaView, StyleSheet, Text, View} from 'react-native';
import {Caption, Title, Paragraph} from "react-native-paper";
import { Fontisto } from '@expo/vector-icons';
import HTML from 'react-native-render-html';

import Style from "../js/Style";

const NotificationDetail = (props) => {
    const {route} = props;
    const {notification} = route.params;

    return (
        <SafeAreaView style={Style.container}>
            <View style={Style.card}>
                <Title>{notification.title}</Title>
                <View style={{flexDirection: 'row', justifyContent: 'flex-end'}}>
                    <Caption style={{marginRight: 10}}><Fontisto name="earth" /> {notification.notify === 'notify' ? 'Thông báo' : 'Hệ thống'}</Caption>
                    <Caption><Fontisto name="clock" /> {notification.created_time}</Caption>
                </View>
                <HTML containerStyle={{marginTop: 20}} html={notification.content}/>
            </View>
            <Caption style={{textAlign: 'center'}}>{notification.created_detail}</Caption>
        </SafeAreaView>
    );
};

export default NotificationDetail;