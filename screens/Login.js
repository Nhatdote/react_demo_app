import React from 'react'
import {StyleSheet, Text, View, TextInput, TouchableOpacity, Image, Alert, KeyboardAvoidingView, Keyboard} from 'react-native'
import { AntDesign } from '@expo/vector-icons'
import {Button} from 'react-native-paper'

import logo from "../images/logo.jpg"
import {UserContext} from "../contexts/UserProvider";

export default class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: ''
        }
    }

    render() {
        const {username, password} = this.state;
        return (
            <KeyboardAvoidingView
                behavior={Platform.OS == "ios" ? "padding" : "height"}
                style={styles.container}
            >
                <Image source={logo} style={{height: 80, width: 270, marginBottom: 30}} />
                <View style={styles.inputContainer}>
                    <AntDesign style={styles.inputIcon} name="user" />
                    <TextInput style={styles.inputs}
                               placeholder="Tài khoản"
                               underlineColorAndroid='transparent'
                               onChangeText={(username) => this.setState({username})}/>
                </View>

                <View style={styles.inputContainer}>
                    <AntDesign style={styles.inputIcon} name="key" />
                    <TextInput style={styles.inputs}
                               placeholder="Mật khẩu"
                               secureTextEntry={true}
                               underlineColorAndroid='transparent'
                               onChangeText={(password) => this.setState({password})}/>
                </View>

                <UserContext.Consumer>
                    {({handleLogin, logging}) => {
                        return (
                            <Button mode="contained" icon="chevron-double-right" loading={logging} disabled={logging} style={styles.loginButton} onPress={() => handleLogin(username, password)}>
                                Login
                            </Button>
                        );
                    }}
                </UserContext.Consumer>


                <TouchableOpacity activeOpacity={0.6} style={styles.buttonContainer}>
                    <Text>Forgot your password?</Text>
                </TouchableOpacity>

                <TouchableOpacity activeOpacity={0.6} style={styles.buttonContainer}>
                    <Text>Register</Text>
                </TouchableOpacity>
            </KeyboardAvoidingView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'whitesmoke',
    },
    inputContainer: {
        borderBottomColor: '#F5FCFF',
        backgroundColor: '#FFFFFF',
        borderRadius:30,
        borderBottomWidth: 1,
        width:250,
        height: 40,
        marginBottom:20,
        flexDirection: 'row',
        alignItems:'center'
    },
    inputs:{
        height:45,
        marginLeft:16,
        borderBottomColor: '#FFFFFF',
        flex:1,
    },
    inputIcon:{
        marginLeft: 20,
        justifyContent: 'center'
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom:20,
        width:250,
        borderRadius:30,
    },
    loginButton: {
        width:250,
        borderRadius:30,
        marginBottom:20,
    },
    loginText: {
        color: 'white',
    }
});