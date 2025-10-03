import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Dimensions } from 'react-native';
import { Accelerometer } from 'expo-sensors';

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

export default function OrbFlutuanteGame({ gameActive, onCollect, resetTrigger, isHardMode }: OrbFlutuanteProps) {
  const [data, setData] = useState({ x: 0, y: 0, z: 0 });
  const [playerPosition, setPlayerPosition] = useState({
    x: width / 2,
    y: height / 2,
  });
  const [orbPosition, setOrbPosition] = useState(generateRandomPosition());
  // Removido o estado local de score, agora gerenciado pelo componente pai

  // Efeito para resetar o jogo (forçado pelo pai)
  useEffect(() => {
      setPlayerPosition({ x: width / 2, y: height / 2 });
      setOrbPosition(generateRandomPosition());
  }, [resetTrigger]);

  // Efeito para mover o orbe a cada 3 segundos (Modo Difícil)
  useEffect(() => {
    // SÓ ATIVA o movimento se o jogo estiver ativo E for o MODO DIFÍCIL
    if (!gameActive || !isHardMode) return;

    const intervalId = setInterval(() => {
      setOrbPosition(generateRandomPosition());
    }, 2000); // 3000ms = 3 segundos

    return () => clearInterval(intervalId);
  }, [gameActive, isHardMode]);

  // Listener do acelerômetro
  useEffect(() => {
    // Pausa ou desativa o listener se o jogo não estiver ativo
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
        Accelerometer.setUpdateInterval(0); // Limpa o listener ao desmontar ou pausar
    };
  }, [gameActive]);

  // Movimento do jogador
  useEffect(() => {
    if (!gameActive) return; // Pausa o movimento se o jogo não estiver ativo

    // Horizontal: Ajustado para 15 para melhor controle lateral.
    let newX = playerPosition.x + data.x * -15; 
    
    // Compensação de Gravidade: Multiplicador maior (35) para 'subida' (data.y negativo) e menor (15) para 'descida' (data.y positivo).
    const sensitivityY = data.y < 0 ? 35 : 15; 
    let newY = playerPosition.y + data.y * sensitivityY;  // inclinação frente/trás

    // Limites da tela
    if (newX < 0) newX = 0;
    if (newX > width - PLAYER_SIZE) newX = width - PLAYER_SIZE;
    if (newY < 0) newY = 0;
    if (newY > height - PLAYER_SIZE) newY = height - PLAYER_SIZE;

    setPlayerPosition({ x: newX, y: newY });
  }, [data, gameActive]);

  // Colisão com o orbe
  useEffect(() => {
    if (!gameActive) return; // Pausa a colisão se o jogo não estiver ativo

    const playerCenterX = playerPosition.x + PLAYER_SIZE / 2;
    const playerCenterY = playerPosition.y + PLAYER_SIZE / 2;
    const orbCenterX = orbPosition.x + ORB_SIZE / 2;
    const orbCenterY = orbPosition.y + ORB_SIZE / 2;

    const dx = playerCenterX - orbCenterX;
    const dy = playerCenterY - orbCenterY;
    const distance = Math.sqrt(dx * dx + dy * dy);

    // Colisão por cobertura total
    if (distance < PLAYER_SIZE  - ORB_SIZE ) {
      setOrbPosition(generateRandomPosition());
      onCollect(); // Chama a função do pai para atualizar o placar
    }
  }, [playerPosition, gameActive]);

  return (
    <View style={styles.container}>
      {/* Apenas elementos do jogo. O UI (placar/instruções) é gerenciado pelo pai. */}
      <View
        style={[
          styles.orb,
          {
            left: orbPosition.x,
            top: orbPosition.y,
          },
        ]}
      />

      <View
        style={[
          styles.player,
          {
            left: playerPosition.x,
            top: playerPosition.y,
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // Cor de fundo será definida no Index.tsx
  },
  player: {
    position: 'absolute',
    width: PLAYER_SIZE,
    height: PLAYER_SIZE,
    borderRadius: PLAYER_SIZE / 2,
    backgroundColor: '#FFD700', // Pac-Man Amarelo (Player)
    borderWidth: 2,
    borderColor: '#fff',
  },
  orb: {
    position: 'absolute',
    width: ORB_SIZE,
    height: ORB_SIZE + 5, // Levemente mais alto para a forma de fantasma
    borderTopLeftRadius: ORB_SIZE / 2,
    borderTopRightRadius: ORB_SIZE / 2,
    borderBottomLeftRadius: 5, 
    borderBottomRightRadius: 5,
    backgroundColor: '#FFB852', // Fantasma Laranja (Target)
    borderWidth: 2,
    borderColor: '#fff',
  },
});