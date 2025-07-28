import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  Button,
  Modal,
  Pressable,
  TouchableWithoutFeedback,
} from 'react-native';
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
  const [modalVisible, setModalVisible] = useState(false);
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

  if (loading) return <ActivityIndicator size="large" style={{ marginTop: 50 }} />;

  return (
    <View style={styles.container}>
      <View style={styles.buttonContainer}>
        <Button title="Registrar Presença" onPress={() => setModalVisible(true)} />
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

      {/* Modal de presença */}
      <Modal
        visible={modalVisible}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback onPress={() => {}}>
              <View style={styles.modalContent}>
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={() => setModalVisible(false)}
                >
                  {/*<Text style={styles.closeButtonText}>✕</Text>*/}
                </TouchableOpacity>

                <Text style={styles.modalTitle}>Como deseja registrar a presença?</Text>

                <Pressable
                  style={styles.modalButton}
                  onPress={() => {
                    setModalVisible(false);
                    /*navigation.navigate('QRCodeScanner');*/
                  }}
                >
                  <Text style={styles.modalButtonText}>Ler QR Code</Text>
                </Pressable>

                <Pressable
                  style={styles.modalButton}
                  onPress={() => {
                    setModalVisible(false);
                    navigation.navigate('ManualCodeEntry');
                  }}
                >
                  <Text style={styles.modalButtonText}>Digitar Código</Text>
                </Pressable>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  buttonContainer: { marginBottom: 20 },
  item: {
    padding: 16,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    marginBottom: 12,
  },
  subjectName: { fontSize: 16, fontWeight: 'bold' },
  subtitle: { fontSize: 14, color: '#666' },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    width: '80%',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    position: 'relative',
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    padding: 8,
    zIndex: 1,
  },
  closeButtonText: {
    fontSize: 20,
    color: '#333',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  modalButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    backgroundColor: '#007bff',
    borderRadius: 8,
    marginTop: 10,
    width: '100%',
    alignItems: 'center',
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});
