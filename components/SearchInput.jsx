import { View, Text, TextInput, TouchableOpacity, Image, Alert } from 'react-native'
import React, { useState } from 'react'
import { icons } from '../constants'
import { router, usePathname } from 'expo-router'

const SearchInput = ({ initialQuery }) => {


    const pathname = usePathname()

    const [query, setQuery] = useState(initialQuery || '')


    return (


        <View className="border-2 border-black-200 rounded-2xl w-full h-16 px-4 bg-black-100 focus:border-secondary items-center flex-row">
            <TextInput className="flex-1 text-white font-pregular mt-0.5 text-base"
                value={query}
                placeholder={"Search For a video topic"}
                placeholderTextColor={"#cdcde0"}
                onChangeText={(e) => setQuery(e)}


            />

            <TouchableOpacity
                onPress={() => {
                    if (!query) {

                        return Alert.alert("Mssing query", "Please input something to search results across database")
                    }


                    if (pathname.startsWith('/search')) router.setParams({ query })
                    else {
                        router.push(`/search/${query}`)
                    }
                }}
            >

                <Image source={icons.search} className="w-5 h-5" resizeMode='contain' />

            </TouchableOpacity>
        </View>

    )
}

export default SearchInput