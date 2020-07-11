import React from 'react'
import {Text, SafeAreaView, StyleSheet, View, RefreshControl, FlatList} from 'react-native'

import Color from "../components/Color"
import CartItem from "../components/CartItem";
import {CartContext} from "../contexts/Cart";
import ProductItem from "../components/ProductItem";

const showEmptyListView = () => {
    return <Text style={styles.noProduct}>Không có dữ liệu</Text>
};

const Cart = () => {
    return (
        <SafeAreaView style={styles.container}>
            <CartContext.Consumer>
                { ({cart}) => {
                    return (
                        <FlatList
                            data={cart}
                            renderItem={({ item }) => <CartItem product={ item }/>}
                            keyExtractor={(item) => `${item.id}`}
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
        marginVertical: 5
    }
});

export default Cart;