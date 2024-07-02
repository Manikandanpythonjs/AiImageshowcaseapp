import { FlatList, Image, ImageBackground, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import * as Animatable from 'react-native-animatable'
import { icons } from '../constants'
import { ResizeMode, Video } from 'expo-av'


const ZooIn = {

    0: {
        scale: 0.9
    },
    1: {
        scale: 1.1
    }
}

const ZooOut = {

    0: {
        scale: 1,
    },
    1: {
        scale: 0.9
    }
}

const TreandingItem = ({ activeItem, item }) => {

    const [Play, setPlay] = useState(false)

    return (
        <Animatable.View className="mr-5" animation={activeItem === item.$id ? ZooIn : ZooOut} duration={500}>

            {Play ? (
                <View className="p-2 ml-2">
                    <Video source={{ uri: item.video }} className="w-52 h-72 rounded-[35px] mt-3 bg-white/10" resizeMode={ResizeMode.COVER}
                        useNativeControls
                        shouldPlay
                        onPlaybackStatusUpdate={(status) => {
                            if (status.didJustFinish) {
                                setPlay(false)

                            }
                        }}
                    />
                </View>

            ) : (
                <View className="p-2 ml-2">
                    <TouchableOpacity className="relative justify-center items-center" activeOpacity={0.7} onPress={() => setPlay(true)}>

                        <ImageBackground source={{ uri: item.thumbnail }} className="w-52 h-72 rounded-[35px] my-5 overflow-hidden shadow-lg shadow-black-100/40"
                            resizeMode='cover' />

                        <Image source={icons.play} className="w-12 h-12 absolute" resizeMode='contain' />

                    </TouchableOpacity>
                </View>


            )}


        </Animatable.View>
    )





}

const Trending = ({ posts }) => {
    const [activeItem, setActiveItem] = useState(posts[1])

    const viewableItemsChanged = ({ viewableItems }) => {

        if (viewableItems.length > 0) {


            setActiveItem(viewableItems[0].key)

        }

    }
    return (
        <FlatList data={posts} keyExtractor={(item) => item.$id}
            renderItem={({ item }) => (
                <TreandingItem activeItem={activeItem} item={item} />
            )} onViewableItemsChanged={
                viewableItemsChanged
            }
            viewabilityConfig={{
                itemVisiblePercentThreshold: 70
            }}

            contentOffset={{ x: 170 }}
            horizontal
        />
    )
}

export default Trending

const styles = StyleSheet.create({})