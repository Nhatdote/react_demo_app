import React, { Component } from 'react'
import {StyleSheet, Text, View, TextInput, TouchableOpacity, Image, Alert, KeyboardAvoidingView, Keyboard} from 'react-native'
import { AntDesign } from '@expo/vector-icons'

import logo from "../images/logo.jpg"
import {UserContext} from "../contexts/UserProvider"
import {SafeAreaView} from "react-navigation";

export default class LoginView extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <UserContext.Consumer>
                {({user}) => {
                    const {navigation} = this.props;
                    navigation.setOptions({
                        title: user.name ? user.name : 'Tài khoản'
                    });
                    return (
                        <SafeAreaView style={styles.container}>
                            <View style={styles.myShop}>
                                <Text style={styles.txtMenu}>Cửa hàng của tôi</Text>
                            </View>
                            <View style={styles.menuList}>
                                <Text style={styles.txtMenu}>Thống kê</Text>
                            </View>
                            <View style={styles.menuList}>
                                <Text style={styles.txtMenu}>Hệ thống liên kết</Text>
                            </View>
                            <View style={styles.menuList}>
                                <Text style={styles.txtMenu}>Giao dịch</Text>
                            </View>
                            <View style={styles.menuList}>
                                <Text style={styles.txtMenu}>Lịch sử giao dịch</Text>
                            </View>
                            <View style={styles.menuList}>
                                <Text style={styles.txtMenu}>Thanh toán hóa đơn</Text>
                            </View>
                        </SafeAreaView>
                    );
                }}
            </UserContext.Consumer>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        marginVertical: 5,
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'stretch',
        backgroundColor: 'whitesmoke',
    },
    myShop: {
        paddingVertical: 20,
        backgroundColor: 'white',
        marginVertical: 5,
        marginHorizontal: 10,
        borderRadius: 3,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 5,
        alignItems: 'center'
    },
    menuList: {
        paddingVertical: 20,
        backgroundColor: 'white',
        marginVertical: 5,
        marginHorizontal: 10,
        borderRadius: 3,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 5,
        alignItems: 'center'
    },
    txtMenu: {
        fontSize: 14,
        fontWeight: '700'
    }
});
