import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, Button } from "react-native";
import OrbFlutuanteGame from '@/components/OrbFlutuante';

// Estados do Jogo
type GameState = 'home' | 'playing' | 'gameOver';

const GAME_TIME_SECONDS = 30;

// --- Componentes de Tela ---

const StartScreen = ({ onPlayEasy, onPlayHard }) => (
  <View style={styles.screenContainer}>
    <Text style={styles.title}>Giroscópio Game</Text>
    <Text style={styles.instructions}>Seu objetivo é coletar o orbe azul em {GAME_TIME_SECONDS} segundos, cobrindo-o totalmente com a bola laranja!</Text>
    <View style={styles.buttonContainer}>
      <Button title="MODO FÁCIL" onPress={onPlayEasy} color="#2ecc71" />
      <View style={{ width: 20 }} /> {/* Espaçamento */}
      <Button title="MODO DIFÍCIL" onPress={onPlayHard} color="#e74c3c" />
    </View>
  </View>
);

const GameOverScreen = ({ score, onPlayAgain }) => (
  <View style={styles.screenContainer}>
    <Text style={styles.title}>TEMPO ESGOTADO!</Text>
    <Text style={styles.scoreTextFinal}>Pontuação Final: {score}</Text>
    <Button title="JOGAR NOVAMENTE" onPress={onPlayAgain} color="#3498db" />
  </View>
);

// --- Componente Principal ---

export default function Index() {
  const [gameState, setGameState] = useState<GameState>('home');
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(GAME_TIME_SECONDS);
  const [resetTrigger, setResetTrigger] = useState(0);
  const [isHardMode, setIsHardMode] = useState(false); // <-- Novo estado para o modo

  // Função para iniciar o jogo
  const startGame = (hardMode: boolean) => { // <-- Recebe o modo
    setScore(0);
    setTimeLeft(GAME_TIME_SECONDS);
    setIsHardMode(hardMode); // <-- Define o modo
    setGameState('playing');
    setResetTrigger(prev => prev + 1);
  };

  // Função chamada ao coletar um orbe
  const handleCollect = () => {
    setScore(prev => prev + 1);
  };

  // Lógica do Timer
  useEffect(() => {
    if (gameState !== 'playing') {
      return;
    }

    if (timeLeft <= 0) {
      setGameState('gameOver');
      return;
    }

    const timerId = setInterval(() => {
      setTimeLeft(prevTime => prevTime - 1);
    }, 1000);

    return () => clearInterval(timerId);
  }, [gameState, timeLeft]);


  // Renderização condicional das telas
  if (gameState === 'home') {
    return <StartScreen 
      onPlayEasy={() => startGame(false)} // Passa false para modo fácil
      onPlayHard={() => startGame(true)}  // Passa true para modo difícil
    />;
  }

  if (gameState === 'gameOver') {
    return <GameOverScreen score={score} onPlayAgain={() => setGameState('home')} />; // Volta para a tela inicial
  }

  // Renderiza a tela de jogo
  return (
    <View style={styles.gameContainer}>
      <Text style={styles.timerText}>Tempo: {timeLeft}s</Text>
      <Text style={styles.scoreTextGame}>Pontuação: {score}</Text>
      <Text style={styles.instructionsGame}>Colete o orbe azul!</Text>
      
      <OrbFlutuanteGame
        gameActive={gameState === 'playing'}
        onCollect={handleCollect}
        resetTrigger={resetTrigger}
        isHardMode={isHardMode} // <-- Passa o modo para o componente de jogo
      />
    </View>
  );
}

const styles = StyleSheet.create({
  // Estilos da Aplicação e Telas
  screenContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#2c3e50',
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 40,
    textAlign: 'center',
  },
  instructions: {
    fontSize: 18,
    color: '#fff',
    textAlign: 'center',
    marginBottom: 40,
  },
  scoreTextFinal: {
    fontSize: 24,
    color: '#3498db',
    marginBottom: 40,
    fontWeight: 'bold',
  },
  buttonContainer: { // <-- Novo estilo para alinhar os botões
    flexDirection: 'row',
    marginTop: 20,
  },
  // Estilos da Tela de Jogo
  gameContainer: {
    flex: 1,
    backgroundColor: '#2c3e50',
  },
  timerText: {
    position: 'absolute',
    top: 30,
    left: 0,
    right: 0,
    textAlign: 'center',
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    zIndex: 10,
  },
  scoreTextGame: {
    position: 'absolute',
    top: 90,
    left: 0,
    right: 0,
    textAlign: 'center',
    fontSize: 20,
    color: '#fff',
    zIndex: 10,
  },
  instructionsGame: {
    position: 'absolute',
    top: 60,
    left: 0,
    right: 0,
    textAlign: 'center',
    fontSize: 20,
    color: '#fff',
    zIndex: 10,
  },
});