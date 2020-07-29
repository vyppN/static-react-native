/**
 ใสไว้่กัน BUG ใสไว้่กัน BUG ใสไว้่กัน BUG ใสไว้่กัน BUG ใสไว้่กัน BUG ใสไว้่กัน BUG
                              _
                           _ooOoo_                  Repo
                          o8888888o                 นี้ดี
                          88" . "88                 อยู่แล้ว
                          (| -_- |)                 ไม่พัง
                          O\  =  /O
                       ____/`---'\____
                     .'  \\|     |//  `.
                    /  \\|||  :  |||//  \
                   /  _||||| -:- |||||_  \
                   |   | \\\  -  /'| |   |
                   | \_|  `\`---'//  |_/ |
                   \  .-\__ `-. -'__/-.  /
                 ___`. .'  /--.--\  `. .'___
              ."" '<  `.___\_<|>_/___.' _> \"".
             | | :  `- \`. ;`. _/; .'/ /  .' ; |
             \  \ `-.   \_\_`. _.'_/_/  -' _.' /
   ===========`-.`___`-.__\ \___  /__.-'_.'_.-'================
                           `=--=-'
 ใสไว้่กัน BUG ใสไว้่กัน BUG ใสไว้่กัน BUG ใสไว้่กัน BUG ใสไว้่กัน BUG ใสไว้่กัน BUG
*/

import React, {useState, FC, useEffect} from 'react'
import {SafeAreaView, Text,} from 'react-native'
import StaticServer from 'react-native-static-server'
import WebView from 'react-native-webview'
import {subscribe} from 'react-native-zip-archive'
import {fetchAssets} from './src/fetch-assets'
import {moveAndroidFiles, getPath} from './src/file-system'


const ZIP_1 = 'https://drive.google.com/uc?export=download&id=1O3sfKRgvk0MDmqPT2m8eSu3jkOpWbv3p'
const ZIP_2 = 'https://drive.google.com/uc?export=download&id=1wK0M56DPMgqcKjEuLb_Y1xtqjnonCLwu'

const App: FC = () => {
    // .zip file url to load from a host
    const loadedZipFile = ZIP_1
    // url of the server
    const [url, setUrl] = useState<string | null>(null)

    useEffect(() => {
        let server: any = null
        // listener for zip progress (must have or warning)
        const zipProgress = subscribe(({progress}) => {
            console.log(`Progress: ${progress}`)
        })

        // async init the app
        const init = async () => {
            // move assets to www/ in Android
            await moveAndroidFiles()
            // fetch static web zip file from host
            await fetchAssets(loadedZipFile)

            // Random port within 3000-3999 (use 0 for any port): If port not random, the page not reloaded
            const port = '3' + Math.round(Math.random() * 1000)
            server = new StaticServer(port, getPath(), {
                localOnly: true,
                keepAlive: true,
            })

            server.start()
                .then(setUrl)
                .catch(console.log)

        }

        init().then(null)

        return () => {
            if (server && server.isRunning()) {
                server.stop()
            }

            zipProgress.remove()
        }
    }, [])

    if (!url) {
        return (
            <SafeAreaView>
                <Text>Loading....</Text>
            </SafeAreaView>
        )
    }

    return (
        <>
            <SafeAreaView style={{flex: 1}}>
                <WebView
                    style={{flex: 1}}
                    source={{uri: url}}
                />
            </SafeAreaView>
        </>
    )
}


export default App
