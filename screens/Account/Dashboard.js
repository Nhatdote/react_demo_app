import React from 'react';
import {SafeAreaView, Text, View, ScrollView} from 'react-native';
import {Title, Caption} from "react-native-paper";

import {UserContext} from "../../contexts/UserProvider";
import Style from "../../js/Style";
import Color from "../../components/Color";
import {numberFormat} from "../../js/main";
import Wallet from "../../components/Wallet";
import AffiliateLink from "../../components/AffiliateLink";
import Constants from "../../Constants";
import Axios from "axios";


export default class Dashboard extends React.Component {
    static contextType = UserContext;

    constructor(props) {
        super(props);
        this.state = {
            shop: null
        }
    }

    componentDidMount() {
        Axios.get('/account/store')
            .then(res => {
                if (res.data.status === 1) {
                    this.setState({
                        shop: res.data.data,
                    });
                }else{
                    console.warn(res.data.msg);
                }
            })
            .catch(error => console.warn(error));
    }


    render() {
        const {user} = this.context;
        const {navigation} = this.props;
        const {shop} = this.state;

        if (!user) {
            return <Caption style={{textAlign: 'center', marginVertical: 50}}>Bạn chưa đăng nhập</Caption>
        }

        return (
            <ScrollView>
                <SafeAreaView style={Style.container}>
                    <Wallet color={Color.purple} label={'Ví chính'} value={Constants.token_rate * user.stoken_system} />
                    <Wallet color={Color.blue} label={'Ví phụ'} value={Constants.token_rate * user.stoken} />
                    <Wallet color={Color.warning} label={'Ví khuyến mãi'} value={Constants.token_rate * user.stoken_tmp} />
                    <Wallet color={Color.success} label={'Ví Lãi Tiêu Dùng'} value={Constants.token_rate * user.stoken_bank} />
                    <AffiliateLink color={Color.alert_info} link={'https://tieudunghuutri.com/dang-ky/' + user.username} label={'Đường dẫn giới thiệu'} />
                    {shop !== null
                        ? <AffiliateLink color={Color.alert_warning} onPress={() => navigation.navigate('ShopView', {id: shop.id})} link={Constants.base_url + '/shop-view/' + shop.id + '/dashboard'} label={'Đường dẫn giới thiệu Shop'} />
                        : <Text style={{display: 'none'}}></Text>
                    }
                </SafeAreaView>
            </ScrollView>
        );
    }
}
