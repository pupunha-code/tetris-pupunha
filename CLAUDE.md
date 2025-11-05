# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Tetris Pupunha** is an online multiplayer Tetris battle royale game where 99 players compete in a last-player-standing match. Built with Elixir/Phoenix backend and JavaScript frontend, showcasing functional, real-time programming for multiplayer games.

## Technology Stack

- **Backend**: Elixir (~> 1.15), Phoenix (~> 1.8.1), Phoenix Channels (WebSockets), Phoenix PubSub, Ecto + SQLite3
- **Frontend**: JavaScript (ES2022), Canvas API, Tailwind CSS v4
- **Build Tools**: Mix, ESBuild, Phoenix LiveReload

## Common Commands

### Development
```bash
# Start development server
mix phx.server

# Start with interactive Elixir shell (preferred for debugging)
iex -S mix phx.server

# Run tests
mix test

# Run specific test file
mix test test/path/to/test_file.exs

# Run previously failed tests
mix test --failed
```

### Database
```bash
# Setup database (create + migrate + seed)
mix ecto.setup

# Reset database (drop + setup)
mix ecto.reset

# Run migrations only
mix ecto.migrate
```

### Assets
```bash
# Build assets (Tailwind + ESBuild)
mix assets.build

# Deploy assets for production (minified)
mix assets.deploy
```

### Pre-commit
```bash
# Run before committing (compile, format, test)
mix precommit
```

### Initial Setup
```bash
# Complete project setup
mix setup
```

## Architecture Overview

### Backend Structure

**OTP Supervision Tree**:
- `TetrisPupunha.Matchmaking` - GenServer managing FIFO matchmaking queue
- `Phoenix.PubSub` - Pub/sub for broadcasting game events
- `TetrisPupunhaWeb.Endpoint` - HTTP/WebSocket endpoint

**WebSocket Layer** (`lib/tetris_pupunha_web/channels/`):
- `GameSocket` - Handles WebSocket connections at `/socket`, generates user IDs
- `GameRoomChannel` (`game_room:lobby`) - Matchmaking channel, handles `find_match` events
- `GameChannel` (`game:*`) - Game-specific channels, receives player actions (`move`, `rotate`, `change_stance`)

**Matchmaking System** (`lib/tetris_pupunha/matchmaking.ex`):
- Maintains FIFO queue of players seeking matches
- Pairs players and generates unique game IDs
- Broadcasts `match_found` event with game topic to matched players

### Frontend Structure

**Entry Point** (`assets/js/tetris/index.js`):
- Main game state and loop
- Drop mechanics with progressive speed
- Hold system and 5-piece next queue
- WebSocket integration

**Core Game Logic** (`assets/js/tetris/core/`):
- `board.js` - 20x10 grid, line clearing
- `piece.js` - 7-bag randomization, rotation algorithms
- `shapes.js` - Tetromino definitions and colors
- `collision.js` - Boundary and board collision detection

**Game Systems** (`assets/js/tetris/systems/`):
- `game_socket.js` - Phoenix Socket wrapper for lobby and game channels
- `renderer.js` - Canvas rendering with gradients, ghost piece, next queue, hold piece
- `input.js` - Keyboard handling (Arrow keys, WASD, Vim keys)
- `audio.js` - Music and sound effects with dynamic speed
- `animation.js` - Smooth piece transitions
- `scoring.js` - Line clear scoring with progressive difficulty
- `loop.js` - Game loop management

### Communication Protocol

**Phase 1: Matchmaking** (documented in [docs/protocol.md](docs/protocol.md))
1. Client joins `game_room:lobby`
2. Client sends `find_match` event
3. Server responds with `match_found` containing game topic

**Phase 2: Gameplay**
1. Client joins `game:{game_id}`
2. Server broadcasts `game_state` (periodic, not yet implemented)
3. Client sends actions: `move`, `rotate`, `change_stance`, `hard_drop`

## Key Implementation Notes

### Multiplayer State
- **Current**: Client-side game logic with WebSocket infrastructure in place
- **In Progress**: Server-side game state authority and tick-based synchronization
- Client currently sends moves to server but game logic runs client-side

