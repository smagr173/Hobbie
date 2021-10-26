import * as React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { FontAwesome, Foundation, FontAwesome5, MaterialIcons } from '@expo/vector-icons';

import Colors from '../constants/Colors';
import useColorScheme from '../hooks/useColorScheme';

import SocialFeed from '../screens/SocialFeed';
import HomeScreen from '../screens/HomeScreen';
import DiscoverScreen from '../screens/DiscoverScreen';
import MapScreen from '../screens/MapScreen';

const BottomTab = createBottomTabNavigator();

export default function BottomTabNavigator() {
  const colorScheme = useColorScheme();

  return (
    <BottomTab.Navigator
      initialRouteName="SocialFeed"
      tabBarOptions={{ activeTintColor: Colors[colorScheme].tint, inactiveTintColor: Colors[colorScheme].tabIconDefault }}>
      <BottomTab.Screen
        name="Home"
        component={SocialNavigator}
        options={{ tabBarIcon: <MaterialIcons name="home" size={36} color={'red'} /> }}
      />
      <BottomTab.Screen
        name="Discover"
        component={DiscoverNavigator}
        options={{ tabBarIcon: <Foundation name="magnifying-glass" size={32} color={'red'} /> }}
      />
      <BottomTab.Screen
        name="Marketplace"
        component={MapNavigator}
        options={{ tabBarIcon: <FontAwesome name="map-marker" size={31} color={'red'} /> }}
      />
      <BottomTab.Screen
        name="My Hobbie"
        component={HomeNavigator}
        options={{ tabBarIcon: <FontAwesome5 name="user-alt" size={24} color={'red'} /> }}
      />
    </BottomTab.Navigator>
  );
}

const SocialStack = createStackNavigator();

function SocialNavigator() {
  return (
    <SocialStack.Navigator>
      <SocialStack.Screen
        name="SocialFeed"
        component={SocialFeed}
        options={{ headerShown: false }} />
    </SocialStack.Navigator>
  );
}

const DiscoverStack = createStackNavigator();

function DiscoverNavigator() {
  return (
    <DiscoverStack.Navigator>
      <DiscoverStack.Screen
        name="DiscoverScreen"
        component={DiscoverScreen}
        options={{ headerShown: false }} />
    </DiscoverStack.Navigator>
  );
}

const MapStack = createStackNavigator();

function MapNavigator() {
  return (
    <MapStack.Navigator>
      <MapStack.Screen
        name="MapScreen"
        component={MapScreen}
        options={{ headerShown: false }} />
    </MapStack.Navigator>
  );
}

const HomeStack = createStackNavigator();

function HomeNavigator() {
  return (
    <HomeStack.Navigator>
      <HomeStack.Screen
        name="HomeScreen"
        component={HomeScreen}
        options={{ headerShown: false }} />
    </HomeStack.Navigator>
  );
}
