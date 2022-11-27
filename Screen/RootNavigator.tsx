import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen from './HomeScreen';
import { ActivityIndicator } from 'react-native';
import GerehScreen from './GerehScreen';
import TestScreen from './TestScreen';

  const linking = {
    prefixes: ['gerehverseapp://'],
    config: {
      screens: {
        Gereh : {
          path:'gereh/:signature/',
      },
      // Main : {
      //   path:'main/',
      // },
        Home:{
            path: 'home/:username/:password/:channelname/:signature/:Id/',
        }
      }
    }
  };
const RootStack = createNativeStackNavigator();

const RootNavigator = () => {
  return (
    <NavigationContainer
    linking={linking}
    fallback={<ActivityIndicator color="blue" size="large" />}>
      <RootStack.Navigator>
        <RootStack.Screen  options={{headerShown: false}} name="Gereh" component={GerehScreen} />
        {/* <RootStack.Screen  options={{headerShown: false}} name="Main" component={TestScreen} /> */}
        <RootStack.Screen  options={{headerShown: false}} name="Home" component={HomeScreen} />
      </RootStack.Navigator>
    </NavigationContainer>
  );
};

export default RootNavigator;