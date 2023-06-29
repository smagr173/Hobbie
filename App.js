import 'react-native-gesture-handler';
import { DarkTheme, DefaultTheme, ThemeProvider, NavigationContainer } from '@react-navigation/native';
import { View, ActivityIndicator, useColorScheme } from 'react-native';

import { useFonts } from 'expo-font';
import FontAwesome from '@expo/vector-icons/FontAwesome';

import TabLayout from './navigation/TabLayout';
import { AuthNavigator } from './navigation/navigationStacks';

function SplashScreen() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <ActivityIndicator size="large" />
    </View>
  );
}

const getIsSignedIn = () => {
  return false;
};

function RootLayoutNav() {
  const colorScheme = useColorScheme();
  const isSignedIn = getIsSignedIn();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <NavigationContainer>
        {isSignedIn ? (
          <TabLayout />
        ) : (
          <AuthNavigator />
        )}
      </NavigationContainer>
    </ThemeProvider>
  );
}

export default function App() {
  const loaded = useFonts({
    SpaceMono: require('./assets/fonts/SpaceMono-Regular.ttf'),
    ...FontAwesome.font,
  });

  return (
    <>
      {!loaded && <SplashScreen />}
      {loaded && <RootLayoutNav />}
    </>
  );
}
