import React from 'react'
import {StyleSheet, View, Text, Image, TouchableOpacity, Alert} from 'react-native'
import {numberFormat} from '../js/main';
import Style from "../js/Style";

export default function ProductItem(props) {
    const { product, onPress } = props;
    return (
        <TouchableOpacity onPress={onPress} style={{flex: 1}}>
            <View style={[Style.card, {alignItems: 'center', margin: 5}]}>
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