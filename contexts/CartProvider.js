import React from 'react'
import AsyncStorage from '@react-native-community/async-storage'
import Toast from "react-native-tiny-toast";
import Axios from "axios";

export const CartContext = React.createContext();

export class CartProvider extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            cart: [],
            checkingOut: false
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
            shop_name: product.shop_name,
            shop_type: product.shop_type
        };

        if (cart === []) {
            cart.push(cartItem);
        }else{
            let updateCart = false;
            cart.map((item, index) => {
                if (item.id === cartItem.id) {
                    updateCart = true;
                    item.quantity += qty;
                    item.total += item.sale_price * qty;
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

    total = () =>  {
        return this.state.cart.reduce((sum, item) => sum + item.total * item.rate, 0);
    };

    checkout = async () => {
        const {cart} = this.state;
        this.setState({checkingOut: true});
        Axios.post('/cart-checkout', {
            cart: JSON.stringify(cart)
        })
            .then(res => {
                console.log(res.data);
                if (res.data.status === 1) {

                }else{
                    Toast.show(res.data.msg);
                }
            })
            .catch(error => console.warn(error))
            .then(() => this.setState({checkingOut: false}));
    };

    render() {
        return (
            <CartContext.Provider value={{
                cart: this.state.cart,
                checkingOut: this.state.checkingOut,
                total: this.total,
                checkout: this.checkout,
                addToCart: this.addToCart,
                removeFromCart: this.removeFromCart
            }}>
                {this.props.children}
            </CartContext.Provider>
        );
    }
}