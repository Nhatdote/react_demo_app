import React from 'react'
import {StyleSheet, View, Text, Image, TouchableOpacity, Alert} from 'react-native'

import numberFormat from '../js/main'
import Color from "./Color";

export default function CartItem(props) {
    const { product } = props;
    return (
        <View style={ styles.container }>
            <View style={styles.item}>
                <Image
                    style={ styles.img }
                    source={{uri: product.image}}
                />
                <View style={{flexGrow: 1, marginLeft: 10}}>
                    <Text>{product.name}</Text>
                    <Text style={{color: 'tomato', fontSize: 16}}>{numberFormat(product.sale_price * product.rate) + ' đ'}</Text>
                    <View style={{flexDirection: 'row'}}>
                        <TouchableOpacity>
                            <Text style={styles.qtyBtn}>-</Text>
                        </TouchableOpacity>
                        <Text style={{fontWeight: '700', marginHorizontal: 10}}>{product.quantity}</Text>
                        <TouchableOpacity>
                            <Text style={styles.qtyBtn}>+</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </View>
    );
}

const styles  = StyleSheet.create({
    container: {
        paddingVertical: 10,
        paddingHorizontal: 10,
        backgroundColor: 'white',
        borderRadius: 3,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 5,
        alignItems: 'center',
        marginHorizontal: 10,
        marginVertical: 5
    },
    img: {
        height: 70,
        width: 70,
    },
    item: {
        justifyContent: 'space-between',
        flexDirection: 'row'
    },
    qtyBtn: {
        width: 22,
        height: 22,
        backgroundColor: Color.muted,
        color: '#fff',
        borderRadius: 50,
        textAlign: 'center',
        alignItems: 'center',
    }

});