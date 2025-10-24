defmodule TetrisPupunhaWeb.GameRoomChannel do
  use Phoenix.Channel
  alias TetrisPupunha.Matchmaking

  def join("game_room:lobby", _payload, socket) do
    {:ok, socket}
  end

  def handle_in("find_match", _payload, socket) do
    Matchmaking.find_match(socket.assigns.user_id)
    {:noreply, socket}
  end
end
