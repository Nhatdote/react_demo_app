import React from 'react'
import Storage from 'react-native-storage'
import AsyncStorage from '@react-native-community/async-storage'
import Toast from "react-native-tiny-toast"

const storage = new Storage({
    size: 1000,
    storageBackend: AsyncStorage,
    defaultExpires: 0,
    enableCache: true,
    sync: {
        // we'll talk about the details later.
    }
});

export const CartContext = React.createContext();

export class CartProvider extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            cart: [],
        };
        this.addToCart = this.addToCart.bind(this);
        this.removeFromCart = this.removeFromCart.bind(this);
    }

    componentDidMount() {
        // this._removeCart();
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
            data: this.state.cart,
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
                    this.setState({cart: res})
                }
            })
            .catch(err => {
                switch (err.name) {
                    case 'NotFoundError':
                        console.error('Your cart not found');
                        this._removeCart();
                        break;
                    case 'ExpiredError':
                        console.error('Your cart is expired');
                        this._removeCart();
                        break;
                }
            });
    }

    async removeFromCart(product) {
        let cart = this.state.cart;
        cart = cart.filter(item => item.id !== product.id);
        await this.setState({cart: cart});
        this._setCart();
        Toast.showSuccess('Đã xóa sản phẩm khỏi giỏ hàng', {
            position: 0,
            duration: 500
        });
    }

    async addToCart(product, qty = 1) {
        let cart = this.state.cart;
        let msg = 'Cập nhật giỏ hàng thành công';
        let cartItem = {
            id: product.id,
            name: product.name,
            sale_price: product.sale_price,
            quantity: qty,
            total: product.sale_price * qty,
            rate: product.rate,
            image: product.image,
            shop_id: product.shop_id,
            shop_name: product.shop_name
        };
        if (cart === []) {
            cart.push(cartItem);
        }else{
            let updateCart = false;
            cart.map((item, index) => {
                if (item.id === cartItem.id) {
                    updateCart = true;
                    item.quantity += qty;
                    if (item.quantity <= 0) {
                        cart.splice(index, 1);
                    }
                }
                return item;
            });
            if (!updateCart) {
                cart.push(cartItem);
                msg = 'Đã thêm sản phẩm vào giỏ hàng';
            }
        }
        await this.setState({cart: cart});
        this._setCart();
        Toast.showSuccess(msg, {
            position: 0,
            duration: 500
        });
    }

    render() {
        return (
            <CartContext.Provider value={{
                cart: this.state.cart,
                addToCart: this.addToCart,
                removeFromCart: this.removeFromCart
            }}>
                {this.props.children}
            </CartContext.Provider>
        );
    }
}