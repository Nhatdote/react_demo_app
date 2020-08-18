import React from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import {SafeAreaView, View, Text, ScrollView, StyleSheet, Dimensions, ImageBackground, Linking, TouchableOpacity, ActivityIndicator, RefreshControl, FlatList, Alert, Modal, TouchableHighlight} from 'react-native';
import {Button, Avatar, Title, Paragraph, Caption} from "react-native-paper";
import { Feather, MaterialCommunityIcons, AntDesign, Ionicons } from '@expo/vector-icons';
import HTML from 'react-native-render-html';
import Axios from "axios";

import Constants from "../../../Constants";
import Style from "../../../js/Style";
import Color from "../../../components/Color";
import Toast from "react-native-tiny-toast";
import ProductItem from "../../../components/ProductItem";
import {UserContext} from "../../../contexts/UserProvider";
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
    static contextType = UserContext;
    constructor(props) {
        super(props);
        this.state = initState;
    }

    componentDidMount() {
        const {shop} = this.context;
        this.setState({
            shop: shop,
        });
        this._loadData();
    }

    _loadData = async () => {
        const {navigation, route} = this.props;
        const {user} = this.context;
        navigation.setOptions({
            headerRight: () => <Button onPress={() => Toast.showSuccess('Sửa thông tin')} color={'#fff'} style={{marginRight: 10}}><Ionicons name="ios-cog" size={22} /></Button>
        });

        await Axios.get('/account/store')
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

        await Axios.get('/account/product/list')
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
        this.setState({readyData: true});
    };

    dashboard = () => <Shop shop={this.state.shop} />;

    products = () => {
        const {products, current_page, last_page, displayFilter} = this.state;
        const {navigation} = this.props;
        return (
            <SafeAreaView>
                <FlatList
                    ListHeaderComponent={() => <Text style={{textAlign: 'right', marginHorizontal: 6}}>Trang {current_page}/{last_page}</Text>}
                    style={{padding: 5}}
                    data={products}
                    renderItem={({ item }) =><ProductItem product={ item } onPress={() => navigation.navigate('ProductDetail', {
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
        const {shop, products, current_page, last_page, readyData} = this.state;
        const {route, navigation} = this.props;

        if (typeof route.state !== "undefined") {
            if (route.state.index === 1) {
                navigation.setOptions({
                    headerRight: () => <Button onPress={() => Toast.showSuccess('Thêm sản phẩm')} color={'#fff'} style={{marginRight: 10}}><Ionicons name="ios-add-circle-outline" size={22} /></Button>
                });
            }else{
                navigation.setOptions({
                    headerRight: () => <Button onPress={() => Toast.showSuccess('Sửa thông tin')} color={'#fff'} style={{marginRight: 10}}><Ionicons name="ios-cog" size={22} /></Button>
                })
            }
        }
        if (!readyData) {
            return (
                <View style={{flex: 1, justifyContent: 'center'}}>
                    <ActivityIndicator size="large" />
                </View>
            );
        }
        if (shop === null) {
            return <Caption style={{textAlign: 'center', marginTop: 50}}>Cửa hàng không tồn tại hoặc đã ngừng hoạt động</Caption>;
        }
        return (
            <Tab.Navigator>
                <Tab.Screen name="Dashboard" component={this.dashboard} options={{title: 'Tổng quan'}} />
                <Tab.Screen name="Products" component={this.products} options={{title: 'Sản phẩm'}} />
            </Tab.Navigator>
        );
    }

}


