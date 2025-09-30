# 📱 App Giroscópio e Acelerômetro - Pietro Freire Rezende dos Santos

> Status do Projeto: Concluído ✔️

---

### Tabela de Conteúdos
* [Descrição do Projeto](#descrição-do-projeto)
* [Demonstração da Aplicação](#demonstração-da-aplicação)
* [Funcionalidades](#-funcionalidades)
* [Tecnologias Utilizadas](#️-tecnologias-utilizadas)
* [Como Rodar o Projeto Localmente](#️-como-rodar-o-projeto-localmente)
* [Funcionalidade Adicional: Controle de Movimento com Sensores](#-funcionalidade-adicional-controle-de-movimento-com-sensores)
* [Autor](#-autor)

---

### Descrição do Projeto
<p align="center">
Este projeto é um aplicativo multi-plataforma, desenvolvido com React Native e Expo, que demonstra a integração e o uso de sensores de movimento de um dispositivo móvel, especificamente o giroscópio e o acelerômetro, através da biblioteca `expo-sensors`. O aplicativo inclui um componente para leitura de dados brutos do giroscópio e um mini-jogo interativo que usa o acelerômetro para controle de movimento.
</p>

---

### Demonstração da Aplicação
<p align="center">
  *Substitua esta imagem ou GIF por uma demonstração do seu aplicativo em funcionamento, por exemplo, o jogo "Orb Flutuante" ou a tela de leitura do giroscópio.*
</p>

---

### 🚀 Funcionalidades

- **Leitura do Giroscópio:** Componente `LeituraGiroscopio` que exibe os dados de rotação (x, y, z) do giroscópio em tempo real, com intervalo de atualização de 300ms.
- **Jogo Interativo "Orb Flutuante":** Componente `OrbFlutuante` que utiliza o acelerômetro para controlar a posição de um jogador na tela.
- **Controle de Movimento:** O jogador (círculo coral) é movido pela inclinação do dispositivo, mapeando a aceleração (x e y) para a posição (left e top).
- **Detecção de Colisão:** Ao colidir com o orbe (círculo azul), este é reposicionado aleatoriamente na tela.
- **Otimização de Performance:** O acelerômetro tem um intervalo de atualização de 16ms para um movimento mais fluido.

---

### 🛠️ Tecnologias Utilizadas

- **[React Native](https://reactnative.dev/)**
- **[Expo](https://expo.dev/)**
- **[TypeScript](https://www.typescriptlang.org/)**
- **`expo-sensors`**
- **`expo-router`** (para navegação baseada em arquivos)

---

### ⚙️ Como Rodar o Projeto Localmente

```bash
# 1. Clone o repositório
$ git clone [link-do-seu-repositorio]

# 2. Navegue até o diretório do projeto
$ cd giroscopio

# 3. Instale as dependências
$ npm install

# 4. Inicie o servidor de desenvolvimento
$ npx expo start