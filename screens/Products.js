import React from 'react'
import {ActivityIndicator, RefreshControl, StyleSheet, View, Text, SafeAreaView, FlatList, StatusBar} from "react-native";
import Axios from "axios";
import Toast from "react-native-tiny-toast";

import ProductItem from "../components/ProductItem";
import Color from "../components/Color";
import Style from "../js/Style";

export default class Products extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            products: [],
            refreshing: false,
            readyData: false
        };
    }

    componentDidMount() {
        this.loadData();
    }

    loadData(refresh = false) {
        let loading = null;
        if (refresh) {
            loading = Toast.show('Đang làm mới...', {duration: 5000});
        }
        Axios.get('/product/list/'+this.props.route.params.category.id)
            .then(res => {
                this.setState({
                    products: res.data,
                    refreshing: false,
                    readyData: true
                });
                if (refresh) {
                    Toast.hide(loading);
                    Toast.show('Đã làm mới sản phẩm', {duration: 500})
                }
            })
            .catch(error => console.log(error));
    }

    onRefresh() {
        this.setState({refreshing: true});
        this.loadData(true);
    }

    render() {
        const {products, refreshing, readyData} = this.state;
        const {route, navigation} = this.props;
        const {category} = route.params;
        navigation.setOptions({
            title: category.name ? category.name : 'Danh sách Sản phẩm'
        });

        return (
            <SafeAreaView style={Style.container}>
                {!readyData
                    ? <View style={{flex: 1, justifyContent: 'center'}}>
                        <ActivityIndicator size="large" />
                    </View>

                    : <FlatList
                        style={{margin: 10}}
                        refreshControl={
                            <RefreshControl refreshing={refreshing} onRefresh={() => this.onRefresh()} />
                        }
                        data={products}
                        renderItem={({ item }) => <View style={{flex: 1, marginBottom: 6}}><ProductItem product={ item } onPress={() => navigation.navigate('ProductDetail', {
                            productId: item.id
                        })} /></View>}
                        keyExtractor={(item) => `${item.id}`}
                        ListEmptyComponent={() => <Text style={Style.noData}>Không có dữ liệu</Text>}
                        numColumns={2}
                    />
                }
            </SafeAreaView>
        );
    }
}
