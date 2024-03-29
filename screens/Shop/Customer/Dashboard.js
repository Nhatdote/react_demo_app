import React from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import {SafeAreaView, View, Text, ScrollView, StyleSheet, Dimensions, ImageBackground, Linking, TouchableOpacity, ActivityIndicator, RefreshControl, FlatList, Alert, Modal, TouchableHighlight} from 'react-native';
import {Button, Avatar, Title, Paragraph, Caption} from "react-native-paper";
import { Feather, MaterialCommunityIcons, AntDesign } from '@expo/vector-icons';
import HTML from 'react-native-render-html';
import Axios from "axios";

import Style from "../../../js/Style";
import Color from "../../../components/Color";
import Toast from "react-native-tiny-toast";
import ProductItem from "../../../components/ProductItem";
import Shop from "../../../components/Shop";

const Tab = createMaterialTopTabNavigator();

const initState = {
    shop: null,
    readyData: false,
    products: [],
    current_page: 1,
    last_page: 1,
    displayFilter: false
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
        navigation.setOptions({
            headerRight: () => {}
        });
        await Axios.get('/shop-view/'+id+'/dashboard')
            .then(res => {
                if (res.data.status === 1) {
                    this.setState({
                        shop: res.data.data,
                    });
                    navigation.setOptions({
                        headerTitle: res.data.data.name
                    });
                }else{
                    console.warn(res.data.msg);
                }
            })
            .catch(error => console.warn(error));

        await Axios.get('/shop-view/'+id+'/products')
            .then(res => {
                if(res.data.status === 1) {
                    this.setState({
                        products: res.data.data.data,
                        current_page: res.data.data.current_page,
                        last_page: res.data.data.last_page
                    });
                }else{
                    console.warn(res.data.msg);
                }
            })
            .catch(error => console.warn(error));
        this.setState({
            readyData: true,
            refreshing: false
        })
    };

    dashboard = () => {
        const {shop} = this.state;
        return <Shop shop={shop} />
    };

    products = () => {
        const {products, current_page, last_page, displayFilter} = this.state;
        const {navigation} = this.props;

        return (
            <SafeAreaView>
                <FlatList
                    ListHeaderComponent={() => <Text style={{textAlign: 'right', marginHorizontal: 6}}>Trang {current_page}/{last_page}</Text>}
                    style={{padding: 10}}
                    data={products}
                    renderItem={({ item }) => <ProductItem product={ item } onPress={() => navigation.push('ProductDetail', {
                        productId: item.id
                    })} />}
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
                    headerRight: () => <Button onPress={() => Toast.showSuccess('Bộc Lọc')} color={'#fff'} style={{marginRight: 5}}><AntDesign name="filter" size={16} />Lọc</Button>
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

        if (shop === null) {
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
