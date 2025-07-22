import React, { useState } from 'react';
import { View, Text, Button, Alert, ActivityIndicator, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../services/api';
import { useNavigation } from '@react-navigation/native';

export default function QRCodeReaderScreen() {
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  const pickImageAndScanQRCode = async () => {
    setLoading(true);

    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    if (permissionResult.status !== 'granted') {
      Alert.alert('Permissão necessária', 'Permissão para usar a câmera foi negada.');
      setLoading(false);
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      base64: true,
      quality: 0.8,
    });

    if (!result.assets || result.assets.length === 0) {
      setLoading(false);
      return;
    }

    try {
      const image = result.assets[0];
      if (!image.base64) throw new Error('Não foi possível obter imagem base64');

      const token = await AsyncStorage.getItem('@token');
      const response = await api.post(
        '/read-qr-from-image',
        { image_base64: image.base64 },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const qrCodeData = response.data.code;
      if (!qrCodeData) throw new Error('QR code não encontrado na imagem');

      await api.post(
        '/register-presence',
        { password: qrCodeData },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      Alert.alert('Sucesso', 'Presença registrada com sucesso!');
      navigation.goBack();
    } catch (error) {
      console.error(error);
      Alert.alert('Erro', 'Não foi possível ler o QR Code ou registrar a presença.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Button title="Abrir câmera e ler QR Code" onPress={pickImageAndScanQRCode} />
      {loading && <ActivityIndicator style={{ marginTop: 20 }} size="large" />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20 },
});
