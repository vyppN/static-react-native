import {Platform} from 'react-native'
import * as RNFS from 'react-native-fs'
import {unzip} from 'react-native-zip-archive'
import RNFetchBlob from 'rn-fetch-blob'
import {getPath} from './file-system'

/**
 * Load static web zip file from URL and unzip into www/
 * @param url url of zip file
 */
const loadZipFile = (url: string) => {
    // use promise to prevent Require cycle warning
    return new Promise((resolve => {
        RNFetchBlob.config({
            fileCache: true
        }).fetch('GET', url)
            .then(async res => {
                const file = res.path()
                unzip(file, getPath()).then(unzipPath => {
                    res.flush()
                    resolve(unzipPath)
                }).catch(console.log)
            })
    }))
}

/**
 * Fetch the assets from url
 * @param url url of zip file
 */
export const fetchAssets = async (url: string) => {
    const path = getPath()
        console.log('Clear assets: ', await RNFS.readdir(path))
        await loadZipFile(url)
        console.log('Copied assets: ', await RNFS.readdir(path))
}
