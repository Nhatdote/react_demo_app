import React from 'react'
import {RefreshControl, StyleSheet, View, Text, SafeAreaView, FlatList} from "react-native";
import Axios from "axios";

import ProductItem from "../components/ProductItem";
import Color from "../components/Color";

export default class Products extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            products: [],
            refreshing: false
        };
    }

    componentDidMount() {
        this.loadData();
    }

    loadData() {
        Axios.get('/product/list/'+this.props.route.params.category.id)
            .then(res => {
                this.setState({
                    products: res.data,
                    refreshing: false
                });
            })
            .catch(error => console.log(error));
    }

    showEmptyListView() {
        return <Text style={styles.noProduct}>Không có dữ liệu</Text>
    }

    onRefresh() {
        this.setState({refreshing: true});
        this.loadData();
    }

    render() {
        const { route, navigation } = this.props;
        const {category} = route.params;
        navigation.setOptions({
            title: category.name ? category.name : 'Danh sách Sản phẩm'
        });
        const {products, refreshing} = this.state;

        return (
            <SafeAreaView>
                <FlatList
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={() => this.onRefresh()} />
                    }
                    columnWrapperStyle={styles.flatWrapper}
                    data={products}
                    renderItem={({ item }) => <View style={styles.flatProduct}><ProductItem product={ item } onPress={() => navigation.navigate('ProductDetail', {
                        productId: item.id
                    })} /></View>}
                    keyExtractor={(item) => `${item.id}`}
                    ListEmptyComponent={this.showEmptyListView()}
                    numColumns={2}
                />
            </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({
    noProduct: {
        fontSize: 24,
        fontWeight: '100',
        color: Color.muted,
        textAlign: 'center',
        marginTop: 100
    },
    flatProduct: {
        flex: 1
    },
    flatWrapper: {
        paddingHorizontal: 3,
        paddingVertical: 3
    }
});