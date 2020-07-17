import React from 'react'
import {RefreshControl, StyleSheet, SafeAreaView, Text, View, Alert, FlatList, ActivityIndicator, Image} from 'react-native'
import Axios from 'axios'
import Toast from "react-native-tiny-toast";

import CategoryItem from '../components/CategoryItem'

export default class Categories extends React.Component{
    constructor (props) {
        super(props);
        this.state = {
            categories: [],
            refreshing: false,
            readyData: false
        };
        this.onRefresh = this.onRefresh.bind(this);
    }

    componentDidMount() {
        this.loadData();
    }

    loadData(refresh = false) {
        Axios.get('/get-categories')
            .then(async res => {
                await this.setState({
                    categories: res.data,
                    refreshing: false,
                    readyData: true
                });
                if (refresh) {
                    Toast.show('Đã làm mới danh mục ',  {duration: 500})
                }
            })
            .catch(error => console.warn(error))
    }

    onRefresh() {
        this.setState({refreshing: true});
        this.loadData(true);
    }

    render() {
        const {navigation} = this.props;
        const {categories, refreshing, readyData} = this.state;
        return (
            <SafeAreaView style={ styles.container }>
                {!readyData
                    ?
                    <ActivityIndicator size="large" />
                    :
                    <FlatList
                        refreshControl={
                            <RefreshControl refreshing={refreshing} onRefresh={this.onRefresh} />
                        }
                        data={ categories }
                        renderItem={({ item }) => <CategoryItem category={ item } onPress={() => navigation.navigate('Products', {
                            category: item
                        })} />}
                        keyExtractor={(item) => `${item.id}`}
                    />
                }
            </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'whitesmoke',
        flex: 1,
        justifyContent: 'center',
        marginVertical: 5
    }
});