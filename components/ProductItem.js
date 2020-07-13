import React from 'react'
import {StyleSheet, View, Text, Image, TouchableOpacity, Alert} from 'react-native'
import {numberFormat} from '../js/main'

export default function ProductItem(props) {
    const { product, onPress } = props;
    return (
        <TouchableOpacity onPress={onPress}>
            <View style={ styles.productItem }>
                <Text numberOfLines={2} style={ styles.title }>{ product.name }</Text>
                <Image
                    style={ styles.img }
                    source={{uri: product.image}}
                />
                <Text style={styles.price}>{numberFormat(product.sale_price * product.rate) + ' đ'}</Text>
            </View>
        </TouchableOpacity>
    );
}

const styles  = StyleSheet.create({
    productItem: {
        paddingVertical: 20,
        paddingHorizontal: 5,
        backgroundColor: 'white',
        borderRadius: 3,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 5,
        alignItems: 'center',
        marginHorizontal: 4,
    },
    title: {
        textAlign: 'center',
        lineHeight: 16,
        height: 32,
        marginBottom: 10
    },
    img: {
        height: 70,
        width: 70,
        marginHorizontal: 'auto'
    },
    price: {
        color: 'tomato',
        fontSize: 18,
    }
});