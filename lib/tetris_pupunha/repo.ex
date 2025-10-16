defmodule TetrisPupunha.Repo do
  use Ecto.Repo,
    otp_app: :tetris_pupunha,
    adapter: Ecto.Adapters.SQLite3
end
