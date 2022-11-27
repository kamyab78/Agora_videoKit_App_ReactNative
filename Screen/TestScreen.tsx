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

  const TestScreen = ( route : any) => {
  

useEffect(() => {
    console.log(route.route.params.signature);
}, []);




    return (
        <View style={{flex:1}}>
        <Text>
            New test
        </Text>
            </View>
    )
     
  };
  
  const styles = StyleSheet.create({
   
  });
  
  export default TestScreen;