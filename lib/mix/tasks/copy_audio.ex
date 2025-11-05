defmodule Mix.Tasks.CopyAudio do
  use Mix.Task

  @shortdoc "Copy audio files to assets/audio directory"

  def run(_args) do
    Mix.shell().info("Initializing copy audio files to assets/audio directory")

    src_base = "assets/js/tetris"
    dest_base = "priv/static/assets/audio"

    dirs = ["playlist", "sound-effect"]

    Enum.each(dirs, fn dir ->
      src = Path.join(src_base, dir)
      dest = Path.join(dest_base, dir)

      Mix.shell().info("Copying #{src} -> #{dest}")

      File.mkdir_p!(dest)

      File.cp_r!(src, dest)
    end)

    Mix.shell().info("Finished copy audio files to assets/audio directory")
  end
end
