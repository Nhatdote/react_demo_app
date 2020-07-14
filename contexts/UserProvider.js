import React from 'react'
import {Alert, Keyboard, SafeAreaView} from "react-native"
import Toast from "react-native-tiny-toast"
import Axios from "axios"
import Storage from 'react-native-storage'
import AsyncStorage from '@react-native-community/async-storage'

const storage = new Storage({
    size: 1000,
    storageBackend: AsyncStorage,
    defaultExpires: 0,
    enableCache: true,
    sync: {
        // we'll talk about the details later.
    }
});

export const UserContext = React.createContext();

export class UserProvider extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            user: null,
        };
        this.handleLogin = this.handleLogin.bind(this);
    }

    componentDidMount() {
        this.getToken();
    }

    getToken() {
        console.log('get token...');
        storage
            .load({
                key: 'userToken',
                autoSync: true,
                syncInBackground: true,
                syncParams: {
                    extraFetchOptions: {},
                    someFlag: true
                }
            })
            .then(res => {
                console.log('storage: ' + res);
                if (res !== null) {
                    this.setState({token: res});
                }
            })
            .catch(error => {});
    }

    handleLogin (username, password) {;
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
                        storage.save({
                            key: 'userToken',
                            data: res.data.data.token,
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
        }
    }

    render() {
        return (
            <UserContext.Provider value={{
                handleLogin: this.handleLogin,
                user: this.state.user
            }}>
                {this.props.children}
            </UserContext.Provider>
        );
    }
}