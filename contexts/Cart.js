import React from 'react'
import {Alert} from "react-native";

export const CartContext = React.createContext();

export class CartProvider extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            cart: []
        };
        this.addToCart = this.addToCart.bind(this);
    }

    addToCart(product, qty = 1) {
        let cart = this.state.cart;

        let cartItem = {
            id: product.id,
            name: product.name,
            sale_price: product.sale_price,
            quantity: qty,
            total: product.price * qty,
            rate: product.rate,
            image: product.image
        };

        this.setState({
            cart: this.state.cart.concat(cartItem)
        });
        Alert.alert('Đã thêm sản phẩm vào giỏ hàng')
        console.log(this.state.cart);
    }

    render() {
        return (
            <CartContext.Provider value={{
                cart: this.state.cart,
                addToCart: this.addToCart
            }}>
                {this.props.children}
            </CartContext.Provider>
        );
    }
}