import React from 'react'
import {
    Text,
    SafeAreaView,
    StyleSheet,
    Image,
    View,
    Alert,
    TouchableOpacity,
    ActivityIndicator, Dimensions, RefreshControl, ScrollView
} from 'react-native'
import {SimpleLineIcons} from '@expo/vector-icons'
import {Button, Card, Paragraph, Chip, Avatar} from 'react-native-paper'


import {numberFormat} from "../js/main";
import Color from "../components/Color"
import {CartContext} from "../contexts/CartProvider";
import Axios from "axios";
import Toast from "react-native-tiny-toast";

export default class ProductDetail extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            product: null,
            refreshing: false,
            readyData: false
        }
    }

    componentDidMount() {
        this.loadData();
    }

    loadData(refresh = false) {
        let loading = null;
        if (refresh) {
            loading = Toast.show('Đang làm mới...', {duration: 5000});
        }
        const {route} = this.props;
        const {productId} = route.params;
        Axios.get('/product/'+productId)
            .then(res => {
                this.setState({
                    product: res.data,
                    refreshing: false,
                    readyData: true
                });
                if (refresh) {
                    Toast.hide(loading);
                    Toast.show('Đã làm mới sản phẩm', {duration: 500});
                }
            })
            .catch(error => console.warn(error));
    }

    onRefresh() {
        this.setState({refreshing: true});
        this.loadData(true);
    }

    render() {
        const {product, refreshing, readyData} = this.state;
        const {navigation} = this.props;
        navigation.setOptions({
            title: product !== null ? product.name : 'Chi tiết sản phẩm'
        });
        return (
            <SafeAreaView style={{flex: 1, justifyContent: 'center'}}>
                {!readyData
                    ?
                    <ActivityIndicator size="large" />
                    :
                    <ScrollView
                        refreshControl={
                            <RefreshControl refreshing={refreshing} onRefresh={() => this.onRefresh()} />
                        }
                    >
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
                                            <View>
                                                <Button icon="cart" mode="contained" onPress={() => addToCart(product, 1)}>
                                                    Thêm vào giỏ hàng
                                                </Button>
                                            </View>
                                        );
                                    }}
                                </CartContext.Consumer>
                            </View>
                        </View>
                        <View style={styles.container}>
                            <View style={{flexDirection: 'row'}}>
                                {product.shop.avatar
                                    ? <Avatar.Image size={66} style={{backgroundColor: 'transparent', marginRight: 10}} source={{uri: 'https://tieudunghuutri.com/' + product.shop.avatar}} />
                                    : <Avatar.Text size={66} label={product.shop.name.split(' ').map(item => item.slice(0,1)).join('').slice(0, 2).toUpperCase()} color={'#fff'} style={{backgroundColor: 'tomato', marginRight: 10}}/>
                                }
                                <View>
                                    <Text numberOfLines={1} style={{fontSize: 20, color: Color.primary, width: Dimensions.get('window').width - 120}}>{product.shop.name}</Text>
                                    <Text style={{color: Color.muted}}><SimpleLineIcons name="screen-smartphone"/> {product.shop.phone_st}</Text>
                                    {/*<Button title="Xem Shop" color={Color.secondary} onPress={() => Alert.alert('123')} />*/}
                                    <Button icon="chevron-double-right" mode="contained" onPress={() => navigation.navigate('ShopView', {id: product.shop_id})}>
                                        Xem Shop
                                    </Button>
                                </View>
                            </View>
                        </View>
                    </ScrollView>
                }
            </SafeAreaView>
        );
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
        flex: 1
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
