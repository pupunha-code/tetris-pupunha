defmodule TetrisPupunhaWeb.PageController do
  use TetrisPupunhaWeb, :controller

  def home(conn, _params) do
    render(conn, :home)
  end
end
