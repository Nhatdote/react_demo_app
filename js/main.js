import {Linking, Clipboard} from "react-native";
import Toast from "react-native-tiny-toast";


function numberFormat(number, decimals, dec_point, thousands_point) {

    if (number == null || !isFinite(number)) {
        throw new TypeError("number is not valid");
    }

    if (!decimals) {
        var len = number.toString().split('.').length;
        decimals = len > 1 ? len : 0;
    }

    if (!dec_point) {
        dec_point = '.';
    }

    if (!thousands_point) {
        thousands_point = ',';
    }

    number = parseFloat(number).toFixed(decimals);

    number = number.replace(".", dec_point);

    var splitNum = number.split(dec_point);
    splitNum[0] = splitNum[0].replace(/\B(?=(\d{3})+(?!\d))/g, thousands_point);
    number = splitNum.join(dec_point);

    return number;
}

function openUrl(url) {
    Linking.canOpenURL(url).then(supported => {
        if (supported) {
            return Linking.openURL(url);
        } else {
            Toast.show('Không thể mở');
            return;
        }
    }).catch(error => console.warn('Không thể open Link___', error));
}

async function copyToClipboard(str) {
    Clipboard.setString(str);
    Toast.showSuccess('Đã sao chép vào bộ nhớ đệm', {duration: 500});
}

export {numberFormat, openUrl, copyToClipboard};
