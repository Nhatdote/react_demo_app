import React from 'react';
import {Dimensions, FlatList, ImageBackground, Linking, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {Feather, MaterialCommunityIcons} from "@expo/vector-icons";
import HTML from "react-native-render-html";
import {Avatar, Button, Caption, Title} from "react-native-paper";

import Style from "../js/Style";
import Constants from "../Constants";
import Color from "./Color";
import {openUrl} from "../js/main";


export default function Shop(props) {
    const {shop} = props;

    if (typeof shop === "undefined") {
        return <Caption style={{textAlign: 'center', marginTop: 50}}>Shop không tồn tại hoặc đã ngừng hoạt động</Caption>
    }

    return (
        <ScrollView>
            <SafeAreaView style={Style.container}>
                <ImageBackground source={shop.banner ? {uri: Constants.base_url + shop.banner} : null} style={styles.shopBannerImage}>
                    <View style={styles.shopAvatarWrap}>
                        {shop.avatar
                            ? <Avatar.Image size={66} style={{backgroundColor: 'transparent'}} source={{uri: Constants.base_url + shop.avatar}} />
                            : <Avatar.Text size={66} label={shop.name.split(' ').map(item => item.slice(0,1)).join('').slice(0, 2).toUpperCase()} color={'#fff'} style={{backgroundColor: 'tomato'}}/>
                        }
                    </View>
                </ImageBackground>
                <View>
                    <Text style={{fontWeight: 'bold', textAlign: 'center', fontSize: 24}}>{shop.name.toUpperCase()}</Text>
                    <View style={{flexDirection: 'row', justifyContent: 'center'}}>
                        <Button mode="contained" uppercase={false}
                                style={{height: 30, width: 140, borderRadius: 30, justifyContent: 'center', marginHorizontal: 10}}
                                labelStyle={{fontSize: 10, paddingBottom: 3}}
                                onPress={() => openUrl('tel:024141414512')}>
                            <Feather name="smartphone" size={10} /> Gọi
                        </Button>
                        {shop.latitude && shop.longitude
                            ? <Button mode="contained" uppercase={false} color={Color.info}
                                      style={{height: 30, width: 140, borderRadius: 30, justifyContent: 'center', marginHorizontal: 10}}
                                      labelStyle={{fontSize: 10, paddingBottom: 3}}
                                      onPress={() => openUrl(`https://google.com.vn/maps/dir/?api=1&destination=${shop.latitude}, ${shop.longitude}`)}>
                                <Feather name="map-pin" size={10} /> Chỉ đường
                            </Button>
                            : <Text style={{display: 'none'}}></Text>
                        }
                    </View>
                </View>
                <View style={Style.card}>
                    <Title style={{textAlign: 'center', color: Color.secondary}}>{shop.name.toUpperCase()}</Title>
                    <Text style={{paddingVertical: 5}}><Feather name="map-pin" /> {shop.full_address}</Text>
                    <Text style={{paddingVertical: 5}}><Feather name="smartphone" /> {shop.phone_st}</Text>

                    {shop.facebook
                        ? <TouchableOpacity onPress={() => openUrl(shop.facebook)}>
                            <Text style={{paddingVertical: 5, color: Color.blue}}><MaterialCommunityIcons name="facebook-box" /> Facebook: {shop.facebook}</Text>
                        </TouchableOpacity>
                        : <Text style={{display: 'none'}}></Text>
                    }
                    {shop.zalo
                        ? <TouchableOpacity onPress={() => openUrl(shop.zalo)}>
                            <Text style={{paddingVertical: 5, color: Color.blue}}><MaterialCommunityIcons name="facebook-messenger" /> Zalo: {shop.zalo}</Text>
                        </TouchableOpacity>
                        : <Text style={{display: 'none'}}></Text>
                    }
                </View>
                <View style={Style.card}>
                    <Title style={{textAlign: 'center', color: Color.secondary}}>{'Giới thiệu'}</Title>
                    {shop.description
                        ? <HTML html={shop.description} imagesMaxWidth={Dimensions.get('window').width - 40} />
                        : <Text style={{textAlign: 'center', paddingVertical: 10, color: Color.muted}}>{'Shop chưa thêm giới thiệu về shop'}</Text>
                    }
                </View>
                <Caption style={{textAlign: 'center', marginVertical: 15}}>{Constants.sologan}</Caption>
            </SafeAreaView>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    shopBannerImage: {
        width: Dimensions.get('window').width,
        height: 150,
        marginBottom: 15,
        backgroundColor: Color.purple
    },
    shopAvatarWrap: {
        width: 70,
        height: 70,
        position: 'absolute',
        bottom: -15,
        left: '50%',
        transform: [{translateX: -35}],
        backgroundColor: '#fff',
        borderRadius: 50,
        overflow: 'hidden',
        padding: 2
    },
});