import React, { Component } from 'react'
import {StyleSheet, FlatList, Text, View, TextInput, TouchableOpacity, Image, Alert, KeyboardAvoidingView, Keyboard, TouchableHighlight} from 'react-native'
import { AntDesign } from '@expo/vector-icons'

import logo from "../images/logo.jpg"
import {UserContext} from "../contexts/UserProvider"
import {SafeAreaView} from "react-navigation";
import CartItem from "../components/CartItem";
import Style from "../js/Style";
import icon_store from "../images/flaticons/store.png";
import icon_dashboard from "../images/flaticons/dashboard.png";
import icon_history from "../images/flaticons/history.png";
import icon_order from "../images/flaticons/order.png";
import icon_user_info from "../images/flaticons/user_info.png";
import icon_logout from "../images/flaticons/logout.png";

export default class LoginView extends Component {
    static contextType = UserContext;
    constructor(props) {
        super(props);
    }

    menu = () => {
        const {handleLogout} = this.context;
        const menu = [
            {id: 1, title: 'Cửa hàng của tôi', icon: icon_store, navigate: 'Store'},
            {id: 2, title: 'Thống kê', icon: icon_dashboard, navigate: 'Dashboard'},
            {id: 3, title: 'Lịch sử giao dịch', icon: icon_history, navigate: 'History'},
            {id: 4, title: 'Đơn hàng', icon: icon_order, navigate: 'Order'},
            {id: 5, title: 'Thông tin tài khoản', icon: icon_user_info, navigate: 'UserInfo'},
            {id: 6, title: 'Đăng xuất', icon: icon_logout, onPress: handleLogout}
        ];
        return menu;
    };

    handleMenuPress = (item) => {
        const {navigation} = this.props;
        if (typeof item.onPress !== "undefined"){
            item.onPress();
        }else if (typeof item.navigate !== "undefined"){
            navigation.navigate(item.navigate);
        }else{
            Alert.alert('Không có hành động');
        }
    };

    renderItem = (item) => {
        const {navigation} = this.props;
        return (
            <TouchableOpacity style={[Style.card, {flex: 1, alignItems: 'center'}]}
                              onPress={() => this.handleMenuPress(item)}
            >
                <Image style={{height: 40, width: 40, marginVertical: 25}} source={item.icon} />
                <Text>{item.title}</Text>
            </TouchableOpacity>
        );
    };

    render() {
        const {navigation} = this.props;
        const {user, handleLogout} = this.context;
        const menu = this.menu();

        return (
            <SafeAreaView style={Style.container}>
                <FlatList
                    ListHeaderComponent={() => <View style={{alignItems: 'center'}}><Image style={styles.logo} source={logo} /></View>}
                    data={menu}
                    renderItem={({ item }) => this.renderItem(item)}
                    keyExtractor={item => `${item.id}`}
                    numColumns={2}
                />
            </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({
    logo: {
        marginVertical: 20,
        height: 50,
        width: 200
    }
});
