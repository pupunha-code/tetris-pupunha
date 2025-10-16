defmodule TetrisPupunha.Application do
  # See https://hexdocs.pm/elixir/Application.html
  # for more information on OTP Applications
  @moduledoc false

  use Application

  @impl true
  def start(_type, _args) do
    children = [
      TetrisPupunhaWeb.Telemetry,
      TetrisPupunha.Repo,
      {DNSCluster, query: Application.get_env(:tetris_pupunha, :dns_cluster_query) || :ignore},
      {Phoenix.PubSub, name: TetrisPupunha.PubSub},
      # Start a worker by calling: TetrisPupunha.Worker.start_link(arg)
      # {TetrisPupunha.Worker, arg},
      # Start to serve requests, typically the last entry
      TetrisPupunhaWeb.Endpoint
    ]

    # See https://hexdocs.pm/elixir/Supervisor.html
    # for other strategies and supported options
    opts = [strategy: :one_for_one, name: TetrisPupunha.Supervisor]
    Supervisor.start_link(children, opts)
  end

  # Tell Phoenix to update the endpoint configuration
  # whenever the application is updated.
  @impl true
  def config_change(changed, _new, removed) do
    TetrisPupunhaWeb.Endpoint.config_change(changed, removed)
    :ok
  end
end
