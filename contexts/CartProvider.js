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
        return this.state.cart.reduce((sum, item) => sum + item.total, 0);
    };

    checkProductInvalid = () => {
        let {cart} = this.state;
        let invalid = 0;
        cart = cart.map(item => {
            if (item.invalid) {
                invalid++;
            }
            return item;
        });
        return invalid;
    };

    checkout = async () => {
        let {cart} = this.state;
        let checkProductInvalid = this.checkProductInvalid();
        if (checkProductInvalid > 0){
            Toast.show('Vui lòng xóa sản phẩm không hợp lệ trong giỏ hàng!');
            return;
        }
        const token = await AsyncStorage.getItem('userToken');
        if (token === null) {
            Toast.show('Vui lòng đăng nhập để thanh toán');
            return;
        }
        this.setState({checkingOut: true});
        Axios.post('/cart-checkout', {
            cart: JSON.stringify(cart)
        })
            .then(async res => {
                if (res.data.status === 1) {

                }else{
                    if (typeof res.data.invalid !== "undefined") {
                        cart = cart.map(item => {
                            if (res.data.invalid.indexOf(item.id) !== -1) {
                                item.invalid = 1;
                            }
                            return item;
                        });
                        await this._storeData(cart);
                        console.log('Done!');
                    }
                }
                Toast.show(res.data.msg);
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