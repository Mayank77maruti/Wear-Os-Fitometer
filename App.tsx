import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Home from './pages/Home/page';
import ReportScreen from './components/reportscreen';
import OnboardingScreen from './components/onboarding';

export type RootStackParamList = {
  Home: undefined;
  Report: { imageUri: string };
  OnboardingScreen: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="OnboardingScreen" component={OnboardingScreen} />
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="Report" component={ReportScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

