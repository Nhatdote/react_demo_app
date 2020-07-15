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
        // this._removeData();
        this._getData();
    }

    _removeData = async () => {
        try {
            await AsyncStorage.removeItem('cart');
        } catch(e) {
            // remove error
        }
    };

    _storeData = async (value) => {
        try {
            const jsonValue = JSON.stringify(value);
            await AsyncStorage.setItem('cart', jsonValue);
        } catch (e) {
            // saving error
        }
    };

    _getData = async () => {
        try {
            const jsonValue = await AsyncStorage.getItem('cart');
            if (jsonValue != null) {
                let value = JSON.parse(jsonValue);
                if (!Array.isArray(value)) {
                    value = [];
                }
                this.setState({cart: value});
            }else{
                console.log('Your cart is empty!');
            }
        } catch(e) {
            // error reading value
        }
    };

    async removeFromCart(product) {
        let cart = this.state.cart;
        cart = cart.filter(item => item.id !== product.id);
        await this.setState({cart: cart});
        this._storeData(cart);
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
        this._storeData(cart);
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