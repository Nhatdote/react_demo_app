import React from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import {SafeAreaView, View, Text, ScrollView, StyleSheet, Dimensions, ImageBackground, Linking, TouchableOpacity, ActivityIndicator, RefreshControl, FlatList, Alert} from 'react-native';
import {Button, Avatar, Title, Paragraph} from "react-native-paper";
import { Feather, MaterialCommunityIcons, AntDesign } from '@expo/vector-icons';
import HTML from 'react-native-render-html';
import Axios from "axios";

import Style from "../../../js/Style";
import Color from "../../../components/Color";
import Toast from "react-native-tiny-toast";
import ProductItem from "../../../components/ProductItem";

const Tab = createMaterialTopTabNavigator();

const initState = {
    shop: null,
    readyData: false,
    products: [],
    current_page: 1,
    last_page: 1
};

export default class Dashboard extends React.Component {
    constructor(props) {
        super(props);
        this.state = initState;
    }

    componentDidMount() {
        this._loadData();
    }

    _loadData = async () => {
        const {navigation, route} = this.props;
        const {id} = route.params;
        if (typeof route.state !== "undefined") {
            if (route.state.index === 1) {
                navigation.setOptions({
                    headerRight: () => <Button onPress={() => alert('This is a button!')} style={{marginRight: 10}}><AntDesign name="filter" size={16} />Lọc</Button>
                });
            }else{
                navigation.setOptions({
                    headerRight: () => {}
                })
            }
        }
        await Axios.get('/shop-view/'+id+'/dashboard')
            .then(res => {
                this.setState({
                    shop: res.data,
                });
                navigation.setOptions({
                    headerTitle: res.data.name
                });
            })
            .catch(error => console.warn(error));

        await Axios.get('/shop-view/'+id+'/products')
            .then(res => {
                this.setState({
                    products: res.data.data,
                    current_page: res.data.current_page,
                    last_page: res.data.last_page
                });
            })
            .catch(error => console.warn(error));
        this.setState({
            readyData: true,
            refreshing: false
        })
    };

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

    dashboard = () => {
        const {shop} = this.state;

        return (
            <ScrollView>
                <SafeAreaView style={Style.container}>
                    <ImageBackground source={shop.banner ? {uri: shop.banner} : null} style={styles.shopBannerImage}>
                        <View style={styles.shopAvatarWrap}>
                            {shop.avatar
                                ? <Avatar.Image size={66} style={{backgroundColor: 'transparent'}} source={{uri: shop.avatar}} />
                                : <Avatar.Text size={66} label={shop.name.split(' ').map(item => item.slice(0,1)).join('').slice(0, 2).toUpperCase()} color={'#fff'} style={{backgroundColor: 'tomato'}}/>
                            }
                        </View>
                    </ImageBackground>
                    <View>
                        <Text style={{fontWeight: 'bold', textAlign: 'center', fontSize: 24}}>{shop.name.toUpperCase()}</Text>
                        <View style={{flexDirection: 'row', justifyContent: 'center'}}>
                            <Button mode="contained" uppercase={false}
                                    style={{height: 25, width: 140, borderRadius: 30, justifyContent: 'center', marginHorizontal: 10}}
                                    labelStyle={{fontSize: 12, paddingBottom: 3}}
                                    onPress={() => this.openUrl('tel:024141414512')}>
                                <Feather name="smartphone" /> Gọi
                            </Button>
                            {shop.latitude && shop.longitude
                                ? <Button mode="contained" uppercase={false} color={Color.info}
                                          style={{height: 25, width: 140, borderRadius: 30, justifyContent: 'center', marginHorizontal: 10}}
                                          labelStyle={{fontSize: 12, paddingBottom: 3}}
                                          onPress={() => this.openUrl(`https://google.com.vn/maps/dir/?api=1&destination=${shop.latitude}, ${shop.longitude}`)}>
                                    <Feather name="map-pin" /> Chỉ đường
                                </Button>
                                : <Text></Text>
                            }
                        </View>
                    </View>
                    <View style={Style.card}>
                        <Title style={{textAlign: 'center', color: Color.secondary}}>{shop.name.toUpperCase()}</Title>
                        <Text style={{paddingVertical: 5}}><Feather name="map-pin" /> {shop.full_address}</Text>
                        <Text style={{paddingVertical: 5}}><Feather name="smartphone" /> {shop.phone_st}</Text>

                        {shop.facebook
                            ? <TouchableOpacity onPress={() => this.openUrl(shop.facebook)}>
                                <Text style={{paddingVertical: 5, color: Color.blue}}><MaterialCommunityIcons name="facebook-box" /> Facebook: {shop.facebook}</Text>
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
                        <Title style={{textAlign: 'center', color: Color.secondary}}>{'Giới thiệu'}</Title>
                        {shop.description
                            ? <HTML html={shop.description} imagesMaxWidth={Dimensions.get('window').width - 40} />
                            : <Text style={{textAlign: 'center', paddingVertical: 10, color: Color.muted}}>{'Shop chưa thêm giới thiệu về shop'}</Text>
                        }
                    </View>
                </SafeAreaView>
            </ScrollView>
        );
    };

    products = () => {
        const {products, current_page, last_page} = this.state;
        const {navigation} = this.props;

        return (
            <SafeAreaView>
                <FlatList
                    ListHeaderComponent={() => <Text style={{textAlign: 'right', marginHorizontal: 6}}>Trang {current_page}/{last_page}</Text>}
                    style={{margin: 10}}
                    data={products}
                    renderItem={({ item }) => <View style={{flex: 1, marginBottom: 6}}><ProductItem product={ item } onPress={() => navigation.push('ProductDetail', {
                        productId: item.id
                    })} /></View>}
                    keyExtractor={(item) => `${item.id}`}
                    ListEmptyComponent={() => <Text style={Style.noData}>Không có dữ liệu</Text>}
                    numColumns={2}
                />
            </SafeAreaView>
        );
    };

    render(){
        const {shop, readyData} = this.state;
        const {route, navigation} = this.props;

        if (typeof route.state !== "undefined") {
            if (route.state.index === 1) {
                navigation.setOptions({
                    headerRight: () => <Button onPress={() => alert('This is a button!')} style={{marginRight: 10}}><AntDesign name="filter" size={16} />Lọc</Button>
                });
            }else{
                navigation.setOptions({
                    headerRight: () => {}
                })
            }
        }

        if (!readyData) {
            return (
                <SafeAreaView style={{flex:1, justifyContent: 'center'}}>
                    <ActivityIndicator size="large" />
                </SafeAreaView>
            );
        }

        if (!shop) {
            return <Text style={{color: Color.muted, textAlign: 'center', fontSize: 24}}>Cửa hàng không tồn tại hoặc đã ngừng hoạt động </Text>;
        }
        return (
            <Tab.Navigator>
                <Tab.Screen name="Dashboard" component={this.dashboard} options={{title: 'Tổng quan'}} />
                <Tab.Screen name="Products" component={this.products} options={{title: 'Sản phẩm'}} />
            </Tab.Navigator>
        );
    }

}

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
    flatWrapper: {
        paddingHorizontal: 3,
        paddingVertical: 3
    },
    flatProduct: {
        flex: 1
    },
});
