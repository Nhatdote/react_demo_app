import React from 'react'
import {StyleSheet, SafeAreaView, View, Text, Button, Dimensions, TextInput, Keyboard, TouchableWithoutFeedback, TouchableOpacity, Alert, RefreshControl, FlatList, Image, ScrollView, ActivityIndicator} from "react-native"
import { AntDesign } from '@expo/vector-icons'
import Axios from "axios";


import Color from "../components/Color";
import {numberFormat} from "../js/main";
import ProductItem from "../components/ProductItem";

const initState = {
    search: '',
    results: [],
    resultTotal: 0,
    currentPage: 0,
    lastPage: 0,
    readyData: true
};

export default class Search extends React.Component{
    constructor(props) {
        super(props);
        this.state = initState;
        this.timeout = 0;
        this.searching = false;
    }


    handleSearch = async (search) => {
        this.setState({search: search});
        if (search === '') {
            clearTimeout(this.timeout)
            this.setState(initState);
            return;
        }

        if(this.timeout){
            clearTimeout(this.timeout)
        }
        this.setState({readyData: false});
        this.timeout = setTimeout(() => {
            Axios.get('/search?s='+search)
                .then(res => {
                    this.setState({
                        results: res.data.data,
                        resultTotal: res.data.total,
                        currentPage: res.data.current_page,
                        lastPage: res.data.last_page,
                        readyData: true,
                    });
                })
                .catch(error => console.warn(error))
        }, 300);
    };

    render() {
        const {navigation} = this.props;
        const {search, results, readyData} = this.state;
        return (
            <TouchableWithoutFeedback onPress={Keyboard.dismiss} >
                <SafeAreaView style={styles.container}>
                    <View style={styles.searchWrap}>
                        <AntDesign style={{top: 12, left: 8, color: '#c1c1c1'}} name="search1" size={16}/>
                        <TextInput
                            style={styles.searchBox}
                            onChangeText={search => this.handleSearch(search)}
                            placeholder={'Tìm kiếm sản phẩm'}
                        />
                    </View>
                    {!readyData
                        ? <View style={{flex: 1, justifyContent: 'center'}}>
                            <ActivityIndicator size="large" />
                        </View>
                        : <FlatList
                            columnWrapperStyle={styles.flatWrapper}
                            data={results}
                            renderItem={({item}) => <View style={styles.flatProduct}><ProductItem product={ item } onPress={() => navigation.navigate('ProductDetail', {
                                productId: item.id
                            })} /></View>}
                            keyExtractor={item => `${item.id}`}
                            ListEmptyComponent={search === ''
                                ? () => <Text style={{marginTop: 50, color: Color.muted, textAlign: 'center', fontSize: 24}}>Nhập từ khóa tìm kiếm</Text>
                                : () => <Text style={{marginTop: 50, color: Color.muted, textAlign: 'center', fontSize: 24}}>Không tìm thấy dữ liệu</Text>
                            }
                            numColumns={2}
                        />
                    }
                </SafeAreaView>
            </TouchableWithoutFeedback>
        );
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'stretch',
        backgroundColor: 'whitesmoke',
        paddingVertical: 10
    },
    searchWrap: {
        marginHorizontal: 6,
        backgroundColor: '#fff',
        flexDirection: 'row',
        borderRadius: 10,
        marginBottom: 10
    },
    searchBox: {
        height: 40,
        paddingHorizontal: 14,
        flexGrow: 1
    },
    flatProduct: {
        flex: 1
    },
    flatWrapper: {
        paddingHorizontal: 3,
        paddingVertical: 3
    }
});