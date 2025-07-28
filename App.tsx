import React from 'react';
import { Button, Alert, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import AsyncStorage from '@react-native-async-storage/async-storage';

import LoginScreen from './src/screens/LoginScreen';
import SubjectListScreen from './src/screens/SubjectListScreen';
import SubjectDetailScreen from './src/screens/SubjectDetailScreen';
import ManualCodeEntryScreen from './src/screens/ManualCodeEntryScreen';

// Tipos das rotas
export type RootStackParamList = {
  Login: undefined;
  Subjects: undefined;
  SubjectDetail: { subjectId: number; subjectName: string };
  ManualCodeEntry: undefined;
  // QRCodeScanner: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} />

        <Stack.Screen
          name="Subjects"
          component={SubjectListScreen}
          options={({ navigation }) => ({
            title: 'Minhas Disciplinas',
            headerRight: () => (
              <View style={{ marginRight: 8 }}>
                <Button
                  title="Sair"
                  onPress={async () => {
                    Alert.alert(
                      'Confirmação',
                      'Deseja realmente sair?',
                      [
                        { text: 'Cancelar', style: 'cancel' },
                        {
                          text: 'Sair',
                          style: 'destructive',
                          onPress: async () => {
                            await AsyncStorage.removeItem('@token');
                            navigation.replace('Login');
                          },
                        },
                      ],
                      { cancelable: true }
                    );
                  }}
                  color="#ff3b30"
                />
              </View>
            ),
          })}
        />

        <Stack.Screen
          name="SubjectDetail"
          component={SubjectDetailScreen}
          options={({ route }) => ({ title: route.params.subjectName })}
        />

        <Stack.Screen
          name="ManualCodeEntry"
          component={ManualCodeEntryScreen}
          options={{ title: 'Registro Manual' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
