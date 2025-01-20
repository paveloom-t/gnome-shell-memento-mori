{
  inputs = {
    nixpkgs.url = "github:paveloom/nixpkgs/system";
  };

  outputs = {
    self,
    nixpkgs,
  }: let
    system = "x86_64-linux";
    pkgs = import nixpkgs {inherit system;};
  in {
    devShells.${system}.default = pkgs.mkShell {
      name = "gnome-shell-memento-mori-shell";

      nativeBuildInputs = with pkgs; [
        alejandra
        bash-language-server
        bashInteractive
        nil
        npm-check-updates
        shellcheck
        shfmt
        typescript-language-server
        vscode-langservers-extracted
        yamlfmt
        yamllint

        gettext
        gnome-shell
        gobject-introspection
        libxml2

        nodejs_latest
      ];

      env = {
        GIR_DIRECTORIES = nixpkgs.lib.concatStringsSep " " (with pkgs; [
          "${glib.dev}/share/gir-1.0"
          "${gnome-shell}/share/gnome-shell"
          "${gobject-introspection.dev}/share/gir-1.0"
          "${gtk4.dev}/share/gir-1.0"
          "${libadwaita.dev}/share/gir-1.0"
          "${mutter}/lib/mutter-15"
        ]);
      };
    };
  };
}
