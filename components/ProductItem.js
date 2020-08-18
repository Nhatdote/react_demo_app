import React from 'react'
import {StyleSheet, View, Text, Image, TouchableOpacity, Alert, Dimensions} from 'react-native'
import {numberFormat} from '../js/main';
import Style from "../js/Style";
import Constants from '../Constants';

export default function ProductItem(props) {
    const { product, onPress, style } = props;
    return (
        <TouchableOpacity onPress={onPress} style={{flex: 1}}>
            <View style={[Style.card, styles.productItem, style]}>
                <Image
                    style={ styles.img }
                    source={{uri: Constants.base_url + product.image}}
                />
                <View style={{padding: 10}}>
                    <Text numberOfLines={2} style={ styles.title }>{ product.name.toUpperCase() }</Text>
                    <Text style={styles.price}>{numberFormat(product.sale_price * Constants.token_rate) + ' đ'}</Text>
                </View>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    productItem: {
        alignItems: 'center', 
        margin: 5, 
        padding: 0, 
        width: (Dimensions.get('window').width - 30) / 2
    },  
    title: {
        textAlign: 'center',
        lineHeight: 16,
        height: 32,
        marginBottom: 5
    },
    img: {
        height: (Dimensions.get('window').width - 100) / 2,
        width: '100%',
        marginHorizontal: 'auto'
    },
    price: {
        color: 'tomato',
        fontSize: 18,
        textAlign: 'center'
    }
});