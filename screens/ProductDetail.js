import React from 'react'
import {Text, SafeAreaView, StyleSheet, Image, View, Button, Alert, TouchableOpacity} from 'react-native'


import {numberFormat} from "../js/main";
import Color from "../components/Color"
import {CartContext} from "../contexts/CartProvider";
import Axios from "axios";

export default class ProductDetail extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            product: null
        }
    }

    componentDidMount() {
        const {route} = this.props;
        const {productId} = route.params;
        Axios.get('/product/'+productId)
            .then(res => {
                this.setState({product: res.data})
            })
            .catch(error => console.warn(error));
    }

    render() {
        const {product} = this.state;
        const {navigation} = this.props;

        if (product === null) {
            return (
                <SafeAreaView>
                    <Text style={{marginTop: 50, color: Color.muted, textAlign: 'center', fontSize: 24}}>Sản phẩm đã bị ẩn hoặc xóa</Text>
                </SafeAreaView>
            );
        }else{
            navigation.setOptions({
                title: product.name
            });
            return (
                <SafeAreaView>
                    <View style={styles.container}>
                        <Text style={styles.title}>{product.name}</Text>
                        <View style={styles.detail}>
                            <Image style={styles.avatar} source={{uri: product.image}} />
                            <View style={styles.info}>
                                <Text>Thương hiệu: <Text style={styles.textSecondary}>{product.brand}</Text></Text>
                                <Text>Nhà cung cấp: <Text style={styles.textSecondary}>{product.vendor}</Text></Text>
                                <Text>Danh mục: <Text style={styles.textSecondary}>{product.child_category.name ? product.child_category.name : 'Chưa phân loại'}</Text></Text>
                                <Text style={styles.price}>{numberFormat(product.sale_price * product.rate) + ' đ'}</Text>
                            </View>
                        </View>
                        <View style={styles.actions}>
                            <CartContext.Consumer>
                                { ({addToCart}) => {
                                    return (
                                        <TouchableOpacity activeOpacity={0.6} style={[styles.addToCartBtn]} onPress={() => addToCart(product, 1)}>
                                            <Text style={{color: 'white'}}>Thêm vào giỏ hàng</Text>
                                        </TouchableOpacity>
                                    );
                                }}
                            </CartContext.Consumer>
                        </View>
                    </View>
                    <View style={styles.container}>
                        <Text>{product.shop.name}</Text>
                    </View>
                </SafeAreaView>
            );
        }
    }
}


const styles = StyleSheet.create({
    container: {
        margin: 10,
        paddingHorizontal: 10,
        paddingVertical: 10,
        backgroundColor: '#fff',
        borderRadius: 3,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 5,
    },
    detail: {
        flexDirection: 'row',
    },
    info: {
        marginLeft: 10,
        flexGrow: 1
    },
    avatar: {
        height: 100,
        width: 100
    },
    title: {
        fontSize: 18,
        color: Color.secondary,
        marginBottom: 20,
        textAlign: 'center'
    },
    price: {
        fontSize: 30,
        color: 'tomato',
        fontWeight: '200',
        textAlign: 'right',
        marginTop: 10
    },
    textSecondary: {
        color: Color.secondary
    },
    actions: {
        margin: 10
    },
    addToCartBtn: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 10,
        borderRadius: 3,
        height: 45,
        backgroundColor: "#841584",
    }
});