### Game Features Status
**Implemented**: Single-player mechanics, bag randomization, line clearing, hold system, next queue, progressive speed, animations, audio, matchmaking
**TODO**: Server-side authority, multiplayer sync, attack system (garbage lines), targeting (Random/Attackers/Badges/KOs), battle royale (99 players), player elimination

### WebSocket Security
- TODO: Add authentication to GameSocket (see `lib/tetris_pupunha_web/channels/game_socket.ex`)

## Development Guidelines

### Elixir/Phoenix Best Practices
- Follow Phoenix 1.8 guidelines (see AGENTS.md for comprehensive rules)
- Use functional programming patterns
- Use `Req` library for HTTP requests (avoid HTTPoison, Tesla)
- Always preload Ecto associations when accessed in templates
- Never use `String.to_atom/1` on user input
- Predicate functions end with `?`, not `is_` prefix

### WebSocket Development
- Use specific event names for actions (`move`, `rotate`) instead of generic payloads
- Game logic should be authoritative on server side (currently in development)
- Broadcast game state at fixed tick rate (planned: 10 TPS)

### Frontend Development
- No inline `<script>` tags - use `assets/js` modules
- Import vendor dependencies into `app.js` and `app.css`
- Use Canvas API for rendering (see `systems/renderer.js`)
- Keep core game logic separate from systems and UI

### CSS/Styling
- Use Tailwind CSS v4 with new import syntax in `app.css`
- Never use `@apply` in raw CSS
- Manually write Tailwind components (avoid daisyUI despite vendor files)

### Testing
- Use `Phoenix.LiveViewTest` and `LazyHTML` for assertions
- Test with specific DOM IDs (always add IDs to key elements)
- Run failed tests with `mix test --failed`
- Focus on outcomes, not implementation details

### Documentation Updates
**IMPORTANT**: After implementing features, update relevant documentation in `docs/` directory, especially:
- `docs/protocol.md` - WebSocket protocol changes
- README.md - Feature updates (if applicable)

## Code Organization

**Backend**:
- `lib/tetris_pupunha/` - Core business logic (Matchmaking, Repo)
- `lib/tetris_pupunha_web/channels/` - WebSocket communication
- `lib/tetris_pupunha_web/controllers/` - HTTP controllers
- `lib/tetris_pupunha_web/components/` - Reusable UI components

**Frontend**:
- `assets/js/tetris/core/` - Game mechanics (board, pieces, collision)
- `assets/js/tetris/systems/` - Game systems (rendering, input, audio)
- `assets/js/tetris/ui/` - UI components (canvas, HUD)
- `assets/css/` - Tailwind styles

**Configuration**:
- `config/dev.exs` - Development settings
- `config/prod.exs` - Production settings
- `config/runtime.exs` - Runtime configuration

## Access Points

- Main application: http://localhost:4000
- LiveDashboard: http://localhost:4000/dev/dashboard
- Mailbox preview: http://localhost:4000/dev/mailbox

## Critical Files

**Backend**:
- [lib/tetris_pupunha/application.ex](lib/tetris_pupunha/application.ex) - OTP supervision tree
- [lib/tetris_pupunha/matchmaking.ex](lib/tetris_pupunha/matchmaking.ex) - Matchmaking GenServer
- [lib/tetris_pupunha_web/channels/game_channel.ex](lib/tetris_pupunha_web/channels/game_channel.ex) - Game communication
- [lib/tetris_pupunha_web/channels/game_room_channel.ex](lib/tetris_pupunha_web/channels/game_room_channel.ex) - Lobby/matchmaking

**Frontend**:
- [assets/js/tetris/index.js](assets/js/tetris/index.js) - Game initialization and main loop
- [assets/js/tetris/systems/game_socket.js](assets/js/tetris/systems/game_socket.js) - WebSocket client
- [assets/js/tetris/core/board.js](assets/js/tetris/core/board.js) - Board state management
- [assets/js/tetris/systems/renderer.js](assets/js/tetris/systems/renderer.js) - Canvas rendering

## Notes

- Phoenix version mentioned in README (1.7) differs from actual version in mix.exs (1.8.1)
- Project is in active development - multiplayer synchronization is incomplete
- Server-side game logic needs implementation for authoritative gameplay
