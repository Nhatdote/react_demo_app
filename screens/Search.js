import React from 'react'
import {
    StyleSheet,
    SafeAreaView,
    View,
    Text,
    Button,
    Dimensions,
    TextInput,
    Keyboard,
    TouchableWithoutFeedback, TouchableOpacity,
    Alert,
    RefreshControl, FlatList, Image, ScrollView
} from "react-native"
import { AntDesign } from '@expo/vector-icons'
import Axios from "axios";


import Color from "../components/Color";
import {numberFormat} from "../js/main";

export default class Search extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            search: '',
            results: [],
            resultTotal: 0,
            currentPage: 0,
            lastPage: 0
        };
        this.timeout = 0;
    }

    showEmptyListView = () => {
        return(
            <Text style={{marginTop: 50, color: Color.muted, textAlign: 'center', fontSize: 24}}>Không tìm thấy dữ liệu</Text>
        );
    };

    renderItem = (item) => {
        const {navigation} = this.props;
        return (
            <TouchableOpacity style={styles.resultItem} onPress={() => navigation.navigate('ProductDetail', {productId: item.id})}>
                <Image source={{uri: item.image}} style={{height: 40, width: 40, borderRadius: 50, marginRight: 5}} />
                <View style={{width: Dimensions.get('window').width - 130}}>
                    <Text numberOfLines={1}>{item.name}</Text>
                    <Text style={{color: 'tomato'}}>{numberFormat(item.sale_price * item.rate)} đ</Text>
                </View>
            </TouchableOpacity>
        );
    };

    handleSearch = async (search) => {
        if (search === '') {
            return;
        }

        if(this.timeout){
            clearTimeout(this.timeout)
        }

        this.timeout = setTimeout(() => {
            Axios.get('/search?s='+search)
                .then(res => {
                    this.setState({
                        results: res.data.data,
                        resultTotal: res.data.total,
                        currentPage: res.data.current_page,
                        lastPage: res.data.last_page
                    })
                })
                .catch(error => console.warn(error));
        }, 300);
    };

    render() {
        const {search, results} = this.state;
        return (
            <TouchableWithoutFeedback onPress={Keyboard.dismiss} >
                <SafeAreaView style={styles.container}>
                    <View style={styles.searchWrap}>
                        <AntDesign style={{top: 12, left: 8, color: '#c1c1c1'}} name="search1" size={16}/>
                        <TextInput
                            style={styles.searchBox}
                            onChangeText={search => this.handleSearch(search)}
                            placeholder={'Tìm kiếm sản phẩm'}
                            onFocus={isFocus => this.setState({isFocus})}
                        />
                    </View>

                    <FlatList
                        style={styles.resultWrap}
                        data={results}
                        renderItem={({item}) => this.renderItem(item)}
                        keyExtractor={item => `${item.id}`}
                        ListEmptyComponent={this.showEmptyListView()}
                    />
                </SafeAreaView>
            </TouchableWithoutFeedback>
        );
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: 'whitesmoke',
        paddingVertical: 10
    },
    searchWrap: {
        marginHorizontal: 15,
        backgroundColor: '#fff',
        flexDirection: 'row',
        borderRadius: 10
    },
    searchBox: {
        height: 40,
        paddingHorizontal: 14,
        flexGrow: 1
    },
    resultWrap: {
        margin: 15,
    },
    resultItem: {
        backgroundColor: 'white',
        padding: 10,
        marginVertical: 5,
        marginHorizontal: 10,
        borderRadius: 5,
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowRadius: 5,
        flexDirection: 'row'
    },
});