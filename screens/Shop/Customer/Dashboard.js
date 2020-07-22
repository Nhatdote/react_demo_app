import React, {useEffect, useState} from 'react';
import {SafeAreaView, View, Text, ScrollView, StyleSheet, Image, Dimensions, ImageBackground} from 'react-native';
import {Button, Avatar, Title, Paragraph} from "react-native-paper";
import { Feather } from '@expo/vector-icons';


import Style from "../../../js/style";
import Color from "../../../components/Color";

const Dashboard = () => {
    return(
        <SafeAreaView style={Style.container}>
            <ImageBackground source={{uri: 'https://tieudunghuutri.com/upload/shop/banner_1.jpg'}} style={styles.shopBannerImage}>
                <View style={styles.shopAvatarWrap}>
                    {/*<Avatar.Image size={66} style={{backgroundColor: 'transparent'}} source={{uri: 'https://tieudunghuutri.com/upload/shop/avatar_1.png'}} />*/}
                    <Avatar.Text size={66} label="NH" color={'#fff'} style={{backgroundColor: 'tomato'}}/>
                </View>
            </ImageBackground>
            <View>
                <Text style={{fontWeight: 'bold', textAlign: 'center', fontSize: 24}}>{'VNS Trading 2'}</Text>
                <View style={{flexDirection: 'row', justifyContent: 'center'}}>
                    <Text style={{marginHorizontal: 15, color: Color.info}}><Feather name="smartphone" /> 024141414512</Text>
                    <Text style={{marginHorizontal: 15, color: Color.secondary}}><Feather name="map-pin" /> Chỉ đường</Text>
                </View>
            </View>

        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    shopBannerImage: {
        width: Dimensions.get('window').width,
        height: 150,
        marginBottom: 40,
    },
    shopAvatarImage: {
        width: 66,
        height: 66,
    },
    shopAvatarWrap: {
        width: 70,
        height: 70,
        position: 'absolute',
        bottom: -35,
        left: '50%',
        transform: [{translateX: -35}],
        backgroundColor: '#fff',
        borderRadius: 50,
        overflow: 'hidden',
        padding: 2
    },

});

export default Dashboard;

