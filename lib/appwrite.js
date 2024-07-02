import { Client, Account, ID, Avatars, Databases, Query, Storage } from 'react-native-appwrite';

export const appwriteConfig = {
    endpoint: 'https://cloud.appwrite.io/v1',
    platform: "com.mkd.postapp",
    projectId: "6622918f46e7b841247c",
    databaseId: "662293fcbbb4ebb8f7eb",
    userCollectionId: "6622943eb587c0200f33",
    videoCollectionId: "662294746c383c591566",
    storageId: "662296eba102d580df27"

}


const client = new Client();

client
    .setEndpoint(appwriteConfig.endpoint)
    .setProject(appwriteConfig.projectId)
    .setPlatform(appwriteConfig.platform);

const account = new Account(client);
const avatars = new Avatars(client);
const databases = new Databases(client)
const storage = new Storage(client)



export const createUser = async (email, password, username, createdAt) => {


    try {
        const newAccount = await account.create(
            ID.unique(),
            email,
            password,
            username
        )

        if (!newAccount) throw Error;

        const avatarurl = avatars.getInitials()


        await signIn(email, password);

        const newUser = await databases.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            ID.unique(),
            {
                accountId: newAccount.$id,
                email,
                username,
                avatar: avatarurl,
                createdAt
            }

        )

        return newUser

    } catch (error) {

        console.log(error);
        throw new Error(error)
    }

}


export async function signIn(email, password) {

    try {
        const session = await account.createEmailSession(email, password)

        return session
    } catch (error) {

        throw new Error(error)
    }


}



export const getCurrentUser = async () => {

    try {

        const currentAccount = await account.get()

        if (!currentAccount) throw Error;


        const currentUser = await databases.listDocuments(

            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,

            [Query.equal('accountId', currentAccount.$id)]
        )

        if (!currentUser) throw Error;


        return currentUser.documents[0]

    } catch (error) {

        console.log(error.message);

    }

}



export const getAllpost = async () => {


    try {
        const posts = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.videoCollectionId,
            [Query.orderDesc('$createdAt')]
        )

        return posts.documents
    } catch (error) {

        throw new Error(error)

    }
}



export const getLatestPosts = async () => {


    try {
        const posts = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.videoCollectionId,
            [Query.orderDesc('$createdAt', Query.limit(7))]
        )

        return posts.documents
    } catch (error) {

        throw new Error(error)

    }
}



export const SearchPost = async (query) => {


    try {
        const posts = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.videoCollectionId,
            [Query.search('title', query)]
        )

        return posts.documents
    } catch (error) {

        throw new Error(error)

    }
}


export const getUserPosts = async (userID) => {


    try {
        const posts = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.videoCollectionId,
            [Query.equal('creator', userID)]
        )

        return posts.documents
    } catch (error) {

        throw new Error(error)

    }
}


export const SignOut = async () => {

    try {

        const session = await account.deleteSession('current')

        return session
    } catch (error) {
        throw new Error(error)

    }
}


export const getFilePreview = async (fileId, type) => {

    let fileURL;
    try {

        if (type === 'video') {

            fileURL = storage.getFileView(appwriteConfig.storageId, fileId)
        } else if (type === 'image') {


            fileURL = storage.getFilePreview(appwriteConfig.storageId, fileId,
                2000, 2000, 'top', 100)
        } else {
            throw new Error(error)
        }


        if (!fileURL) throw Error

        return fileURL

    } catch (error) {
        throw new Error(error)
    }

}


export const uploadFile = async (file, type) => {





    const asset = {
        name: file?.fileName,
        type: file?.mimeType,
        size: file?.filesize,
        uri: file?.uri

    };



    try {

        const uploadedFile = await storage.createFile(
            appwriteConfig.storageId,
            ID.unique(),
            asset
        );



        const fileURL = await getFilePreview(uploadedFile?.$id, type)


        return fileURL

    } catch (error) {
        throw new Error(error)
    }
}


// export const createVideo = async (form) => {

//     console.log(form);

//     try {

//         const [thumbnailUrl, videoUrl] = await Promise.all([
//             uploadFile(form.thumbanail, 'image'),
//             uploadFile(form.video, 'video')

//         ])


//         const newPost = await databases.createDocument(appwriteConfig.databaseId, appwriteConfig.videoCollectionId, ID.unique(), {
//             title: form.title,
//             thumbnail: thumbnailUrl,
//             prompt: form.prompt,

//             video: videoUrl,
//             creator: form.userId

//         }
//         )


//         return newPost

//     } catch (error) {
//         throw new Error(error)
//     }

// }

export const createVideo = async (form) => {
    try {
        const [thumbnailUrl, videoUrl] = await Promise.all([
            uploadFile(form.thumbanail, 'image'),
            uploadFile(form.video, 'video')
        ]);

        const newPost = await databases.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.videoCollectionId,
            ID.unique(),
            {
                title: form.title,
                thumbnail: thumbnailUrl,
                prompt: form.prompt,
                video: videoUrl,
                creator: form.userId,
                // Add any additional required fields here
                // For example: timestamp, category, etc.
            }
        );

        return newPost;
    } catch (error) {
        throw new Error(error);
    }
};
