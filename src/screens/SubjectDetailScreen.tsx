// src/screens/SubjectDetailScreen.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import { RootStackParamList } from '../../App';
import api from '../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

type ClassItem = {
  id: number;
  code: string;
  date: string;
  start_time: string;
  end_time: string;
  location: string | null;
  status: string;
  registered_at: string | null;
};

type SubjectDetailRouteProp = RouteProp<RootStackParamList, 'SubjectDetail'>;

export default function SubjectDetailScreen() {
  const route = useRoute<SubjectDetailRouteProp>();
  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClasses = async () => {
      const token = await AsyncStorage.getItem('@token');
      try {
        const response = await api.get(`/subjects/${route.params.subjectId}/classes`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setClasses(response.data);
      } catch (error) {
        console.error('Erro ao buscar aulas', error);
      } finally {
        setLoading(false);
      }
    };

    fetchClasses();
  }, [route.params.subjectId]);

  if (loading) return <ActivityIndicator size="large" style={{ marginTop: 50 }} />;

  return (
    <View style={styles.container}>
      <FlatList
        data={classes}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.title}>{item.code} — {formatDate(item.date)}</Text>
            <Text style={styles.time}>{item.start_time} às {item.end_time}</Text>
            <Text style={styles.location}>Local: {item.location || 'Não informado'}</Text>
            <Text style={[styles.status, getStatusStyle(item.status)]}>Status: {item.status}</Text>
            {item.status !== 'Ausente' && item.registered_at ? (
              <Text style={styles.time}>Registrado às: {item.registered_at}</Text>
            ) : item.status === 'Ausente' ? (
              <Text style={styles.time}>Não registrado</Text>
            ) : null}
          </View>
        )}
      />
    </View>
  );
}

const formatDate = (date: string) => {
  const d = new Date(date);
  return d.toLocaleDateString();
};

const getStatusStyle = (status: string) => {
  switch (status) {
    case 'Presente': return { color: 'green' };
    case 'Ausente': return { color: 'red' };
    default: return { color: '#666' };
  }
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  card: { backgroundColor: '#f8f8f8', padding: 16, borderRadius: 8, marginBottom: 12 },
  title: { fontSize: 16, fontWeight: 'bold' },
  time: { fontSize: 14, color: '#555' },
  location: { fontSize: 14, color: '#555', marginBottom: 4 },
  status: { fontWeight: 'bold', marginTop: 4 },
});
