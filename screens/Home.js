import React from 'react';
import { SafeAreaView, View, Text, ActivityIndicator, ScrollView, Image, Dimensions, StyleSheet, RefreshControl, TouchableOpacity, FlatList } from 'react-native';
import { Title, Avatar, Button, Caption } from 'react-native-paper';
import Axios from 'axios'
import Toast from "react-native-tiny-toast";

import Style from "../js/Style";
import Constants from "../Constants";
import Color from '../components/Color';
import ProductItem from '../components/ProductItem';
import { preventAutoHide } from 'expo/build/launch/SplashScreen';

export default class Home extends React.Component {
    constructor(props) {
        super(props);
        this.state = ({
            banners: null,
            categories: [],
            highlights: [],
            recommends: [],
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
            loading = Toast.show('Đang làm mới...', { duration: 5000 });
        }
        Axios.get('/get-home')
            .then(res => {
                this.setState({
                    banners: res.data.banners,
                    categories: res.data.categories,
                    highlights: res.data.highlights,
                    recommends: res.data.recommends,
                    readyData: true,
                    refreshing: false,
                });
                if (refresh) {
                    Toast.hide(loading);
                    Toast.show('Đã làm mới', { duration: 500 })
                }
            })
            .catch(error => console.warn(error));
    }

    onRefresh = () => {
        this.setState({ refreshing: true });
        this._loadData(true);
    }

    renderCategories = () => {
        const { categories } = this.state;
        const { navigation } = this.props;

        return (
            <View style={{ marginHorizontal: 7, marginBottom: 30 }}>
                <ScrollView horizontal={true}>
                    {categories.map((item, index) => {
                        if (index % 2 == 0) {
                            return (
                                <View key={index}>
                                    <TouchableOpacity style={[Style.card, styles.categoryItem]} onPress={() => navigation.navigate('Products', {
                                        category: item
                                    })}>
                                        <View style={{ padding: 5, borderRadius: 50, backgroundColor: Color.alert_info }}>
                                            <Image style={{ width: 40, height: 40 }} source={{ uri: Constants.base_url + item.avatar }} />
                                        </View>
                                        <Text numberOfLines={2} style={{ fontSize: 10, textAlign: 'center' }}>{item.name}</Text>
                                    </TouchableOpacity>

                                    {typeof categories[index + 1] != "undefined"
                                        ? <TouchableOpacity style={[Style.card, styles.categoryItem]} onPress={() => navigation.navigate('Products', {
                                            category: categories[index + 1]
                                        })}>
                                            <View style={{ padding: 5, borderRadius: 50, backgroundColor: Color.alert_info }}>
                                                <Image style={{ width: 40, height: 40 }} source={{ uri: Constants.base_url + categories[index + 1].avatar }} />
                                            </View>
                                            <Text numberOfLines={2} style={{ fontSize: 10, textAlign: 'center' }}>{categories[index + 1].name}</Text>
                                        </TouchableOpacity>
                                        : <View style={{ display: 'none' }}></View>
                                    }
                                </View>
                            );
                        }
                    })}
                </ScrollView>
            </View>
        );
    }

    renderHighLights() {
        const {highlights} = this.state;
        const {navigation} = this.props;

        if (!highlights.length) return;
        
        return (
            <View style={{ marginBottom: 30 }}>
                <View style={{ position: 'relative' }}>
                    <Text style={styles.productsGroup}>Sản phẩm nổi bật</Text>
                    <View style={ styles.division }></View>
                </View>
                <FlatList
                    data={highlights}
                
                    renderItem={({ item }) => <ProductItem style={styles.productItem} product={item} onPress={() => navigation.navigate('ProductDetail', {
                        productId: item.id
                    })} />}
                    keyExtractor={(item) => `${item.id}`}
                    ListEmptyComponent={() => <Text style={Style.noData}>Không có dữ liệu</Text>}
                    horizontal={true}
                />
            </View>
        );
    }

    renderRecommends() {
        const {recommends} = this.state;
        const {navigation} = this.props;

        if (!recommends.length) return;
        
        return (
            <View>
                <View style={{ position: 'relative' }}>
                    <Text style={[styles.productsGroup]}>Gợi ý cho bạn</Text>
                    <View style={ styles.division }></View>
                </View>
                <FlatList
                    data={recommends}
                    style={{ padding: 5 }}
                    renderItem={({ item }) => <ProductItem product={item} onPress={() => navigation.navigate('ProductDetail', {
                        productId: item.id
                    })} />}
                    keyExtractor={(item) => `${item.id}`}
                    ListEmptyComponent={() => <Text style={Style.noData}>Không có dữ liệu</Text>}
                    numColumns={2}
                />
            </View>
        );
    }

    render() {
        const { banners, readyData, refreshing } = this.state;

        if (!readyData) {
            return <View style={{ flex: 1, justifyContent: 'center' }}>
                <ActivityIndicator size="large" />
            </View>
        } else {
            return (
                <ScrollView
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={this.onRefresh} />
                    }
                >
                    <SafeAreaView style={Style.container}>
                        <Image source={{ uri: Constants.base_url + banners.image }} style={{ width: Dimensions.get('window').width, height: 120, marginBottom: 30 }} />

                        {this.renderCategories()}

                        {this.renderHighLights()}

                        {this.renderRecommends()}

                        <Caption style={{ textAlign: 'center', marginVertical: 15 }}>{Constants.sologan}</Caption>

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
    },
    productsGroup: {
        textAlign: 'center',
        marginBottom: 10,
        color: Color.secondary,
    },
    division: {
        backgroundColor: Color.secondary,
        height: 1,
        width: 50,
        position: 'absolute',
        left: '50%',
        bottom: 10,
        transform: [{ translateX: -25 }]
    }
});