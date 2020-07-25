import React from 'react'
import {
    Text,
    SafeAreaView,
    StyleSheet,
    Image,
    View,
    Alert,
    TouchableOpacity,
    ActivityIndicator,
    Dimensions,
    RefreshControl,
    ScrollView,
    FlatList
} from 'react-native'
import {SimpleLineIcons} from '@expo/vector-icons'
import {Button, Card, Paragraph, Chip, Avatar, Title, Subheading, Caption, List} from 'react-native-paper'
import Axios from "axios";
import Toast from "react-native-tiny-toast";
import Accordion from 'react-native-collapsible/Accordion';
import HTML from 'react-native-render-html';



import {numberFormat} from "../js/main";
import Color from "../components/Color"
import {CartContext} from "../contexts/CartProvider";
import Style from "../js/Style";
import ProductItem from "../components/ProductItem";

export default class ProductDetail extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            product: null,
            refreshing: false,
            readyData: false,
            relatedProducts: [],
            activeSections: []
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
                    product: res.data.product,
                    relatedProducts: res.data.relatedProducts,
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

    _updateSections = activeSections => {
        this.setState({ activeSections });
    };

    render() {
        const {product, refreshing, readyData, relatedProducts} = this.state;
        const {navigation} = this.props;
        navigation.setOptions({
            title: product !== null ? product.name : 'Chi tiết sản phẩm'
        });
        const sections = [
            {
                title: 'Tô tả sản phẩm',
                content: product !== null ? product.description : 'Không có mô tả cho sản phẩm này',
            },
            {
                title: 'Thông tin chi tiết',
                content: product !== null && product.content !== null ? product.content : '<p style="color: #989898">Không có thông tin chi tiết cho sản phẩm này</p>',
            },
        ];
        return (
            <SafeAreaView style={Style.container}>
                {!readyData
                    ?
                    <View style={{flex: 1, justifyContent: 'center'}}>
                        <ActivityIndicator size="large" />
                    </View>
                    :
                    <ScrollView
                        refreshControl={
                            <RefreshControl refreshing={refreshing} onRefresh={() => this.onRefresh()} />
                        }
                    >
                        <View style={Style.card}>
                            <Text style={styles.title}>{product.name}</Text>
                            <View style={{flexDirection: 'row'}}>
                                <Image style={styles.avatar} source={{uri: product.image}} />
                                <View style={styles.info}>
                                    <Text>Thương hiệu: <Text style={styles.textSecondary}>{product.brand}</Text></Text>
                                    <Text>Nhà cung cấp: <Text style={styles.textSecondary}>{product.vendor}</Text></Text>
                                    <Text>Danh mục: <Text style={styles.textSecondary}>{product.child_category.name ? product.child_category.name : 'Chưa phân loại'}</Text></Text>
                                    <Text style={styles.price}>{numberFormat(product.sale_price * product.rate) + ' đ'}</Text>
                                </View>
                            </View>
                            <View>
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
                            <View style={{marginTop: 10}}>
                                <Accordion
                                    underlayColor={"whitesmoke"}
                                    sections={sections}
                                    activeSections={this.state.activeSections}
                                    renderHeader={section => <Subheading style={{paddingVertical: 10}}>{section.title}</Subheading>}
                                    renderContent={section => <View style={{padding: 5, backgroundColor: 'whitesmoke'}}><HTML html={section.content} imagesMaxWidth={Dimensions.get('window').width - 50} /></View>}
                                    onChange={this._updateSections}
                                />
                            </View>
                        </View>
                        <View style={Style.card}>
                            <View style={{flexDirection: 'row'}}>
                                {product.shop.avatar
                                    ? <Avatar.Image size={66} style={{backgroundColor: 'transparent', marginRight: 10}} source={{uri: 'https://tieudunghuutri.com/' + product.shop.avatar}} />
                                    : <Avatar.Text size={66} label={product.shop.name.split(' ').map(item => item.slice(0,1)).join('').slice(0, 2).toUpperCase()} color={'#fff'} style={{backgroundColor: 'tomato', marginRight: 10}}/>
                                }
                                <View>
                                    <Text numberOfLines={1} style={{fontSize: 20, color: Color.primary, width: Dimensions.get('window').width - 120}}>{product.shop.name}</Text>
                                    <Text style={{color: Color.muted}}><SimpleLineIcons name="screen-smartphone"/> {product.shop.phone_st}</Text>
                                    <Button icon="chevron-double-right" mode="contained" uppercase={false}
                                            style={{height: 30, width: 120, borderRadius: 30, justifyContent: 'center'}}
                                            labelStyle={{fontSize: 10, paddingBottom: 3}}
                                            onPress={() => navigation.navigate('ShopView', {id: product.shop_id})}>
                                        Xem Shop
                                    </Button>
                                </View>
                            </View>
                        </View>
                        <View style={{marginHorizontal: 10}}>
                            <Title style={{textAlign: 'center'}}>Sản phẩm liên quan</Title>
                            <FlatList
                                data={relatedProducts}
                                renderItem={({ item }) => <View style={{flex: 1, marginBottom: 6}}><ProductItem product={ item } onPress={() => navigation.push('ProductDetail', {
                                    productId: item.id
                                })} /></View>}
                                keyExtractor={(item) => `${item.id}`}
                                ListEmptyComponent={() => <Text style={Style.noData}>Không có dữ liệu</Text>}
                                numColumns={2}
                            />
                        </View>
                    </ScrollView>
                }
            </SafeAreaView>
        );
    }
}


const styles = StyleSheet.create({
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
