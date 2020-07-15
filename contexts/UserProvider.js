import React from 'react'
import {Alert, Keyboard, SafeAreaView} from "react-native"
import Toast from "react-native-tiny-toast"
import Axios from "axios"
import AsyncStorage from '@react-native-community/async-storage'

export const UserContext = React.createContext();

export class UserProvider extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            token: null,
            user: null
        };
        this.handleLogin = this.handleLogin.bind(this);
        this._getData = this._getData.bind(this);
    }

    async componentDidMount() {
        //this._removeData();
        const token = await this._getData();
        if (token) {
            this.loginToken(token);
            this.setState({token: token})
        }
    }

    loginToken = (token) => {
        Axios.get('/check-token?token='+token)
            .then(res => {
                if (res.data.status === 1) {
                    this.setState({user: res.data.data});
                    Toast.show(res.data.msg);
                }else{
                    Toast.show(res.data.msg);
                }
            })
            .catch(error => {
                console.log(error);
                Toast.show('Phiên đăng nhập hết hạn');
            });
    };

    _removeData = async () => {
        try {
            await AsyncStorage.removeItem('userToken');
        } catch(e) {
            // remove error
        }
    };

    _storeData = async (value) => {
        try {
            await AsyncStorage.setItem('userToken', value);
        } catch (e) {
            // error storing value
        }
    };

    _getData = async () => {
        try {
            const value = await AsyncStorage.getItem('userToken');
            if(value !== null) {
                return value;
            }else{
                Toast.show('Bạn chưa đăng nhập');
            }

        } catch(e) {
            // error reading value
        }
    };

    handleLogin (username, password) {
        if (!username) {
            Toast.show('Bạn chưa nhập tài khoản',{
                position: 25,
                duration: 1000
            });
        }else if (!password) {
            Toast.show('Bạn chưa nhập mật khẩu', {
                position: 25,
                duration: 1000
            });
        }else {
            Keyboard.dismiss();
            Axios.post('/login', {
                username: username,
                password: password
            })
                .then(res => {
                    if (res.data.status === 1) {
                        this.setState({user: res.data.data});
                        this._storeData(res.data.data.token);
                        Toast.showSuccess(res.data.msg, {
                            position: 0,
                            duration: 1000
                        });
                    }else{
                        Toast.show(res.data.msg, {
                            position: 25,
                            duration: 1000
                        });
                    }
                })
                .catch(error => console.log(error))
        }
    }

    handleLogout = async () => {
        await this._removeData();
        this.setState({
            token: null,
            user: null
        });
        Toast.showSuccess('Đăng xuất thành công');
    };

    render() {
        return (
            <UserContext.Provider value={{
                handleLogin: this.handleLogin,
                handleLogout: this.handleLogout,
                token: this.state.token,
                user: this.state.user
            }}>
                {this.props.children}
            </UserContext.Provider>
        );
    }
}