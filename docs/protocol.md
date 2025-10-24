# Game Protocol

A user first joins the lobby to find a game. Once a game is found, they join a separate, dedicated channel for that game.

---

### 1. Matchmaking Flow

The `game_room:lobby` channel is used exclusively for matchmaking.

**1.1. Client joins the lobby**
The client connects to the socket and joins the lobby channel.

```json
{
  "topic": "game_room:lobby",
  "event": "phx_join",
  "payload": {},
  "ref": "1"
}
```

**1.2. Client requests a game**
The client tells the server it's looking for a game.

```json
{
  "topic": "game_room:lobby",
  "event": "find_match",
  "payload": {},
  "ref": "2"
}
```

**1.3. Server finds a match and notifies clients**
Once the server finds opponents, it creates a unique game channel and sends the topic to the matched players. This is a server push, so it has no `ref`.

```json
{
  "topic": "player:user-id-123",
  "event": "match_found",
  "payload": {
    "game_topic": "game:bf2-d0-8a-9c"
  },
  "ref": null
}
```

---

### 2. Gameplay Flow

The client leaves the lobby channel and joins the dedicated game channel (e.g., `game:bf2-d0-8a-9c`). All in-game communication happens here.

**2.1. Client joins the game channel**

```json
{
  "topic": "game:bf2-d0-8a-9c",
  "event": "phx_join",
  "payload": {},
  "ref": "3"
}
```

**2.2. Server broadcasts game state**
The game runs at a fixed tick rate (e.g., 10 TPS). On every tick, the server broadcasts the complete game state to all players in the channel.

```json
{
  "topic": "game:bf2-d0-8a-9c",
  "event": "game_state",
  "payload": {
    "players": [
      { "id": "player1", "board": "[...]", "score": 1200, "stance": "attack" },
      { "id": "player2", "board": "[...]", "score": 1100, "stance": "defense" }
    ],
    "game_over": false
  },
  "ref": null
}
```

**2.3. Client sends player actions**
Instead of a generic `player_payload` event, we use specific events for each action.

**Move a piece:**
```json
{
  "topic": "game:bf2-d0-8a-9c",
  "event": "move",
  "payload": { "direction": "left" },
  "ref": "4"
}
```

**Rotate a piece:**
```json
{
  "topic": "game:bf2-d0-8a-9c",
  "event": "rotate",
  "payload": { "direction": "clockwise" },
  "ref": "5"
}
```

**Change stance:**
```json
{
  "topic": "game:bf2-d0-8a-9c",
  "event": "change_stance",
  "payload": { "stance": "attack_mvp" },
  "ref": "6"
}
```
