# Tetris Pupunha 🟦🟧🟩

Uma recriação do **Tetris 99** desenvolvida com Phoenix LiveView e Elixir. Um battle royale de Tetris online onde 99 jogadores competem simultaneamente até sobrar apenas um vencedor, demonstrando o poder da programação funcional reativa em jogos multiplayer em tempo real.

## Funcionalidades do Tetris 99

### Mecânicas Principais

- **Battle Royale:** 99 jogadores competem até sobrar apenas um
- **Ataque Multiplayer:** Envie linhas de "lixo" para outros jogadores ao completar múltiplas linhas
- **Sistema de Targeting:** Mire em jogadores específicos ou use estratégias automáticas
- **Badges:** Sistema de conquistas que amplificam o poder de ataque
- **Espectador:** Observe outros jogadores após ser eliminado

### Funcionalidades Técnicas

- **Tempo Real:** Sincronização instantânea entre todos os jogadores
- **Baixa Latência:** Otimizado para jogabilidade responsiva
- **Escalabilidade:** Suporte para múltiplas salas simultâneas
- **Persistência:** Ranking e estatísticas de jogadores

### Modos de Targeting

- **Random:** Ataque jogadores aleatórios
- **Attackers:** Contra-ataque quem está te atacando
- **Badges:** Mire em jogadores com mais badges
- **KOs:** Foque em eliminar jogadores vulneráveis

## 📋 Pré-requisitos

Antes de começar, você precisará ter instalado em sua máquina:

### 1. Elixir e Erlang

#### Ubuntu/Debian

```bash
# Adicione o repositório oficial do Erlang Solutions
wget https://packages.erlang-solutions.com/erlang-solutions_2.0_all.deb
sudo dpkg -i erlang-solutions_2.0_all.deb
sudo apt-get update

# Instale Erlang e Elixir
sudo apt-get install esl-erlang elixir
```

#### macOS (via Homebrew)

```bash
brew install elixir
```

#### Windows

1. Baixe o instalador do Elixir de: https://elixir-lang.org/install.html#windows
2. Execute o instalador e siga as instruções

#### Arch Linux

```bash
sudo pacman -S elixir
```

#### Via asdf (recomendado para desenvolvimento)

```bash
# Instale asdf
git clone https://github.com/asdf-vm/asdf.git ~/.asdf --branch v0.14.0

# Adicione ao seu shell (bash/zsh)
echo '. ~/.asdf/asdf.sh' >> ~/.bashrc
echo '. ~/.asdf/completions/asdf.bash' >> ~/.bashrc

# Reinicie o terminal e instale os plugins
asdf plugin add erlang
asdf plugin add elixir

# Instale as versões
asdf install erlang 26.2.5
asdf install elixir 1.15.7-otp-26
asdf global erlang 26.2.5
asdf global elixir 1.15.7-otp-26
```

### 2. Node.js (para assets)

```bash
# Ubuntu/Debian
sudo apt-get install nodejs npm

# macOS
brew install node

# Arch Linux
sudo pacman -S nodejs npm
```

### 3. PostgreSQL (banco de dados)

```bash
# Ubuntu/Debian
sudo apt-get install postgresql postgresql-contrib

# macOS
brew install postgresql
brew services start postgresql

# Arch Linux
sudo pacman -S postgresql
sudo systemctl enable --now postgresql
```

## 🚀 Instalação e Configuração

### 1. Clone o repositório

```bash
git clone https://github.com/pupunha-code/tetris-pupunha.git
cd tetris-pupunha
```

### 2. Instale as dependências

```bash
mix deps.get
```

### 3. Configure o banco de dados

```bash
# Crie e configure o banco de dados
mix ecto.setup
```

### 4. Instale e compile os assets (CSS/JS)

```bash
mix assets.setup
mix assets.build
```

## 🎮 Como Executar

### Modo Desenvolvimento

```bash
# Inicia o servidor Phoenix em modo desenvolvimento
mix phx.server
```

Ou se preferir executar dentro do IEx (Interactive Elixir):

```bash
iex -S mix phx.server
```

O servidor estará disponível em [`localhost:4000`](http://localhost:4000)

### Comandos Úteis

```bash
# Executar testes
mix test

# Verificar qualidade do código (linting, formatação, testes)
mix precommit

# Resetar o banco de dados
mix ecto.reset

# Compilar assets para produção
mix assets.deploy
```

## 🎯 Demonstração da Mecânica Atual

Confira o vídeo demonstrando a mecânica atual do jogo Tetris 99:

<video width="100%" controls>
  <source src="docs/mecanica-tetris.mp4" type="video/mp4">
  Seu navegador não suporta a tag de vídeo. <a href="docs/mecanica-tetris.mp4">Clique aqui para baixar o vídeo</a>.
</video>

> **Nota:** O vídeo mostra as funcionalidades básicas do Tetris implementadas até o momento, incluindo movimento das peças, rotação e detecção de linhas completas. As funcionalidades multiplayer e battle royale estão em desenvolvimento.

## 🛠️ Tecnologias Utilizadas

- **Elixir** (~> 1.15) - Linguagem de programação funcional, ideal para sistemas concorrentes
- **Phoenix** (~> 1.8.1) - Framework web robusto para aplicações em tempo real
- **Phoenix LiveView** (~> 1.1.0) - Interface reativa para jogos multiplayer em tempo real
- **Phoenix PubSub** - Sistema de mensageria para comunicação entre jogadores
- **Ecto** - ORM para persistência de dados de jogadores e partidas
- **SQLite3** - Banco de dados leve para desenvolvimento
- **Tailwind CSS** - Framework CSS utilitário para UI responsiva
- **Heroicons** - Ícones SVG moderno
