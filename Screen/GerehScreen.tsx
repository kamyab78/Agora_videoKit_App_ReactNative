/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

 import React, {
    useRef,
    useState,
    useEffect,
    PropsWithChildren,
    createRef,
  } from 'react';
  import {
    StyleSheet,
    View,
    TouchableOpacity
   
  } from 'react-native';
import { Text } from 'react-native-paper';
import WebView from 'react-native-webview';
// import { useNavigation } from '@react-navigation/native';
import {Config} from '../Config/Hostaddress';

  const GerehScreen = ( route : any) => {
    const webviewRef = useRef(null);
    const INJECTED_JAVASCRIPT = `window.isRNWebView=true`;
    const [signature, setSignature] = useState('test');
    // const navigation = useNavigation();



  
const handleMessage = (receivedMessage: any) => {
let handleReceivedMessage = JSON.parse(receivedMessage?.nativeEvent?.data);
if(handleReceivedMessage?.type === 'verse-signature'){
    let signature = handleReceivedMessage?.payload.signature;
    let jwt = handleReceivedMessage?.payload.jwt;
    route.navigation.push('Home' , {
        signature: signature,
        jwt: jwt
    });
}
}


    return (
        <View style={{flex:1}}>
            {/* <View>
                <TouchableOpacity style={{width:100,height:100,marginLeft:40,marginTop:40}} onPress={() => {
                    route.navigation.navigate('Home' ,{
                        signature: "test for signature"
                    });
                }}>
                <Text style={{color:'red'}}>
                    Gereh
                </Text>
                </TouchableOpacity>
            </View> */}
            <WebView
            ref={webviewRef}
            javaScriptEnabledAndroid={true}
            injectedJavaScript={INJECTED_JAVASCRIPT}
            originWhitelist={['*']}
            source={{uri: Config()['gerehUrl']}}
            onMessage={handleMessage}
            />

            </View>
    )
     
  };
  
  const styles = StyleSheet.create({
   
  });
  
  export default GerehScreen;
  