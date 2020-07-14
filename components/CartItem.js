import React from 'react'
import {StyleSheet, View, Text, Image, TouchableOpacity, Alert, SafeAreaView, Dimensions, Button} from 'react-native'
import { FontAwesome5, Feather } from '@expo/vector-icons'

import {numberFormat} from '../js/main'
import Color from "./Color";
import {CartContext} from "../contexts/CartProvider";

export default function CartItem(props) {
    const { shop } = props;
    return (
        <SafeAreaView style={ styles.container }>
            <View style={{paddingBottom: 5, backgroundColor: Color.secondary, width: '100%'}}>
                <Text style={{color: '#fff', marginLeft: 10}}><FontAwesome5 name="store" size={14} color="#fff" /> {shop.shop_name}</Text>
            </View>
            {shop.products.map((item, index) => {
                return (
                    <View  key={`${item.id}`} style={styles.productItem}>
                        <Image
                            style={styles.productImage}
                            source={{uri: item.image}}
                        />
                        <View style={styles.productInfo}>
                            <Text numberOfLines={1}>{item.name}</Text>
                            <View style={{flexDirection: 'row', whiteSpace: 'space-between'}}>
                                <Text style={{color: Color.muted}}>{numberFormat(item.sale_price * item.rate) + ' đ'}</Text>
                                <Text style={{color: 'tomato', flexGrow: 1, textAlign: 'right'}}><Feather name="dollar-sign" />{numberFormat(item.total * item.rate) + ' đ'}</Text>
                            </View>
                            <CartContext.Consumer>
                                { ({addToCart}) => {
                                    return (
                                        <View style={{flexDirection: 'row'}}>
                                            <TouchableOpacity onPress={() => addToCart(item, -1)}>
                                                <Text style={styles.qtyBtn}>-</Text>
                                            </TouchableOpacity>
                                            <Text style={{fontWeight: '700', marginHorizontal: 10}}>{item.quantity}</Text>
                                            <TouchableOpacity onPress={() => addToCart(item, 1)}>
                                                <Text style={styles.qtyBtn}>+</Text>
                                            </TouchableOpacity>
                                        </View>
                                    );
                                }}
                            </CartContext.Consumer>
                        </View>
                        <CartContext.Consumer>
                            { ({removeFromCart}) => {
                                return (
                                    <TouchableOpacity onPress={() => removeFromCart(item)}>
                                        <View style={styles.productRemove}>
                                            <Text style={{color: 'white', fontWeight: '700'}}>Xóa</Text>
                                        </View>
                                    </TouchableOpacity>
                                );
                            }}
                        </CartContext.Consumer>
                    </View>
                );
            })}
        </SafeAreaView>
    );
}

const styles  = StyleSheet.create({
    container: {
        marginHorizontal: 10,
        marginVertical: 5,
        backgroundColor: 'white',
        borderRadius: 3,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 5,
        alignItems: 'center',
        overflow: 'hidden'
    },
    qtyBtn: {
        width: 22,
        height: 22,
        backgroundColor: Color.muted,
        color: '#fff',
        borderRadius: 50,
        textAlign: 'center',
        alignItems: 'center',
    },
    productItem: {
        flexDirection: 'row',
        borderTopWidth: 1,
        borderTopColor: '#e6e6e6',
        width: '100%',
    },
    productInfo: {
        flexGrow: 1,
        margin: 5,
        width: Dimensions.get('window').width - 200
    },
    productImage: {
        margin: 5,
        height: 50,
        width: 50,
        borderRadius: 50,
        flexShrink: 0,
    },
    productRemove: {
        width: 40,
        backgroundColor: Color.secondary,
        color: 'white',
        flex: 1,
        flexShrink: 0,
        alignItems: 'center',
        justifyContent: 'center'
    }

});