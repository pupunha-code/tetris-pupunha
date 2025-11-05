# Tetris Pupunha 🟦🟧🟩

An online Tetris battle royale where 99 players compete until only one remains, built with Elixir and Phoenix to showcase the power of functional, real-time programming for multiplayer games.

## ✨ Features

- **Battle Royale:** 99 players compete in a last-player-standing match.
- **Multiplayer Attacks:** Send "garbage" lines to opponents by clearing multiple lines at once.
- **Targeting System:** Manually aim at specific players or use automatic strategies (Random, Attackers, Badges, KOs).
- **Real-time & Low Latency:** Optimized for responsive, instantly synchronized gameplay.

## 🛠️ Tech Stack

- **Elixir** (~> 1.15) - A functional language perfect for concurrent systems.
- **Phoenix** (~> 1.7) - A robust web framework for real-time applications.
- **Phoenix LiveView** - For reactive, real-time user interfaces.
- **Phoenix PubSub** - Messaging system for player communication.
- **Ecto** - For data persistence.
- **SQLite3** - Lightweight database for easy setup.
- **Tailwind CSS** - For a modern, responsive UI.

## 📋 Prerequisites

- **Elixir & Erlang:** [Official Installation Guide](https://elixir-lang.org/install.html)
  - We recommend using a version manager like [asdf-vm](https://asdf-vm.com/) for development.
- **Node.js:** Required for asset compilation. [Download here](https://nodejs.org/).

---

## 🚀 Getting Started

### 1. Clone the Repository
```bash
git clone https://github.com/pupunha-code/tetris-pupunha.git
cd tetris-pupunha
```

### 2. Install Dependencies
This single command fetches all Elixir and Node.js dependencies.
```bash
mix deps.get
```

### 3. Set Up the Database
This creates and seeds the database.
```bash
mix ecto.setup
```

### 4. Build Assets
Compile the frontend assets (Tailwind CSS and JavaScript).
```bash
mix assets.build
```

### 5. Run the Server
Start the Phoenix server.
```bash
mix phx.server
```
Or, to run inside an interactive Elixir shell:
```bash
iex -S mix phx.server
```
The application will be running at [http://localhost:4000](http://localhost:4000).

---

## 🎮 Development

- **Run Tests:**
  ```bash
  mix test
  ```
- **Reset the Database:**
  ```bash
  mix ecto.reset
  ```
- **Deploy Assets for Production:**
  ```bash
  mix assets.deploy
  ```

## 📡 Game Protocol

All real-time communication between the client and server follows a specific WebSocket protocol. For details on the implementation and how to interact with the game channels, please see the [**Game Protocol Document**](docs/protocol.md).

## 🎯 Current Mechanics Demo

The video below demonstrates the current state of the game's core mechanics, including piece movement, rotation, and line clearing. Multiplayer features are under active development.

<video width="100%" controls>
  <source src="docs/mecanica-tetris.mp4" type="video/mp4">
  Your browser does not support the video tag. <a href="docs/mecanica-tetris.mp4">Click here to download the video</a>.
</video>