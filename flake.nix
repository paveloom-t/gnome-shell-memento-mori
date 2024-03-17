{
  inputs.nixpkgs.url = "github:NixOS/nixpkgs/nixpkgs-unstable";
  inputs.flake-utils.url = "github:numtide/flake-utils";

  outputs = {
    self,
    nixpkgs,
    flake-utils,
  }:
    flake-utils.lib.eachDefaultSystem (system: let
      pkgs = import nixpkgs {inherit system;};
    in {
      devShells.default = pkgs.mkShell {
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
    });
}
