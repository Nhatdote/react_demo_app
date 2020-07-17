import React from 'react'
import {Text, View, SafeAreaView, StyleSheet, FlatList, RefreshControl, Alert} from 'react-native'
import Axios from "axios";
import Toast from "react-native-tiny-toast";
import AsyncStorage from '@react-native-community/async-storage'



import Color from "../components/Color"
import {UserContext} from "../contexts/UserProvider";

export default class Notification extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentPage: 1,
            totalPage: null,
            notifications: [],
            refreshing: false,
        };
        //this.getNotification = this.getNotification.bind(this);
    }

    async loadData() {
        try {
            const value = await AsyncStorage.getItem('userToken');
            console.log('notification page get token: ' + value);
            if (value !== null) {
                Axios.get('/get-notifications', {
                    headers: {
                        Authorization: 'Bearer' + value
                    }
                })
                    .then(res => {
                        if (res.data.status === 1) {
                            this.setState({
                                notifications: res.data.data.data,
                            });
                        }else{
                            Toast.show(res.data.msg, {duration: 1000});
                        }
                    })
                    .catch(error => console.warn(error))
                    .then(() => {
                        this.setState({refreshing: false});
                    });
            }
        } catch(e) {
            // error reading value
            this.setState({refreshing: false});
        }
    }

    componentDidMount() {
        this.loadData();
    }

    renderItem = (item) => {
        return (
            <View style={styles.notificationItem}>
                <Text>{item.title}</Text>
            </View>
        );
    };

    async onRefresh() {
        this.setState({refreshing: true});
        await this.loadData();
        Toast.show('Đã làm mới thông báo', {duration: 1000})
    }

    render() {
        const {notifications, refreshing} = this.state;
        return (
            <UserContext.Consumer>
                {({user}) => {
                    return (
                        <SafeAreaView style={styles.container}>
                            {user === null
                                ?
                                <Text style={{color: Color.muted, textAlign: 'center', fontSize: 24}}>Bạn chưa đăng nhập</Text>
                                :
                                <FlatList
                                    refreshControl={
                                        <RefreshControl refreshing={refreshing} onRefresh={() => this.onRefresh()} />
                                    }
                                    data={notifications}
                                    renderItem={({item}) => this.renderItem(item)}
                                    keyExtractor={item => `${item.id}`}
                                    ListEmptyComponent={() => <Text style={{color: Color.muted, textAlign: 'center', fontSize: 24}}>Không có thông báo</Text>}
                                />
                            }
                        </SafeAreaView>

                    );
                }}
            </UserContext.Consumer>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'stretch',
        backgroundColor: 'whitesmoke',
        paddingVertical: 5
    },
    notificationItem: {
        backgroundColor: 'white',
        padding: 20,
        marginVertical: 5,
        marginHorizontal: 10,
        borderRadius: 5,
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowRadius: 5,
    },
    pagination: {
        margin: 20,
        flex: 1,
        flexDirection: 'row',
    },
    page: {
        backgroundColor: 'red'
    }
});
