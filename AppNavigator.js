import React from 'react'
import {Image, StyleSheet, View, Text} from 'react-native'
import { createStackNavigator } from "@react-navigation/stack"
import {createBottomTabNavigator} from "@react-navigation/bottom-tabs"
import { AntDesign } from '@expo/vector-icons';

import Categories from "./screens/Categories"
import Products from "./screens/Products"
import ProductDetail from "./screens/ProductDetail"
import Cart from "./screens/Cart"
import Search from "./screens/Search"
import Notification from "./screens/Notification"
import User from "./screens/User"
import {CartProvider} from "./contexts/Cart"
import {CartContext} from "./contexts/Cart";

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const HomeStack = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen name="Catogories" component={Categories} options={{title: 'Trang chủ'}} />
            <Stack.Screen name="Products" component={Products} options={{headerBackTitle: ' '}}/>
            <Stack.Screen name="ProductDetail" component={ProductDetail} options={{headerBackTitle: ' '}} />
        </Stack.Navigator>
    );
};

const CartStack = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen name="Cart" component={Cart} options={{title: 'Giỏ hàng'}}/>
        </Stack.Navigator>
    );
};

const SearchStack = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen name="Search" component={Search} options={{title: 'Tìm kiếm'}}/>
        </Stack.Navigator>
    );
};

const NotificationStack = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen name="Notifications" component={Notification} options={{title: 'Thông báo'}}/>
        </Stack.Navigator>
    );
};

const UserStack = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen name="User" component={User} options={{title: 'Tài khoản'}}/>
        </Stack.Navigator>
    );
};

function IconWithBadge({ name, badge, color, size }) {
    return (
        <View style={{ width: 24, height: 24, margin: 5 }}>
            <AntDesign name={name} size={size} color={color} />
            {badge > 0 && (
                <View
                    style={{
                        // On React Native < 0.57 overflow outside of parent will not work on Android, see https://git.io/fhLJ8
                        position: 'absolute',
                        right: -6,
                        top: -3,
                        backgroundColor: 'red',
                        borderRadius: 10,
                        paddingHorizontal: 4,
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                >
                    <Text style={{ color: 'white', fontSize: 10, fontWeight: 'bold' }}>
                        {badge}
                    </Text>
                </View>
            )}
        </View>
    );
}

function HomeIconWithBadge(props) {
    // You should pass down the badgeCount in some other ways like React Context API, Redux, MobX or event emitters.
    return <IconWithBadge {...props} />;
}

const AppNavigator = () => {
    return (
        <CartProvider>
            <Tab.Navigator
                screenOptions={({ route }) => ({
                    tabBarIcon: ({ color, size }) => {
                        let iconName;
                        let badge = 0;

                        switch (route.name) {
                            case 'Home':
                                iconName = 'home';
                                break;
                            case 'Cart':
                                iconName = 'shoppingcart';
                                break;
                            case 'Search':
                                iconName = 'search1';
                                break;
                            case 'User':
                                iconName = 'user';
                                break;
                            case 'Notification':
                                iconName = 'bells';
                                badge = 12;
                                break;
                        }
                        return (
                            <CartContext.Consumer>
                                { ({cart}) => {
                                    return (
                                        <HomeIconWithBadge name={iconName} size={size} color={color} badge={iconName === 'shoppingcart' ? cart.length : ''}/>
                                    );
                                }}
                            </CartContext.Consumer>
                        );
                    },
                })}
                tabBarOptions={{
                    activeTintColor: 'tomato',
                    inactiveTintColor: 'gray',
                }}
            >
                <Tab.Screen name="Home" component={HomeStack} options={{title: 'Trang chủ'}} />
                <Tab.Screen name="Cart" component={CartStack} options={{title: 'Giỏ hàng'}} />
                <Tab.Screen name="Search" component={SearchStack} options={{title: 'Tìm kiếm'}} />
                <Tab.Screen name="Notification" component={NotificationStack} options={{title: 'Tìm kiếm'}} />
                <Tab.Screen name="User" component={UserStack} options={{title: 'Tài khoản'}} />
            </Tab.Navigator>
        </CartProvider>
    );
};

const styles = StyleSheet.create({
    logoVns: {
        height: 50,
        width: 170,
    }
});

export default AppNavigator;