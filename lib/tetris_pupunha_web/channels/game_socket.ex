defmodule TetrisPupunhaWeb.GameSocket do
  use Phoenix.Socket, otp_app: :tetris_pupunha

  channel "game_room:*", TetrisPupunhaWeb.GameRoomChannel

  @impl true
  def connect(_params, socket, _connect_info) do
    {:ok, socket}
  end

  @impl true
  def id(_socket), do: nil
end
