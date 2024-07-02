import { useEffect, useState } from "react"
import { Alert } from "react-native"

const useAppwrite = (fn) => {
    const [data, setData] = useState([])
    const [isLoading, setisLoading] = useState(false)

    const fetchData = async () => {

        setisLoading(true)


        try {
            const response = await fn();
            setData(response)
        } catch {
            Alert.alert("Error", error.message)
        } finally {
            setisLoading(false)
        }

    }

    useEffect(() => {


        fetchData()

    }, [])

    const refetch = () => fetchData()

    return { data, refetch, isLoading }


}

export default useAppwrite;