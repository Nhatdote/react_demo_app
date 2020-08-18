import React from 'react';
import {SafeAreaView, View, Text, ActivityIndicator, ScrollView, Image, Dimensions, StyleSheet, RefreshControl, TouchableOpacity, FlatList} from 'react-native';
import {Title, Avatar, Button, Caption} from 'react-native-paper';
import Axios from 'axios'
import Toast from "react-native-tiny-toast";

import Style from "../js/Style";
import Constants from "../Constants";
import Color from '../components/Color';
import ProductItem from '../components/ProductItem';

export default class Home extends React.Component {
    constructor(props) {
        super(props);
        this.state = ({
            banners: null,
            categories: [],
            categoryProducts: [],
            refreshing: false,
            readyData: false
        });
    }

    componentDidMount() {
        this._loadData(); 
    }

    _loadData = (refresh = false) => {
        let loading = null;
        if (refresh) {
            loading = Toast.show('Đang làm mới...', {duration: 5000});
        }
        Axios.get('/get-home')
            .then(res => {
                this.setState({
                    banners: res.data.banners,
                    categories: res.data.categories,
                    categoryProducts: res.data.categoryProducts,
                    readyData: true,
                    refreshing: false,
                });
                if (refresh) {
                    Toast.hide(loading);
                    Toast.show('Đã làm mới',  {duration: 500})
                }
            })
            .catch(error => console.warn(error));
    }

    onRefresh = () => {
        this.setState({refreshing: true});
        this._loadData(true);
    }

    renderCategories = () => {
        const {categories} = this.state;
        const {navigation} = this.props;

        return (
            <View style={{marginHorizontal: 7, marginBottom: 30}}>
                <ScrollView horizontal={true}>
                    {categories.map((item, index) => {
                        if (index % 2 == 0){ 
                            return (
                                <View key={index}>
                                    <TouchableOpacity style={[Style.card, styles.categoryItem]} onPress={() => navigation.navigate('Products', {
                                        category: item
                                    })}>
                                        <View style={{padding: 5, borderRadius: 50, backgroundColor: Color.alert_info}}>
                                            <Image style={{width: 40, height: 40}} source={{uri: Constants.base_url + item.avatar}} />
                                        </View>
                                        <Text numberOfLines={2} style={{fontSize: 10, textAlign: 'center'}}>{item.name}</Text>
                                    </TouchableOpacity>
                                    
                                    {typeof categories[index + 1] != "undefined"
                                        ? <TouchableOpacity style={[Style.card, styles.categoryItem]} onPress={() => navigation.navigate('Products', {
                                                category: categories[index + 1]
                                            })}>
                                            <View style={{padding: 5, borderRadius: 50, backgroundColor: Color.alert_info}}>
                                                <Image style={{width: 40, height: 40}} source={{uri: Constants.base_url + categories[index + 1].avatar}} />
                                            </View>
                                            <Text numberOfLines={2} style={{fontSize: 10, textAlign: 'center'}}>{categories[index + 1].name}</Text>
                                        </TouchableOpacity>
                                        : <View style={{display: 'none'}}></View>
                                    }
                                </View>
                            );
                        }
                    })}
                </ScrollView>
            </View>
        );
    }

    renderProducts () {
        const {categoryProducts} = this.state;
        const {navigation} = this.props;
        

        return (
            <View>
                {categoryProducts.map((item, index) => {
                    let products = item.products;
                    return (
                        <View style={{marginBottom: 30, marginHorizontal: 10}} key={index}>
                            <TouchableOpacity style={{backgroundColor: Color.secondary, width: (Dimensions.get('window').width / 1.8), padding: 10, borderRadius: 5, marginBottom: 5}} onPress={() => navigation.navigate('Products', {
                                category: item
                            })}>
                                <Text numberOfLines={1} style={{color: '#fff'}}>{item.name.toUpperCase()}</Text>
                            </TouchableOpacity>
                            <FlatList
                                data={products}
                                renderItem={({ item }) => <ProductItem style={styles.productItem} product={ item } onPress={() => navigation.navigate('ProductDetail', {
                                    productId: item.id
                                })} />}
                                keyExtractor={(item) => `${item.id}`}
                                ListEmptyComponent={() => <Text style={Style.noData}>Không có dữ liệu</Text>}
                                horizontal={true}
                            />
                        </View>
                    );
                })}
            </View>
        );
    }

    render() {
        const {banners, categoryProducts, readyData, refreshing} = this.state;

        if (!readyData) {
            return <View style={{flex: 1, justifyContent: 'center'}}>
                <ActivityIndicator size="large" />
            </View>
        }else{
            return (
                <ScrollView
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={this.onRefresh} />
                    }
                >
                    <SafeAreaView style={Style.container}>
                        <Image source={{uri: Constants.base_url + banners.image}} style={{width: Dimensions.get('window').width, height: 120, marginBottom: 30}} />

                        {this.renderCategories()}
                        
                        {this.renderProducts()}
                        
                        <Caption style={{textAlign: 'center', marginVertical: 15}}>{Constants.sologan}</Caption>
                        
                    </SafeAreaView>
                </ScrollView>
            );
        }
    }
}

const styles = StyleSheet.create({
    categoryItem: {
        alignItems: 'center',
        height: 90, 
        width: 90, 
        justifyContent: 'space-between',
        margin: 3,
        shadowRadius: 0,
        shadowOpacity: 0,
    },
    productItem: {
        margin: 0,
        marginRight: 10,
        width: (Dimensions.get('window').width - 30) / 2
    }
});