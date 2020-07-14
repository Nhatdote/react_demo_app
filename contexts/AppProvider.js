import React from 'react'

import {CartProvider} from "./CartProvider"
import {UserProvider} from "./UserProvider"

export const AppContext = React.createContext();

export class AppProvider extends React.Component {
    render() {
        return (
            <AppContext.Provider>
                <UserProvider>
                    <CartProvider>
                        {this.props.children}
                    </CartProvider>
                </UserProvider>
            </AppContext.Provider>
        );
    }
}