import React from 'react'
import {Text, View, SafeAreaView, StyleSheet, FlatList, RefreshControl, Alert, TouchableOpacity, TouchableHighlight} from 'react-native'
import Axios from "axios";
import Toast from "react-native-tiny-toast";
import AsyncStorage from '@react-native-community/async-storage';
import {Caption} from "react-native-paper";

import {UserContext} from "../contexts/UserProvider";
import Color from "../components/Color"
import Style from "../js/Style";
import {Fontisto} from "@expo/vector-icons";

// React.useEffect(() => {
//     const unsubscribe = navigation.addListener('tabPress', (e) => {
//         // Prevent default behavior
//         console.log('press');
//         e.preventDefault();
//
//         // Do something manually
//         // ...
//     });
//
//     return unsubscribe;
// }, [navigation]);


export default class Notifications extends React.Component {
    static contextType = UserContext;
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
        const {setCountNotify} = this.context;

        try {
            const value = await AsyncStorage.getItem('userToken');
            if (value !== null) {
                Axios.get('/notification/list', {
                    headers: {
                        Authorization: 'Bearer' + value
                    }
                })
                    .then(res => {
                        if (res.data.status === 1) {
                            this.setState({
                                notifications: res.data.data.data,
                            });
                            let count = 0;
                            res.data.data.data.forEach((item) => {
                                if (item.readedStatus === 0) {
                                    count++;
                                }
                            });
                            setCountNotify(count);
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

    componentDidUpdate(prevProps, prevState, snapshot) {
        const {navigation} = this.props;
        navigation.addListener('tabPress', e => {
            console.log(e);
        });
    }

    handleReadDetail = (item) => {
        const {setCountNotify, countNotify} = this.context;
        const {notifications} = this.state;
        const {navigation} = this.props;
        let pos = notifications.indexOf(item);
        if (pos >= 0 && !item.readedStatus) {
            notifications[pos].readedStatus = 1;
            this.setState({notifications: notifications});
            Axios.get('/notification/read/'+item.id);
        }

        navigation.navigate('NotificationDetail', {
            notification: item
        })
    };

    renderItem = (item) => {
        return (
            <TouchableHighlight style={[Style.card, {marginVertical: 5}, !item.readedStatus && styles.notifyNotRead]}
                                onPress={() => this.handleReadDetail(item)} underlayColor="whitesmoke">
                <View>
                    <Text>{item.title}</Text>
                    <View style={{flexDirection: 'row', justifyContent: 'flex-end'}}>
                        <Caption style={{marginRight: 10}}><Fontisto name="earth" /> {item.notify === 'notify' ? 'Thông báo' : 'Hệ thống'}</Caption>
                        <Caption><Fontisto name="clock" /> {item.created_time}</Caption>
                    </View>
                </View>
            </TouchableHighlight>
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
                        <SafeAreaView style={[Style.container, {paddingVertical: 5}]}>
                            {user === null
                                ?
                                <Text style={{color: Color.muted, textAlign: 'center', fontSize: 24}}>Bạn chưa đăng nhập</Text>
                                :
                                <FlatList
                                    ListHeaderComponent={() => <Caption style={{textAlign: 'right', marginRight: 10}}>Màu xanh là thông báo chưa đọc</Caption>}
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
    notifyNotRead: {
        backgroundColor: '#1993002e',
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
