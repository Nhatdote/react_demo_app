/*
import React from 'react';
import {SafeAreaView, View, Text, ScrollView, StyleSheet, Dimensions, ImageBackground, Linking, TouchableOpacity, ActivityIndicator, RefreshControl} from 'react-native';
import {Button, Avatar, Title, Paragraph} from "react-native-paper";
import { Feather, MaterialCommunityIcons, AntDesign } from '@expo/vector-icons';
import HTML from 'react-native-render-html';
import Axios from "axios";

import Style from "../../../js/style";
import Color from "../../../components/Color";
import Toast from "react-native-tiny-toast";

const initState = {
    index: 0,
    routes: [
        { key: 'first', title: 'Tổng quan' },
        { key: 'second', title: 'Sản phẩm' },
    ],
    shop: null,
    refreshing: false,
    readyData: false
};

export default class Dashboard extends React.Component{
    constructor(props) {
        super(props);
        this.state = initState;
    }

    componentDidMount() {
        const {navigation, route} = this.props;
        const {id} = route.params;

        Axios.get('/shop-view/'+id+'/dashboard')
            .then(res => {
                if (res.data.status === 1) {
                    this.setState({
                        readyData: true,
                        shop: res.data.data
                    });
                    navigation.setOptions({
                        headerTitle: res.data.data.name
                    });
                }else{
                    Toast.show('Đã xảy ra lỗi trong quá trình tải dữ liệu shop');
                }
            })
            .catch(error => console.warn(error));

        Axios.get('/shop-view/'+id+'/products')
            .then(res => {
                //console.log(res.data);
                if (res.data.status === 1) {
                    Toast.show('lay du lieu thanh cong');
                }else{
                    Toast.show('Đã xảy ra lỗi trong quá trình tải dữ liệu sản phẩm');
                }
            })
            .catch(error => console.warn(error));
    }

    openUrl = (url) => {
        Linking.canOpenURL(url).then(supported => {
            if (supported) {
                return Linking.openURL(url);
            } else {
                Toast.show('Không thể mở');
                return;
            }
        }).catch(error => console.warn('Không thể open Link___', error));
    };

    FirstRoute = () => {
        const {shop, refreshing} = this.state;
        return (
            <ScrollView
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={() => this.onRefresh()} />
                }
            >
                <SafeAreaView style={Style.container}>
                    <ImageBackground source={shop.banner ? {uri: 'shop.banner'} : null} style={styles.shopBannerImage}>
                        <View style={styles.shopAvatarWrap}>
                            {shop.avatar
                                ? <Avatar.Image size={66} style={{backgroundColor: 'transparent'}} source={{uri: shop.avatar}} />
                                : <Avatar.Text size={66} label={shop.name.split(' ').map(item => item.slice(0,1)).join('').slice(0, 2).toUpperCase()} color={'#fff'} style={{backgroundColor: 'tomato'}}/>
                            }
                        </View>
                    </ImageBackground>
                    <View style={{marginBottom: 20}}>
                        <Text style={{fontWeight: 'bold', textAlign: 'center', fontSize: 24}}>{shop.name.toUpperCase()}</Text>
                        <View style={{flexDirection: 'row', justifyContent: 'center'}}>
                            <TouchableOpacity onPress={() => this.openUrl('tel:024141414512')}>
                                <Button mode={'contained'} color={Color.info} style={{paddingVertical: 0, marginHorizontal: 5}} uppercase={false}><Feather name="smartphone" /> Gọi</Button>
                            </TouchableOpacity>
                            {shop.latitude && shop.longitude
                                ? <TouchableOpacity onPress={() => this.openUrl(`https://google.com.vn/maps/dir/?api=1&destination=${shop.latitude}, ${shop.longitude}`)}>
                                    <Button mode={'contained'} color={Color.purple} style={{paddingVertical: 0, marginHorizontal: 5}} uppercase={false}><Feather name="map-pin" /> Chỉ đường</Button>
                                </TouchableOpacity>
                                : <Text></Text>
                            }
                        </View>
                    </View>
                    <View style={Style.card}>
                        <Text style={{textAlign: 'center', fontWeight: 'bold', color: Color.secondary, marginBottom: 15, fontSize: 20}}>{shop.name.toUpperCase()}</Text>
                        <Text style={{paddingVertical: 5}}><Feather name="map-pin" /> {shop.full_address}</Text>
                        <Text style={{paddingVertical: 5}}><Feather name="smartphone" /> {shop.phone_st}</Text>

                        {shop.facebook
                            ? <TouchableOpacity onPress={() => this.openUrl(shop.facebook)}>
                                <Text style={{paddingVertical: 5, color: Color.blue}}><MaterialCommunityIcons name="facebook-box" /> Facebook {shop.facebook}</Text>
                            </TouchableOpacity>
                            : <Text></Text>
                        }
                        {shop.zalo
                            ? <TouchableOpacity onPress={() => this.openUrl(shop.zalo)}>
                                <Text style={{paddingVertical: 5, color: Color.blue}}><MaterialCommunityIcons name="facebook-messenger" /> Zalo: {shop.zalo}</Text>
                            </TouchableOpacity>
                            : <Text></Text>
                        }
                    </View>
                    <View style={Style.card}>
                        <Text style={{textAlign: 'center', fontWeight: 'bold', color: Color.secondary, marginBottom: 15, fontSize: 20}}>Giới thiệu về Shop 2</Text>
                        {shop.description
                            ? <HTML html={shop.description} imagesMaxWidth={Dimensions.get('window').width - 40} />
                            : <Text style={{textAlign: 'center', paddingVertical: 10, color: Color.muted}}>{'Shop chưa thêm giới thiệu về shop'}</Text>
                        }
                    </View>
                </SafeAreaView>
            </ScrollView>
        );
        
    };

    SecondRoute = () => {
        return (
            <SafeAreaView>
                <View style={Style.card}>
                    <Text style={{textAlign: 'center', fontWeight: 'bold', color: Color.secondary, marginBottom: 15, fontSize: 20}}>Tất cả sản phẩm</Text>
                </View>
            </SafeAreaView>
        );
    };

    handleChangeTab = (index) => {
        const {navigation} = this.props;
        this.setState({index: index});
        {index === 1
            ? navigation.setOptions({
                headerRight: () => <Button onPress={() => alert('This is a button!')} style={{marginRight: 10}}><AntDesign name="filter" size={16} />Lọc</Button>
            })
            :  navigation.setOptions({
                headerRight: () => {}
            })
        }
    };

    onRefresh() {
        this.setState({refreshing: true});
        //this.setState(initState);
    };

    render() {
        const renderScene = SceneMap({
            first: this.FirstRoute,
            second: this.SecondRoute,
        });
        const {index, routes, shop, readyData, refreshing} = this.state;

        if (!readyData) {
            return (
                <SafeAreaView style={{flex:1, justifyContent: 'center'}}>
                    <ActivityIndicator size="large" />
                </SafeAreaView>
            );
        }else{
            return (
                <SafeAreaView style={{flex: 1, justifyContent: 'center'}}>
                    {!shop
                        ? <Text style={{color: Color.muted, textAlign: 'center', fontSize: 24}}>Cửa hàng không tồn tại hoặc đã ngừng hoạt động </Text>
                        : (
                            <TabView
                                onSwipeStart={() => Toast.show('drag...')}
                                style={{color: 'red', backgroundColor: 'red'}}
                                navigationState={{ index, routes }}
                                renderScene={renderScene}
                                onIndexChange={index => this.handleChangeTab(index)}
                                initialLayout={initialLayout}
                            />
                        )
                    }
                </SafeAreaView>
            );
        }
    }
}

const initialLayout = { width: Dimensions.get('window').width};

const styles = StyleSheet.create({
    shopBannerImage: {
        width: Dimensions.get('window').width,
        height: 150,
        marginBottom: 15,
        backgroundColor: Color.purple
    },
    shopAvatarImage: {
        width: 66,
        height: 66,
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


*/
