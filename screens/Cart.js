import React, {useState} from 'react'
import {Text, SafeAreaView, StyleSheet, View, RefreshControl, FlatList, Image, ScrollView} from 'react-native'
import {Button} from "react-native-paper";

import Color from "../components/Color"
import CartItem from "../components/CartItem"
import {CartContext} from "../contexts/CartProvider"
import CartEmptyImg from "../images/empty_cart.png"
import {numberFormat} from "../js/main";


const cartFooter = () => {
    return(
        <CartContext.Consumer>
            {({total, checkout, checkingOut}) => {
                return (
                    <View style={{marginHorizontal: 10, marginVertical: 10}}>
                        <Text style={{textAlign: 'right', fontSize: 20, marginBottom: 10}}>Tổng tiền: {numberFormat(total())} đ</Text>
                        <Button icon={'chevron-double-right'} mode={'contained'} loading={checkingOut} disabled={checkingOut} onPress={() => checkout()}>Thanh toán</Button>
                    </View>
                );
            }}
        </CartContext.Consumer>
    );
};

const groupCartByShop = () => {
    return (
        <CartContext.Consumer>
            { ({cart}) => {
                if (cart.length === 0) {
                    return (
                        <View>
                            <Image style={{width: '100%', marginTop: 60}} source={CartEmptyImg}></Image>
                            <Text style={{color: Color.muted, textAlign: 'center', fontSize: 24, fontWeight: '100'}}>Giỏ hàng trống</Text>
                        </View>
                    );
                }else{
                    let shops = {};
                    for (let i = 0; i < cart.length; i++) {
                        if (typeof shops[cart[i].shop_id] === "undefined") {
                            shops[cart[i].shop_id] = {
                                shop_id: cart[i].shop_id,
                                shop_name: cart[i].shop_name,
                                products: []
                            };
                        }
                        shops[cart[i].shop_id]['products'].push(cart[i]);
                    }
                    shops = Object.values(shops);
                    return (
                        <FlatList
                            data={shops}
                            renderItem={({ item }) => <CartItem shop={ item } />}
                            keyExtractor={(item, index) => `${index}`}
                            ListFooterComponent={cartFooter}
                        />
                    );
                }
            }}
        </CartContext.Consumer>
    );
};

const Cart = () => {
    let groupBy = groupCartByShop();
    return (
        <SafeAreaView style={styles.container}>
            {groupBy}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        marginVertical: 5,
    }
});

export default Cart;