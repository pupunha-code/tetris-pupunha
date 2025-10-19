defmodule TetrisPupunhaWeb.GameRoomChannel do
  use Phoenix.Channel

  def join("room:" <> _room_id, _playload, socket) do
    {:ok, socket}
  end

  # handle_in eh um sub no event "new_message"
  def handle_in("new_message", %{"body" => body}, socket) do
    broadcast!(socket, "new_message", %{body: body})
    {:noreply, socket}
  end
end
