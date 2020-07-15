import React from 'react'
import {Text, View, SafeAreaView, StyleSheet, FlatList, RefreshControl, Alert} from 'react-native'
import Html from 'react-native-htmlview'

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
        };
        //this.getNotification = this.getNotification.bind(this);
    }

    static contextType = UserContext;

    componentDidMount() {
        const { token } = this.context;
        Axios.get('/get-notifications', {
            headers: {
                Authorization: 'Bearer' + token
            }
        })
            .then(res => {
                if (res.data.status === 1) {
                    this.setState({notifications: res.data.data.data});
                }else{
                    Alert.alert(res.data.msg);
                }
            })
            .catch(error => console.warn(error));
    }

    renderItem = (item) => {
        return (
            <View style={styles.notificationItem}>
                <Text>{item.title}</Text>
            </View>
        );
    };

    render() {
        return (
            <UserContext.Consumer>
                {({user}) => {
                    if (user === null) {
                        return <Text style={{marginTop: 50, color: Color.muted, textAlign: 'center', fontSize: 24}}>Bạn chưa đăng nhập</Text>
                    }else{
                        const {notifications} = this.state;
                        return (
                            <SafeAreaView style={styles.container}>
                                <FlatList
                                    data={notifications}
                                    renderItem={({item}) => this.renderItem(item)}
                                    keyExtractor={item => `${item.id}`}
                                />
                                <View style={styles.pagination}>
                                    <View style={styles.page}>
                                        <Text>1</Text>
                                    </View>
                                    <View style={styles.page}>
                                        <Text>2</Text>
                                    </View>
                                    <View style={styles.page}>
                                        <Text>3</Text>
                                    </View>
                                </View>
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
        borderRadius: 3,
        shadowColor: '#000',
        shadowOpacity: 0.1,
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
