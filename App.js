import axios from 'axios';
import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  Touchable,
  TouchableOpacity,
  View,
} from 'react-native';

export default function App() {
  const [dataPacientes, setDataPacientes] = React.useState('');
  const [dataVisitas, setDataVisitas] = React.useState('');
  const [openModal, setOpenModal] = React.useState(false);
  const [id, setId] = React.useState('');
  const [data, setData] = React.useState('');
  const [hora, setHora] = React.useState('');
  const [estado, setEstado] = React.useState('');
  const [recomendacao, setRecomendacao] = React.useState('');

  const handleShowPacientes = () => {
    axios
      .get('http://10.0.2.2:3000/pacientes')
      .then((response) => setDataPacientes(response.data));
  };
  const handleShowVisitas = () => {
    axios
      .get('http://10.0.2.2:3000/visitas?_sort=id&_order=desc')
      .then((response) => setDataVisitas(response.data));
  };

  const handleModal = (id) => {
    setId(id);
    setOpenModal(!openModal);
  };

  const addVisitas = () => {
    axios
      .post('http://10.0.2.2:3000/visitas', {
        id_paciente: id,
        data: data,
        hora: hora,
        estado_saude: estado,
        recomendacao: recomendacao,
      })
      .then((response) => setDataVisitas([...dataVisitas, response.data]));
    setHora('');
    setData('');
    setEstado('');
    setRecomendacao('');
    setId('');
    setOpenModal(false);
  };

  React.useEffect(() => {
    handleShowPacientes();
  }, []);
  React.useEffect(() => {
    handleShowVisitas();
  }, []);

  if (!dataPacientes && !dataVisitas) return null;
  return (
    <ScrollView>
      <View style={{ padding: 50 }}>
        <Text style={styles.textLogo}>Hospital Santa Casa</Text>
        <View>
          {dataPacientes &&
            dataPacientes.map((paciente) => (
              <TouchableOpacity onPress={() => handleModal(paciente.id)}>
                <View key={paciente.id} style={styles.containerPaciente}>
                  <Text style={styles.textPaciente}>Nome: {paciente.nome}</Text>
                  <Text style={styles.textPaciente}>
                    Quarto: {paciente.quarto}
                  </Text>
                  <Text style={styles.textPaciente}>
                    Problema: {paciente.problema_medico}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
        </View>
        {openModal && (
          <View>
            <Text style={styles.textLogo}>Cadastro de Visita</Text>
            <View>
              <Text>Data</Text>
              <TextInput
                style={styles.containerInput}
                value={data}
                onChangeText={(text) => setData(text)}
              />
            </View>
            <View>
              <Text>Hora</Text>
              <TextInput
                style={styles.containerInput}
                value={hora}
                onChangeText={(text) => setHora(text)}
              />
            </View>
            <View>
              <Text>Estado</Text>
              <TextInput
                style={styles.containerInput}
                value={estado}
                onChangeText={(text) => setEstado(text)}
              />
            </View>
            <View>
              <Text>Recomendação</Text>
              <TextInput
                style={styles.containerInput}
                value={recomendacao}
                onChangeText={(text) => setRecomendacao(text)}
              />
            </View>
            <TouchableOpacity
              onPress={addVisitas}
              style={styles.containerInput}
            >
              <Text>Adicionar Visita</Text>
            </TouchableOpacity>
          </View>
        )}
        <Text style={styles.textLogo}>Visitas</Text>
        <View>
          {dataVisitas &&
            dataVisitas.map((visita) => (
              <View key={visita.id} style={styles.containerPaciente}>
                <Text style={styles.textPaciente}>Data: {visita.data}</Text>
                <Text style={styles.textPaciente}>Hora: {visita.hora}</Text>
                <Text style={styles.textPaciente}>
                  Estado de Saude: {visita.estado_saude}
                </Text>
                <Text style={styles.textPaciente}>
                  Recomendação: {visita.recomendacao}
                </Text>
              </View>
            ))}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    marginBottom: 50,
    backgroundColor: '#FFF',
  },
  containerPaciente: {
    padding: 5,
    margin: 10,
    borderRadius: 5,
    backgroundColor: 'green',
  },
  textLogo: {
    fontSize: 30,
    paddingBottom: 10,
    alignSelf: 'center',
    color: 'green',
  },
  textPaciente: {
    fontSize: 16,
    padding: 5,
    color: '#FFF',
  },
  containerInput: {
    borderRadius: 5,
    backgroundColor: '#ccc',
    marginBottom: 10,
  },
});
