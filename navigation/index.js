import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import store from '../reducer/loginStore';

import BottomTabNavigator from './BottomTabNavigator';

import InitialScreen from '../screens/InitialScreen';
import RegisterScreen from '../screens/RegisterScreen';

const Stack = createStackNavigator();

function AuthNavigator() {
  return (
    <Stack.Navigator initialRouteName="Initial">
      <Stack.Screen name="Initial" component={InitialScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Register" component={RegisterScreen} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
}

function TabNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Root" component={BottomTabNavigator} />
    </Stack.Navigator>
  );
}

export default class Navigation extends React.Component {
  constructor(props) {
    super(props);
      store.subscribe(() => {
        this.setState(store.getState());
    });
  }
  
  render() {
    if (store.getState().loginSuccess) {
      return (
        <NavigationContainer>
          <TabNavigator />
        </NavigationContainer>
      );
    }
    else return (
      <NavigationContainer>
        <AuthNavigator />
      </NavigationContainer>
    );
  }
}
