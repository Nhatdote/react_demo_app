import React from 'react'
import {RefreshControl, StyleSheet, SafeAreaView, Text, View, Alert, FlatList} from 'react-native'
import CategoryItem from '../components/CategoryItem'
import Axios from 'axios'

export default class Categories extends React.Component{
    constructor (props) {
        super(props);
        this.state = {
            categories: [],
            refreshing: false
        };
        this.onRefresh = this.onRefresh.bind(this);
    }

    componentDidMount() {

        this.loadData();
    }

    loadData() {
        Axios.get('/get-categories')
            .then(res => {
                this.setState({
                    categories: res.data,
                    refreshing: false
                });
            })
    }

    onRefresh() {
        this.setState({refreshing: true});
        this.loadData();
    }

    render() {
        const {navigation} = this.props;
        const {categories, refreshing} = this.state;
        return (
            <SafeAreaView style={ styles.container }>
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