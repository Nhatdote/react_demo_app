import React from 'react'
import {Text, SafeAreaView, StyleSheet, Image, View, Button, Alert} from 'react-native'
import Axios from "axios";

import numberFormat from "../js/main";
import Color from "../components/Color"
import {CartContext} from "../contexts/Cart";

const addToCart = (productId, qty) => {
    Alert.alert('Added to cart');
};


const ProductDetail = (props) => {
    const {route, navigation} = props;
    const {product} = route.params;
    navigation.setOptions({
        title: product.name ? product.name : 'Chi tiết sản phẩm'
    });
    return (
        <SafeAreaView>
            <View style={styles.container}>
                <Text style={styles.title}>{product.name}</Text>
                <View style={styles.detail}>
                    <Image style={styles.avatar} source={{uri: product.image}} />
                    <View style={styles.info}>
                        <Text>Thương hiệu: <Text style={styles.textSecondary}>{product.brand}</Text></Text>
                        <Text>Nhà cung cấp: <Text style={styles.textSecondary}>{product.vendor}</Text></Text>
                        <Text>Danh mục: <Text style={styles.textSecondary}>{product.category_name}</Text></Text>
                        <Text style={styles.price}>{numberFormat(product.sale_price * product.rate) + ' đ'}</Text>
                    </View>
                </View>
                <View style={styles.actions}>
                    <CartContext.Consumer>
                        { ({addToCart}) => <Button onPress={() => addToCart(product, 1)} title="Thêm vào giỏ hàng" color="#841584"/>}
                    </CartContext.Consumer>
                </View>
            </View>
            <View style={styles.container}>
                <Text>{product.shop.name}</Text>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        margin: 10,
        paddingHorizontal: 10,
        paddingVertical: 10,
        backgroundColor: '#fff',
        borderRadius: 3,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 5,
    },
    detail: {
        flexDirection: 'row',
    },
    info: {
        marginLeft: 10,
        flexGrow: 1
    },
    avatar: {
        height: 100,
        width: 100
    },
    title: {
        fontSize: 18,
        color: Color.secondary,
        marginBottom: 20,
        textAlign: 'center'
    },
    price: {
        fontSize: 30,
        color: 'tomato',
        fontWeight: '200',
        textAlign: 'right',
        marginTop: 10
    },
    textSecondary: {
        color: Color.secondary
    },
    actions: {
        margin: 10
    },
});

export default ProductDetail;