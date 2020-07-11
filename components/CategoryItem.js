import React from 'react'
import {StyleSheet, View, Text, Image, TouchableOpacity, Alert} from 'react-native'

export default function CategoryItem(props) {
    const { category, onPress } = props;
    return (
        <TouchableOpacity style={styles.button} onPress={onPress}>
            <View style={ styles.categoryItem }>
                <Text style={ styles.title }>{ category.name }</Text>
                <Image
                    style={ styles.img }
                    source={{uri: category.avatar}}
                />
            </View>
        </TouchableOpacity>
    );
}

const styles  = StyleSheet.create({
    categoryItem: {
        paddingVertical: 20,
        backgroundColor: 'white',
        marginVertical: 5,
        marginHorizontal: 10,
        borderRadius: 3,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 5,
        alignItems: 'center'

    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center'
    },
    img: {
        height: 50,
        width: 50,
        borderRadius: 50,
        marginHorizontal: 'auto'
    }
});