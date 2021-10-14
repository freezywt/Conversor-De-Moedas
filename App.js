import { StatusBar } from 'expo-status-bar';
import React,{ useEffect, useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ActivityIndicator, Keyboard } from 'react-native';

import Picker from './src/components/Picker';
import api from './src/services/api';

export default function App() {

  const [ moedas, setMoedas ] = useState([]);
  const [ loading, setLoading ] = useState(true);

  const [ moedaSelecionada, setMoedaSelecionada ] = useState(null);
  const [ moedaBValor, setMoedaBValor ] = useState(0);

  const [ valorMoeda, setValorMoeda ] = useState(null);
  const [ valorConvertido , setValorConvertido ] = useState(0);

  useEffect(() => {
    async function loadingMoedas(){
      const response = await api.get('all');
      
      let arrayMoedas = []
      Object.keys(response.data).map((key) => {
        arrayMoedas.push({
          key: key,
          label: key,
          value: key
        })
      })
      setMoedas(arrayMoedas);
      setLoading(false);
    }

    loadingMoedas();
  }, []);

  async function converter() {
    if(moedaSelecionada === null || moedaBValor === 0){
      alert('Você precisa selecionar uma moeda e digitar um valor!');
      return;
    }else{
      const response = await api.get(`all/${moedaSelecionada}-BRL`);

      let resultado = ( response.data[moedaSelecionada].ask * parseFloat(moedaBValor) );
      setValorConvertido(`R$ ${resultado.toFixed(2)}`);
      setValorMoeda(moedaBValor);
      
      Keyboard.dismiss();
    }
  }

  if(loading){
    return(
      <View style={{justifyContent: 'center', alignItems:'center', flex: 1}}>
        <ActivityIndicator color="#fff" size={45}/>
        <StatusBar style="dark" />
      </View>
    )
  }else{
    return (
      <View style={styles.container}>
        <View style={styles.areaMoeda}>
          <Text style={styles.titulo}>Selecione sua moeda</Text>
          <Picker moedas={moedas} onChange={ (moeda) => setMoedaSelecionada(moeda)}/>
          <StatusBar style="dark" />
        </View>
  
        <View style={styles.areaValor}>
           <Text style={styles.titulo}>Digite um valor para conventer em (R$)</Text>
           <TextInput 
              placeholder="Ex : 150"
              style={styles.input}
              keyboardType="numeric"
              onChangeText={ (valor) => setMoedaBValor(valor) }
           />
          <StatusBar style="dark" />
        </View>
  
        <TouchableOpacity style={styles.botaoArea} onPress={converter}>
            <Text style={styles.botaoTexto}>Conveter</Text>
        </TouchableOpacity>
  
         {valorConvertido !== 0 && (
          <View style={styles.areaResultado}>
            <Text style={styles.valorConvertido}>{valorMoeda} {moedaSelecionada}</Text>
            <Text style={[styles.valorConvertido, { fontSize: 18, margin: 10}]}>Corresponde a</Text>
            <Text style={styles.valorConvertido}>{valorConvertido}</Text>
          </View>
         )}
        <StatusBar style="dark" />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#F0F0F0',
    paddingTop: 60
  },
  areaMoeda: {
    width: '90%',
    backgroundColor: '#f9f9f9',
    elevation: 3,
    padding: 10,
    margin: 5,
    borderRadius: 9,
    marginBottom: 1,
  },
  titulo: {
    fontSize: 15,
    color: '#000',
    paddingTop: 5,
    paddingLeft: 5,
  },
  areaValor: {
    width: '90%',
    marginTop: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 9,
    elevation: 3,
    paddingBottom: 9,
    paddingTop: 9,
  },
  input: {
    width: '100%',
    padding: 10,
    height: 45,
    fontSize: 20,
    marginTop: 8,
    color: '#000'
  },
  botaoArea: {
    width: '90%',
    backgroundColor: '#3298E6',
    elevation: 3,
    height: 45,
    marginTop: 10,
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center'
  },
  botaoTexto: {
    fontSize: 17,
    color: '#fff',
    fontWeight: 'bold'
  },
  areaResultado: {
    width: '90%',
    backgroundColor: '#fff',
    marginTop: 35,
    elevation: 2,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 25,
    borderRadius: 9
  },
  valorConvertido: {
    fontSize: 39,
    fontWeight: 'bold',
    color: '#000'
  }
});
