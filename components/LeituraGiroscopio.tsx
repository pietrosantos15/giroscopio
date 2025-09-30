
import React, { useEffect, useState } from 'react';

import { StyleSheet, Text, View } from 'react-native';

import { Gyroscope } from 'expo-sensors';


export default function App() {
  
  
  
  const [data, setData] = useState({ x: 0, y: 0, z: 0 });


  useEffect(() => {
    Gyroscope.setUpdateInterval(300);

    const subscription = Gyroscope.addListener(gyroscopeData => {
      setData(gyroscopeData);
    });

    return () => {
      
      subscription.remove();
    };

    

  }, []); 


  

  
  const { x, y, z } = data;

  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Leitura do Giroscópio</Text>
      <Text style={styles.text}>x: {Number(x.toFixed(1)) === -0 ? 0 : x.toFixed(1)}</Text>
      <Text style={styles.text}>y: {Number(y.toFixed(1)) == -0 ? 0 : y.toFixed(1)}</Text>
      <Text style={styles.text}>z: {Number(z.toFixed(1)) == -0? 0 : z.toFixed(1)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#2c3e50',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ecf0f1',
    marginBottom: 20,
  },
  text: {
    fontSize: 20,
    color: '#ecf0f1',
    marginTop: 10,
  },
});