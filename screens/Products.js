import React from 'react'
import {ActivityIndicator, RefreshControl, StyleSheet, View, Text, SafeAreaView, FlatList} from "react-native";
import Axios from "axios";
import Toast from "react-native-tiny-toast";

import ProductItem from "../components/ProductItem";
import Color from "../components/Color";
import css from "../js/style";

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
        Axios.get('/product/list/'+this.props.route.params.category.id)
            .then(res => {
                this.setState({
                    products: res.data,
                    refreshing: false,
                    readyData: true
                });
                if (refresh) {
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
            <SafeAreaView style={styles.container}>
                {!readyData
                    ?
                    <ActivityIndicator size="large" />
                    :
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
                        ListEmptyComponent={() => <Text style={css.noData}>Không có dữ liệu</Text>}
                        numColumns={2}
                    />
                }
            </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center"
    },
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