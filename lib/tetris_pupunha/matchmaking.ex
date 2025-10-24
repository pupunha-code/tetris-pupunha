defmodule TetrisPupunha.Matchmaking do
  use GenServer

  # Client API

  def start_link(_opts) do
    GenServer.start_link(__MODULE__, :queue.new(), name: __MODULE__)
  end

  def find_match(player_id) do
    GenServer.cast(__MODULE__, {:find_match, player_id})
  end

  # Server Callbacks

  @impl true
  def init(queue) do
    {:ok, queue}
  end

  @impl true
  def handle_cast({:find_match, player_id}, queue) do
    # Avoid adding the same player twice
    unless player_id in :queue.to_list(queue) do
      case :queue.out(queue) do
        {{:value, opponent_id}, new_queue} ->
          # Found a match
          game_id = :crypto.strong_rand_bytes(6) |> Base.url_encode64() |> binary_part(0, 8)
          game_topic = "game:#{game_id}"

          # Notify both players that a match was found
          TetrisPupunhaWeb.Endpoint.broadcast("player:#{player_id}", "match_found", %{
            game_topic: game_topic
          })

          TetrisPupunhaWeb.Endpoint.broadcast("player:#{opponent_id}", "match_found", %{
            game_topic: game_topic
          })

          {:noreply, new_queue}

        {:empty, new_queue} ->
          # No one in queue, so add the current player
          updated_queue = :queue.in(player_id, new_queue)
          {:noreply, updated_queue}
      end
    else
      {:noreply, queue}
    end
  end
end
