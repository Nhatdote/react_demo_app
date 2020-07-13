import React from 'react'
import {Text, SafeAreaView, StyleSheet, View, RefreshControl, FlatList, Image} from 'react-native'

import Color from "../components/Color"
import CartItem from "../components/CartItem"
import {CartContext} from "../contexts/Cart"
import CartEmptyImg from "../images/empty_cart.png"

const showEmptyListView = () => {
    return <View>
        <Image style={{width: '100%', marginTop: 60}} source={CartEmptyImg}></Image>
        <Text style={{color: Color.muted, textAlign: 'center', fontSize: 24, fontWeight: '100'}}>Giỏ hàng trống</Text>
    </View>
};

const Cart = () => {
    let i = 1;
    return (
        <SafeAreaView style={styles.container}>
            <CartContext.Consumer>
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
            </CartContext.Consumer>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        marginVertical: 5,
    }
});

export default Cart;