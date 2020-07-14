import React from 'react'
import {Text, SafeAreaView, StyleSheet, View, RefreshControl, FlatList, Image} from 'react-native'

import Color from "../components/Color"
import CartItem from "../components/CartItem"
import {CartContext} from "../contexts/CartProvider"
import CartEmptyImg from "../images/empty_cart.png"

const showEmptyListView = () => {
    return <View>
        <Image style={{width: '100%', marginTop: 60}} source={CartEmptyImg}></Image>
        <Text style={{color: Color.muted, textAlign: 'center', fontSize: 24, fontWeight: '100'}}>Giỏ hàng trống</Text>
    </View>
};

const groupCartByShop = () => {
    return (
        <CartContext.Consumer>
            { ({cart}) => {
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
                shops = Object.values(shops)
                return (
                    <FlatList
                        data={shops}
                        renderItem={({ item }) => <CartItem shop={ item }/>}
                        keyExtractor={(item, index) => `${index}`}
                        ListEmptyComponent={showEmptyListView()}
                    />
                );
            }}
        </CartContext.Consumer>
    );
};

const Cart = () => {
    let groupBy = groupCartByShop();
    return (
        <SafeAreaView style={styles.container}>
            {groupBy}
            {/*<CartContext.Consumer>
                { ({cart}) => {
                    return (
                        <FlatList
                            data={cart}
                            renderItem={({ item }) => <CartItem shop={ item }/>}
                            keyExtractor={(item, index) => `${index}`}
                            ListEmptyComponent={showEmptyListView()}
                        />
                    );
                }}
            </CartContext.Consumer>*/}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        marginVertical: 5,
    }
});

export default Cart;