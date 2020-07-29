import {Platform} from 'react-native'
import RNFS from 'react-native-fs'

/**
 * Get the path of static web for Android and ios
 */
export const getPath = () => {
    return Platform.OS === 'android'
        ? `${RNFS.DocumentDirectoryPath}/www`
        : `${RNFS.MainBundlePath}/www`
}


const _extensions = ['.html', '.png', '.jpg', '.css', '.js', '.svg']
/**
 * Check path is file or not, due to RNFS.isFile() not working
 * @param fileName path to check
 * @param moreExtension additional file extension to detect
 */
const isFile = (fileName: string, moreExtension?: string[]) => {
    const extensions = moreExtension
        ? {..._extensions, ...moreExtension}
        : _extensions
    for (const ex of extensions) {
        if (fileName.includes(ex)) {
            return true
        }
    }
    return false
}

/**
 * Copy initial assets files to android recursively
 * @param source source of assets files
 * @param destination destination of assets files
 */
export const copyRecursive = async (source: string, destination: string) => {
    console.log(`SRC: ${source} => ${destination}`)
    const items = await RNFS.readDirAssets(source)

    console.log(`mkdir: ${destination}/`)
    await RNFS.mkdir(destination)

    console.log('-------------------------------------')

    for (const item of items) {
        const itemPath = item.path.replace('//', '/')
        /** [บ่น] item.isFile() แม่งเป็น false ตลอด
         * แถม item.isDirectory() เสือกเป็น true ตลอดอีก
         * สรุปเขียนเองก็ได้วะ
         * */
        if (isFile(item.name)) {
            console.log(`f ${itemPath}`)
            const destPath = RNFS.DocumentDirectoryPath + '/' + source + '/' + item.name
            console.log(`cp ${itemPath} ${destPath}`)
            await RNFS.copyFileAssets(itemPath, destPath)
        } else {
            console.log(`d ${itemPath}/`)
            const subDirectory = source + '/' + item.name
            const subDestination = destination + '/' + item.name
            await copyRecursive(subDirectory, subDestination)
        }
    }
}

/**
 * Move assets file to www in Android
 */
export const moveAndroidFiles = async () => {
    if (Platform.OS === 'android') {
        const path = getPath()
        await RNFS.mkdir(path)
        await copyRecursive('www', path)
    }
}
