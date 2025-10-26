import { Socket } from "phoenix"

class GameSocket {
  constructor() {
    this.socket = null
    this.lobbyChannel = null
    this.gameChannel = null
    this.gameId = null
    this.playerId = null
    this.onMatchFound = null
    this.onGameState = null
    this.connected = false
  }

  connect() {
    console.log('[GameSocket] Connecting to game socket...')

    this.socket = new Socket('/socket', {
      logger: (kind, msg, data) => {
        console.log(`[Phoenix ${kind}]`, msg, data)
      }
    })

    this.socket.connect()
    this.connected = true

    this.socket.onOpen(() => {
      console.log('[GameSocket] Socket connected')
      this.joinLobby()
    })

    this.socket.onError((error) => {
      console.error('[GameSocket] Socket error:', error)
    })

    this.socket.onClose(() => {
      console.log('[GameSocket] Socket closed')
      this.connected = false
    })
  }

  joinLobby() {
    console.log('[GameSocket] Joining lobby...')

    this.lobbyChannel = this.socket.channel('game_room:lobby', {})

    this.lobbyChannel.join()
      .receive('ok', (resp) => {
        console.log('[GameSocket] Joined lobby successfully', resp)
        this.playerId = this.socket.connectionState()
      })
      .receive('error', (resp) => {
        console.error('[GameSocket] Failed to join lobby', resp)
      })

    this.lobbyChannel.on('match_found', (payload) => {
      console.log('[GameSocket] Match found!', payload)
      this.gameId = payload.game_topic

      if (this.onMatchFound) {
        this.onMatchFound(payload)
      }

      this.joinGame(payload.game_topic)
    })
  }

  findMatch() {
    if (!this.lobbyChannel) {
      console.error('[GameSocket] Not connected to lobby')
      return
    }

    console.log('[GameSocket] Requesting match...')

    this.lobbyChannel.push('find_match', {})
      .receive('ok', (resp) => {
        console.log('[GameSocket] Match request sent', resp)
      })
      .receive('error', (resp) => {
        console.error('[GameSocket] Match request failed', resp)
      })
  }

  joinGame(gameTopic) {
    console.log('[GameSocket] Joining game:', gameTopic)

    if (this.lobbyChannel) {
      this.lobbyChannel.leave()
    }

    this.gameChannel = this.socket.channel(gameTopic, {})

    this.gameChannel.join()
      .receive('ok', (resp) => {
        console.log('[GameSocket] Joined game successfully', resp)
      })
      .receive('error', (resp) => {
        console.error('[GameSocket] Failed to join game', resp)
      })

    this.gameChannel.on('game_state', (payload) => {
      console.log('[GameSocket] Game state received:', payload)

      if (this.onGameState) {
        this.onGameState(payload)
      }
    })
  }

  sendMove(direction) {
    if (!this.gameChannel) {
      console.warn('[GameSocket] Not in a game, cannot send move')
      return
    }

    const payload = { direction }
    console.log('[GameSocket] Sending move:', payload)

    this.gameChannel.push('move', payload)
      .receive('ok', (resp) => {
        console.log('[GameSocket] Move accepted', resp)
      })
      .receive('error', (resp) => {
        console.error('[GameSocket] Move rejected', resp)
      })
  }

  sendRotate(direction) {
    if (!this.gameChannel) {
      console.warn('[GameSocket] Not in a game, cannot send rotate')
      return
    }

    const payload = { direction }
    console.log('[GameSocket] Sending rotate:', payload)

    this.gameChannel.push('rotate', payload)
      .receive('ok', (resp) => {
        console.log('[GameSocket] Rotate accepted', resp)
      })
      .receive('error', (resp) => {
        console.error('[GameSocket] Rotate rejected', resp)
      })
  }

  sendChangeStance(stance) {
    if (!this.gameChannel) {
      console.warn('[GameSocket] Not in a game, cannot send stance change')
      return
    }

    const payload = { stance }
    console.log('[GameSocket] Sending stance change:', payload)

    this.gameChannel.push('change_stance', payload)
      .receive('ok', (resp) => {
        console.log('[GameSocket] Stance change accepted', resp)
      })
      .receive('error', (resp) => {
        console.error('[GameSocket] Stance change rejected', resp)
      })
  }

  sendHardDrop() {
    if (!this.gameChannel) {
      console.warn('[GameSocket] Not in a game, cannot send hard drop')
      return
    }

    console.log('[GameSocket] Sending hard drop')

    this.gameChannel.push('hard_drop', {})
      .receive('ok', (resp) => {
        console.log('[GameSocket] Hard drop accepted', resp)
      })
      .receive('error', (resp) => {
        console.error('[GameSocket] Hard drop rejected', resp)
      })
  }

  disconnect() {
    console.log('[GameSocket] Disconnecting...')

    if (this.gameChannel) {
      this.gameChannel.leave()
    }

    if (this.lobbyChannel) {
      this.lobbyChannel.leave()
    }

    if (this.socket) {
      this.socket.disconnect()
    }

    this.connected = false
  }

  isConnected() {
    return this.connected
  }

  isInGame() {
    return this.gameChannel !== null
  }
}

export const gameSocket = new GameSocket()
