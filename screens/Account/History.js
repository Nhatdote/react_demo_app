import React from 'react';
import {SafeAreaView, Text, ScrollView, StyleSheet, Dimensions, Modal, View, TouchableHighlight, Alert} from 'react-native';
import {Title, Caption, FAB, Portal, Provider, Headline, Subheading, Button} from "react-native-paper";
import Toast from "react-native-tiny-toast";
import { AntDesign } from '@expo/vector-icons';
import DatePicker from 'react-native-datepicker'


import Style from "../../js/Style";
import Color from "../../components/Color";

export default class History extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isOpen: false,
            loading: false,
            modalVisible: false,
            startTime: null,
            endTime: null
        }
    }

    componentDidMount() {
        const {navigation} = this.props;
        navigation.setOptions({
            headerRight: () => <Button onPress={() => this.setModalVisible(true)} color={'#fff'} style={{marginRight: 5}}><AntDesign name="filter" size={16} /> Lọc</Button>
        })
    }

    setModalVisible = (visible) => {
        this.setState({ modalVisible: visible });
    };

    render() {
        const height = Dimensions.get('window').height;
        const {isOpen, modalVisible} = this.state;

        return (
            <ScrollView>
                <SafeAreaView style={[Style.container, {minHeight: height - 110}]}>
                    <Subheading style={{textAlign: 'center'}}>Chọn loại lịch sử muốn xem</Subheading>

                    <Modal
                        animationType="slide"
                        transparent={true}
                        visible={modalVisible}
                        onRequestClose={() => {
                            this.setModalVisible(false);
                        }}
                    >
                        <View style={styles.centeredView}>
                            <View style={styles.modalView}>
                                <Caption >Từ ngày</Caption>
                                <DatePicker
                                    style={{width: 300, marginBottom: 10, height: 40, borderRadius: 30}}
                                    date={this.state.date}
                                    mode="date"
                                    androidMode="spinner"
                                    placeholder="Chọn ngày"
                                    format="YYYY-MM-DD"
                                    minDate="2019-01-01"
                                    maxDate="2020-07-27"
                                    confirmBtnText="Chọn"
                                    cancelBtnText="Hủy"
                                    showIcon={false}
                                    customStyles={{
                                        borderRadius: 30
                                        // ... You can check the source to find the other keys.
                                    }}
                                    onDateChange={(date) => {this.setState({date: date})}}
                                />

                                <TouchableHighlight
                                    style={{ ...styles.openButton, backgroundColor: "#2196F3" }}
                                    onPress={() => {
                                        this.setModalVisible(!modalVisible);
                                    }}
                                >
                                    <Text style={styles.textStyle}>Hide Modal</Text>
                                </TouchableHighlight>
                            </View>
                        </View>
                    </Modal>

                    <Provider>
                        <Portal>
                            <FAB.Group
                                open={isOpen}
                                icon={isOpen ? 'playlist-remove' : 'format-list-bulleted-type'}
                                actions={[
                                    {
                                        icon: 'database-search',
                                        label: 'Lịch sử bán hàng từ shop',
                                        style: {backgroundColor: Color.info},
                                        onPress: () => Toast.show('Xem lịch sử bán hàng từ shop')
                                    },
                                    {
                                        icon: 'database-search',
                                        label: 'Lãi tiêu dùng',
                                        style: {backgroundColor: Color.blue},
                                        onPress: () => console.log('Pressed star'),
                                    },
                                    {
                                        icon: 'database-search',
                                        label: 'Lịch sử rút tiền',
                                        style: {backgroundColor: Color.success},
                                        onPress: () => console.log('Pressed star'),
                                    },
                                    {
                                        icon: 'database-search',
                                        label: 'Lịch sử chuyển tiền',
                                        style: {backgroundColor: Color.warning},
                                        onPress: () => console.log('Pressed star'),
                                    },
                                    {
                                        icon: 'database-search',
                                        label: 'Lịch sử mua hàng',
                                        style: {backgroundColor: Color.danger},
                                        onPress: () => console.log('Pressed email'),
                                    },
                                    {
                                        icon: 'database-search',
                                        label: 'Hoa hồng hệ thống',
                                        style: {backgroundColor: Color.purple},
                                        onPress: () => console.log('Pressed notifications'),
                                    },
                                ]}
                                onStateChange={() => this.setState({isOpen: !this.state.isOpen})}
                                onPress={() => {
                                    if (isOpen) {
                                        // do something if the speed dial is open
                                    }
                                }}
                            />
                        </Portal>
                    </Provider>
                </SafeAreaView>
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    fab: {
        position: 'absolute',
        margin: 16,
        right: 0,
        bottom: 0,
    },
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22
    },
    modalView: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 5,
        padding: 15,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1
        },
        shadowOpacity: 0.1,
        shadowRadius: 1,
        elevation: 2
    },
    openButton: {
        backgroundColor: "#F194FF",
        borderRadius: 20,
        padding: 10,
        elevation: 2
    },
    textStyle: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center"
    },
    modalText: {
        marginBottom: 15,
        textAlign: "center"
    }
});
