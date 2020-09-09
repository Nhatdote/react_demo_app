import React from 'react'
import { StyleSheet, View, Text, Image, TouchableOpacity, Alert, Dimensions } from 'react-native'
import { numberFormat } from '../js/main';
import Style from "../js/Style";
import Constants from '../Constants';
import Color from './Color';

export default function ProductItem(props) {
    const { product, onPress, style } = props;
    let discount = 0;
    if (product.price && product.price > product.sale_price) {
        discount = 100 - Math.round(product.sale_price / product.price * 100 );
    }
    return (
        <TouchableOpacity onPress={onPress} style={{ flex: 1 }}>
            <View style={[Style.card, styles.productItem, style]}>
                <View style={{ position: 'relative', width: '100%', overflow: 'hidden', borderTopRightRadius: 5, borderTopLeftRadius: 5 }}>
                    <Image
                        style={styles.img}
                        source={{ uri: Constants.base_url + product.image }}
                    />
                    {discount > 0 
                    ? <View style={styles.labelTopRight}>
                        <Text style={styles.labelText}>{discount}%</Text>
                        <Text style={styles.labelText}>Giảm</Text>
                        <View style={styles.labelTopRightBefore}></View>
                    </View>
                    : <View></View>
                }
                </View>
                <View style={styles.labelTopLeft}>
                    <Text style={styles.labelText}>VNS MALL</Text>
                    <View style={styles.labelTopLeftBefore}></View>
                </View>
                
                <View style={{ padding: 10, width: '100%' }}>
                    <Text numberOfLines={2} style={styles.title}>{product.name.toUpperCase()}</Text>
                    <View style={{ flexDirection: "row", justifyContent: 'space-between' }}>
                        <Text style={styles.price}>{numberFormat(product.sale_price * Constants.token_rate) + 'đ'}</Text>
                        {discount > 0
                            ? <Text style={styles.rootPrice}>{numberFormat(product.price * Constants.token_rate) + 'đ'}</Text>
                            : <Text style={styles.rootPrice}></Text>
                        }
                    </View>
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
        width: (Dimensions.get('window').width - 30) / 2,
        overflow: 'visible',
    },
    title: {
        fontSize: 12,
        textAlign: 'center',
        lineHeight: 12,
        height: 24,
        marginBottom: 5
    },
    img: {
        height: (Dimensions.get('window').width - 100) / 2,
        width: '100%',
        marginHorizontal: 'auto',
    },
    price: {
        color: 'tomato',
        fontSize: 14,
        lineHeight: 14,
        marginRight: 5,
    },
    rootPrice: {
        color: Color.muted,
        fontSize: 9,
        textDecorationLine: 'line-through'
    },
    labelTopLeft: {
        backgroundColor: '#269ED2',
        position: 'absolute',
        paddingHorizontal: 3,
        borderRadius: 3,
        borderBottomLeftRadius: 0,
        top: 5,
        left: -3
    },
    labelTopLeftBefore: {
        position: 'absolute',
        left: 0,
        bottom: -3,
        borderLeftWidth: 4,
        borderLeftColor: 'transparent',
        borderTopColor: '#0170BF',
        borderTopWidth: 3
    },
    labelTopRight: {
        position: 'absolute',
        top: 0,
        right: 0,
        backgroundColor: 'tomato',
        width: 30,
        paddingTop: 0,
        paddingBottom: 5,
        borderTopRightRadius: 5, 
    },
    labelTopRightBefore: {
        width: 30,
        height: 6,
        backgroundColor: 'transparent',
        position: 'absolute',
        bottom: -6,
        borderBottomColor: 'transparent',
        borderBottomWidth: 6,
        borderLeftColor: 'tomato',
        borderLeftWidth: 15,
        borderRightColor: 'tomato',
        borderRightWidth: 15
    },
    labelText: {
        color: 'white',
        fontSize: 9,
        textAlign: 'center'
    }
});