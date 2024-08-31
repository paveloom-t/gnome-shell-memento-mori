{
  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixpkgs-unstable";
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
        bashInteractive
        nil

        gettext
        gnome.gnome-shell
        gobject-introspection
        libxml2

        nodejs_latest
        nodePackages_latest.npm-check-updates
      ];

      env = {
        GIR_DIRECTORIES = nixpkgs.lib.concatStringsSep " " (with pkgs; [
          "${gnome.mutter}/lib/mutter-13"
          "${gnome.gnome-shell}/share/gnome-shell"
          "${gobject-introspection.dev}/share/gir-1.0"
          "${gtk4.dev}/share/gir-1.0"
          "${libadwaita.dev}/share/gir-1.0"
        ]);
      };
    };
  };
}
