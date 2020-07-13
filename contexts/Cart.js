import React from 'react'
import {Alert} from "react-native";
import Storage from 'react-native-storage';
import AsyncStorage from '@react-native-community/async-storage';

export const CartContext = React.createContext();

const storage = new Storage({
    size: 1000,
    storageBackend: AsyncStorage,
    defaultExpires: 1000 * 60 * 60,
    enableCache: true,
    sync: {
        // we'll talk about the details later.
    }
});

export class CartProvider extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            cart: [],
            total: 0
        };
        this.addToCart = this.addToCart.bind(this);
        this.total = this.total.bind(this);
        this.removeFromCart = this.removeFromCart.bind(this);
    }

    componentDidMount() {
        //this._removeCart();
        this._getCart();
    }

    _removeCart() {
        storage.save({
            key: 'cart',
            data: null,
        });
    }

    _setCart() {
        storage.save({
            key: 'cart',
            data: {
                cart: this.state.cart,
                total: this.state.total
            },
        });
    }

    _getCart() {
        storage
            .load({
                key: 'cart',
                autoSync: true,
                syncInBackground: true,
                syncParams: {
                    extraFetchOptions: {},
                    someFlag: true
                }
            })
            .then(res => {
                if (res !== null) {
                    this.setState({
                        cart: res.cart,
                        total: res.total,
                    })
                }
            })
            .catch(err => {
                console.error(err.message);
                switch (err.name) {
                    case 'NotFoundError':
                        console.error('NotFoundError');
                        break;
                    case 'ExpiredError':
                        this._removeCart();
                        break;
                }
            });
    }

    removeFromCart(product) {
        console.log(product.name)
        let cart = this.state.cart;

        cart = cart.map((item, index) => {
            if (item.shop_id === product.shop_id) {
                item.products.map((prod, i) => {
                    if (prod.id === product.id){
                        item.products.splice(i, 1);
                    }
                    return prod;
                });
            }
            return item;
        });
        console.log(cart);
    }

    addToCart(product, qty = 1) {
        let cart = this.state.cart;

        let cartItem = {
            id: product.id,
            name: product.name,
            sale_price: product.sale_price,
            quantity: qty,
            total: product.sale_price * qty,
            rate: product.rate,
            image: product.image,
            shop_id: product.shop_id
        };

        if (cart.length === 0){
            cart.push({
                shop_id: product.shop_id,
                shop_name: product.shop.name,
                products: [cartItem]
            });
        }else{
            let updateShop = false;
            for (let i = 0; i < cart.length; i++) {
                if (cart[i].shop_id === product.shop_id) {
                    updateShop = true;
                    let updateProduct = false;
                    for (let j = 0; j < cart[i].products.length; j++){
                        if (cart[i].products[j].id === product.id) {
                            updateProduct = true;
                            cart[i].products[j].quantity += qty;
                            cart[i].products[j].total += product.sale_price * qty;
                            if (cart[i].products[j].quantity <= 0) {
                                cart[i].products.splice(j, 1);
                            }
                        }
                    }
                    if (cart[i].products.length === 0) {
                        cart.splice(i, 1);
                    }
                    if (!updateProduct) {
                        cart[i].products.push(cartItem);
                    }
                }
            }
            if (!updateShop) {
                cart.push({
                    shop_id: product.shop_id,
                    shop_name: product.shop.name,
                    products: [cartItem]
                });
            }
        }

        this.setState({
            cart: cart,
            total: this.total()
        });
        this._setCart();

        //Alert.alert('Đã thêm sản phẩm vào giỏ hàng');
    }

    total() {
        let cart = this.state.cart;
        let total = 0;
        if (cart.length > 0) {
            for (const key in cart) {
                total += cart[key].products.length;
            }
        }
        return total;
    }

    render() {
        return (
            <CartContext.Provider value={{
                cart: this.state.cart,
                total: this.state.total,
                addToCart: this.addToCart,
                removeFromCart: this.removeFromCart
            }}>
                {this.props.children}
            </CartContext.Provider>
        );
    }
}