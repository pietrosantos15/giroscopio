import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Dimensions } from 'react-native';
import { Accelerometer } from 'expo-sensors';
import { Audio } from 'expo-av';

// Corrigido: import relativo do som
import collectSound from '../assets/sounds/som.mp4';

const { width, height } = Dimensions.get('window');
const PLAYER_SIZE = 50;
const ORB_SIZE = 30;

const generateRandomPosition = () => {
  return {
    x: Math.random() * (width - ORB_SIZE),
    y: Math.random() * (height - ORB_SIZE),
  };
};

export interface OrbFlutuanteProps {
  gameActive: boolean;
  onCollect: () => void;
  resetTrigger: number;
  isHardMode: boolean;
}

export default function OrbFlutuanteGame({
  gameActive,
  onCollect,
  resetTrigger,
  isHardMode,
}: OrbFlutuanteProps) {
  const [data, setData] = useState({ x: 0, y: 0, z: 0 });
  const [playerPosition, setPlayerPosition] = useState({
    x: width / 2,
    y: height / 2,
  });
  const [orbPosition, setOrbPosition] = useState(generateRandomPosition());
  const [soundObject, setSoundObject] = useState<Audio.Sound | null>(null);

  // 1. Carrega e descarrega o som
  useEffect(() => {
    let isCancelled = false;

    async function loadSound() {
      try {
        const { sound } = await Audio.Sound.createAsync(collectSound);
        if (!isCancelled) {
          setSoundObject(sound);
        }
      } catch (error) {
        console.warn('Falha ao carregar o som de coleta', error);
      }
    }

    loadSound();

    return () => {
      isCancelled = true;
      if (soundObject) {
        soundObject.unloadAsync();
      }
    };
  }, []);

  // 2. Função para tocar o som
  const playCollectSound = async () => {
    if (soundObject) {
      try {
        await soundObject.setPositionAsync(0);
        await soundObject.playFromPositionAsync(0);
      } catch (error) {
        console.warn('Erro ao tocar o som', error);
      }
    }
  };

  // Resetar jogo quando resetTrigger mudar
  useEffect(() => {
    setPlayerPosition({ x: width / 2, y: height / 2 });
    setOrbPosition(generateRandomPosition());
  }, [resetTrigger]);

  // Mover o orbe a cada 3s no modo difícil
  useEffect(() => {
    if (!gameActive || !isHardMode) return;

    const intervalId = setInterval(() => {
      setOrbPosition(generateRandomPosition());
    }, 2000);

    return () => clearInterval(intervalId);
  }, [gameActive, isHardMode]);

  // Listener do acelerômetro
  useEffect(() => {
    if (!gameActive) {
      Accelerometer.setUpdateInterval(0);
      return;
    }

    Accelerometer.setUpdateInterval(16);

    const subscription = Accelerometer.addListener(accelerometerData => {
      setData(accelerometerData);
    });

    return () => {
      subscription.remove();
      Accelerometer.setUpdateInterval(0);
    };
  }, [gameActive]);

  // Movimento do jogador
  useEffect(() => {
    if (!gameActive) return;

    let newX = playerPosition.x + data.x * -15;
    const sensitivityY = data.y < 0 ? 35 : 15;
    let newY = playerPosition.y + data.y * sensitivityY;

    if (newX < 0) newX = 0;
    if (newX > width - PLAYER_SIZE) newX = width - PLAYER_SIZE;
    if (newY < 0) newY = 0;
    if (newY > height - PLAYER_SIZE) newY = height - PLAYER_SIZE;

    setPlayerPosition({ x: newX, y: newY });
  }, [data, gameActive]);

  // Colisão com o orbe
  useEffect(() => {
    if (!gameActive) return;

    const playerCenterX = playerPosition.x + PLAYER_SIZE / 2;
    const playerCenterY = playerPosition.y + PLAYER_SIZE / 2;
    const orbCenterX = orbPosition.x + ORB_SIZE / 2;
    const orbCenterY = orbPosition.y + ORB_SIZE / 2;

    const dx = playerCenterX - orbCenterX;
    const dy = playerCenterY - orbCenterY;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < PLAYER_SIZE  - ORB_SIZE ) {
      setOrbPosition(generateRandomPosition());
      onCollect();
      playCollectSound();
    }
  }, [playerPosition, gameActive]);

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.orb,
          { left: orbPosition.x, top: orbPosition.y },
        ]}
      />
      <View
        style={[
          styles.player,
          { left: playerPosition.x, top: playerPosition.y },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  player: {
    position: 'absolute',
    width: PLAYER_SIZE,
    height: PLAYER_SIZE,
    borderRadius: PLAYER_SIZE / 2,
    backgroundColor: '#FFD700',
    borderWidth: 2,
    borderColor: '#fff',
  },
  orb: {
    position: 'absolute',
    width: ORB_SIZE,
    height: ORB_SIZE + 5,
    borderTopLeftRadius: ORB_SIZE / 2,
    borderTopRightRadius: ORB_SIZE / 2,
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 5,
    backgroundColor: '#FFB852',
    borderWidth: 2,
    borderColor: '#fff',
  },
});
