import { View, Text, Image, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { icons } from '../constants'
import { ResizeMode, Video } from 'expo-av'

export default function VideoCard({ item: { title, thumbnail, video, creator: { username, avatar } } }) {

    const [play, setPlay] = useState(false)
    return (
        <View className="flex-col items-center px-4 mb-14">

            <View className="flex-row gap-3 items-start">
                <View className="justify-center items-center flex-row flex-1">
                    <View className="w-[56px] h-[46px] items-center border-secondary justify-center p-0.5 rounded-lg border">
                        <Image source={{ uri: avatar }} className="w-full h-full rounded-lg" resizeMode='cover' />
                    </View>
                    <View className="justify-center flex-1 ml-3 gap-y-1">

                        <Text className="font-psemibold text-sm  text-white" numberOfLines={1}>{title}</Text>

                        <Text className="text-xs text-gray-100 font-pregular">
                            {username}
                        </Text>

                    </View>
                </View>
                <View className="p-2">
                    <Image source={icons.menu} className="w-5 h-5" resizeMode='contain' />
                </View>
            </View>

            {
                play ? (<Video source={{ uri: video }} className="w-full h-60 rounded-xl mt-3 bg-white/10" resizeMode={ResizeMode.COVER}
                    useNativeControls
                    shouldPlay
                    onPlaybackStatusUpdate={(status) => {
                        if (status.didJustFinish) {
                            setPlay(false)

                        }
                    }}
                />) : (

                    <TouchableOpacity
                        activeOpacity={0.7}
                        onPress={() => setPlay(true)}
                        className="w-full h-60 rounded-xl relative justify-center items-center  ">
                        <Image source={{ uri: thumbnail }} className=" w-full h-full rounded-xl mt-3 "
                            resizeMode='cover' />

                        <Image className="w-12 h-12 absolute" resizeMode='contain' source={icons.play} />
                    </TouchableOpacity>
                )
            }

        </View>
    )
}