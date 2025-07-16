import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, StyleSheet, Button } from 'react-native';
import api from '../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';

type Subject = {
  id: number;
  name: string;
  classrooms_count: number;
};

export default function SubjectListScreen() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  useEffect(() => {
    const loadSubjects = async () => {
      const token = await AsyncStorage.getItem('@token');
      try {
        const response = await api.get('/subjects', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSubjects(response.data);
      } catch (error) {
        console.error('Erro ao buscar matérias', error);
      } finally {
        setLoading(false);
      }
    };

    loadSubjects();
  }, []);

  /*const handleQRCode = () => {
    // Redirecionar para tela de leitura do QRCode
    navigation.navigate('QRCodeReader');
  };*/

  if (loading) return <ActivityIndicator size="large" style={{ marginTop: 50 }} />;

  return (
    <View style={styles.container}>
      <View style={styles.buttonContainer}>
        <Button title="Ler QRCode" /*onPress={handleQRCode}*/ />
      </View>

      <FlatList
        data={subjects}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.item}
            onPress={() =>
              navigation.navigate('SubjectDetail', {
                subjectId: item.id,
                subjectName: item.name,
              })
            }
          >
            <Text style={styles.subjectName}>{item.name}</Text>
            <Text style={styles.subtitle}>{item.classrooms_count} aulas</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 16, textAlign: 'center' },
  buttonContainer: { marginBottom: 20 },
  item: {
    padding: 16,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    marginBottom: 12,
  },
  subjectName: { fontSize: 16, fontWeight: 'bold' },
  subtitle: { fontSize: 14, color: '#666' },
});