# Game protocol WIP

A user first needs to join the game room and look for a game.

1. Join game room in /socket
```json
{
  "topic": "game_room:lobby",
  "event": "phx_join",
  "payload": {},
  "ref": "1"
}
```

2. Send looking for game in game room
```json
{
  "topic": "game_room:lobby",
  "event": "looking_for_game",
  "payload": {},
  "ref": "2"
}
```

3. Receive game room id when game ready
```json
{
  "topic": "game_room:lobby",
  "event": "game_ready",
  "payload": {
    "game_room_id": "123"
  },
  "ref": "3"
}
```

4. Send enter game room with id
```json
{
  "topic": "game_room:lobby",
  "event": "enter_game_room",
  "payload": {
    "game_room_id": "123"
  },
  "ref": "4"
}
```

5. Send ready to play in game room
```json
{
  "topic": "game_room:lobby",
  "event": "ready_to_play",
  "payload": {},
  "ref": "5"
}
```

Tetris Game loop

Game runs in ~10 TPS every tick broadcasts the game state to all players, then JS renders the game state to the screen.
Player sends payloads every tick

1. Player payload
Send
```json
{
  "topic": "game_room:lobby",
  "event": "player_payload",
  "payload": {
    "payload": {
      "command": "move", // move, rotate, drop, change_stance...
      "direction": "left"
    }
  },
  "ref": "6"
}
```

Player can also change it's stance: Attack, Attack MVP, Defense
Send
```json
{
  "topic": "game_room:lobby",
  "event": "player_payload",
  "payload": {
    "command": "change_stance",
    "stance": "attack"
  },
  "ref": "7"
}
```
