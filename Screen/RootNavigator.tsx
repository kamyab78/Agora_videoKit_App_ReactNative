import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen from './HomeScreen';
import { ActivityIndicator } from 'react-native';

  const linking = {
    prefixes: ['gerehverseapp://'],
    config: {
      screens: {
        Home:{
            path: 'home/:username/:password/:channelname',
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
        <RootStack.Screen  options={{headerShown: false}} name="Home" component={HomeScreen} />
      </RootStack.Navigator>
    </NavigationContainer>
  );
};

export default RootNavigator;