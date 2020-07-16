import React from 'react'
import {Text, View, SafeAreaView, StyleSheet, FlatList, RefreshControl, Alert} from 'react-native'
import Toast from "react-native-tiny-toast";

import Color from "../components/Color"
import {UserContext} from "../contexts/UserProvider";
import Axios from "axios";

export default class Notification extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentPage: 1,
            totalPage: null,
            notifications: [],
            refreshing: false
        };
        //this.getNotification = this.getNotification.bind(this);
    }

    static contextType = UserContext;

    loadData() {
        const { token } = this.context;
        if (token) {
            Axios.get('/get-notifications', {
                headers: {
                    Authorization: 'Bearer' + token
                }
            })
                .then(res => {
                    if (res.data.status === 1) {
                        this.setState({
                            notifications: res.data.data.data,
                            refreshing: false
                        });
                    }else{
                        Alert.alert(res.data.msg);
                    }
                })
                .catch(error => console.warn(error));
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

    showEmptyListView = () => {
        return(
            <Text style={{marginTop: 50, color: Color.muted, textAlign: 'center', fontSize: 24}}>Không có thông báo</Text>
        );
    };

    async onRefresh() {
        this.setState({refreshing: true});
        await this.loadData();
        Toast.show('Đã làm mới thông báo', {duration: 1000})
    }

    render() {
        return (
            <UserContext.Consumer>
                {({user}) => {
                    if (user === null) {
                        return <Text style={{marginTop: 50, color: Color.muted, textAlign: 'center', fontSize: 24}}>Bạn chưa đăng nhập</Text>
                    }else{
                        const {notifications, refreshing} = this.state;
                        return (
                            <SafeAreaView style={styles.container}>
                                <FlatList
                                    refreshControl={
                                        <RefreshControl refreshing={refreshing} onRefresh={() => this.onRefresh()} />
                                    }
                                    data={notifications}
                                    renderItem={({item}) => this.renderItem(item)}
                                    keyExtractor={item => `${item.id}`}
                                    ListEmptyComponent={this.showEmptyListView()}
                                />
                            </SafeAreaView>
                        );
                    }
                }}
            </UserContext.Consumer>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'space-between',
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
