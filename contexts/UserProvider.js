import React from 'react'
import {Alert, Keyboard, SafeAreaView} from "react-native"
import Toast from "react-native-tiny-toast"
import Axios from "axios"
import AsyncStorage from '@react-native-community/async-storage'

const LocalUrl = 'http://192.168.3.28/api';
const ServerUrl = 'https://tieudunghuutri.com/api';
Axios.defaults.baseURL = LocalUrl;

export const UserContext = React.createContext();

export class UserProvider extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            token: null,
            user: null,
            logging: false,
            countNotify: 0,
        };
        this.handleLogin = this.handleLogin.bind(this);
    }

    async componentDidMount() {
        //this._removeData();
        const token = await this._getData();
        if (token) {
            this.setState({token: token});
            this.loginToken(token);
            this.setCountNotify();
        }
    }

    setCountNotify = (clear = null) => {
        if (!clear) {
            const url = '/notification/count';
        }else{
            const url = 'notification/count?clear=1';
        }
        Axios.get('/notification/count')
            .then(res => {
                if (res.data.status === 1) {
                    this.setState({countNotify: res.data.data});
                }
            })
            .catch(error => console.warn(error));
    };

    loginToken = (token) => {
        Axios.get('/check-token', {
            headers: {
                Authorization: 'Bearer' + token
            }
        })
            .then(res => {
                if (res.data.status === 1) {
                    this.setState({
                        user: res.data.data,
                    });
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
            this.setState({
                logging: true
            });
            Axios.post('/login', {
                username: username,
                password: password
            })
                .then(async res => {
                    if (res.data.status === 1) {
                        await this._storeData(res.data.data.token);
                        this.setState({
                            token: res.data.data.token,
                            user: res.data.data,
                        });
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
                .then(() => this.setState({ logging: false}))
        }
    }

    handleLogout = async () => {
        await this._removeData();
        await this.setState({
            token: null,
            user: null
        });
        Toast.showSuccess('Đăng xuất thành công', {duration: 1000});
    };

    render() {
        const {token} = this.state;
        if (token) {
            Axios.defaults.headers.common['Authorization'] = 'Bearer' + token;
        }else{
            Axios.defaults.headers.common['Authorization'] = null;
        }
        return (
            <UserContext.Provider value={{
                handleLogin: this.handleLogin,
                handleLogout: this.handleLogout,
                token: this.state.token,
                user: this.state.user,
                logging: this.state.logging,
                countNotify: this.state.countNotify,
                setCountNotify: this.setCountNotify,
            }}>
                {this.props.children}
            </UserContext.Provider>
        );
    }
}