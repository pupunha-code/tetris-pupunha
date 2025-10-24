defmodule TetrisPupunhaWeb.GameSocket do
  use Phoenix.Socket, otp_app: :tetris_pupunha

  channel "game_room:*", TetrisPupunhaWeb.GameRoomChannel
  channel "game:*", TetrisPupunhaWeb.GameChannel

  @impl true
  def connect(_params, socket, _connect_info) do
    # TODO: Add auth
    user_id = :crypto.strong_rand_bytes(6) |> Base.url_encode64() |> binary_part(0, 8)
    socket = assign(socket, :user_id, user_id)
    {:ok, socket}
  end

  @impl true
  def id(socket), do: "player:#{socket.assigns.user_id}"
end
