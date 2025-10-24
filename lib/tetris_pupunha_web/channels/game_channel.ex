defmodule TetrisPupunhaWeb.GameChannel do
  use Phoenix.Channel

  def join("game:" <> _game_id, _payload, socket) do
    {:ok, %{score: 0}, socket}
  end

  def handle_in("move", %{"direction" => direction}, socket) do
    IO.puts("Player #{inspect(socket.assigns.user_id)} moved #{direction}")
    push(socket, "move_acknowledged", %{direction: direction})
    {:noreply, socket}
  end

  def handle_in("rotate", %{"direction" => direction}, socket) do
    IO.puts("Player #{inspect(socket.assigns.user_id)} rotated #{direction}")
    push(socket, "rotate_acknowledged", %{direction: direction})
    {:noreply, socket}
  end

  def handle_in("change_stance", %{"stance" => stance}, socket) do
    IO.puts("Player #{inspect(socket.assigns.user_id)} changed stance to #{stance}")
    push(socket, "stance_changed", %{stance: stance})
    {:noreply, socket}
  end

  def handle_info(:game_tick, socket) do
    broadcast!(socket, "game_state", %{message: "tick..."})
    {:noreply, socket}
  end
end
