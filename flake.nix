{
  inputs = {
    nixpkgs.url = "github:paveloom/nixpkgs/system";
  };

  outputs =
    { nixpkgs, ... }:
    let
      forSystems =
        function:
        nixpkgs.lib.genAttrs nixpkgs.lib.systems.flakeExposed (
          system: function (import nixpkgs { inherit system; })
        );
    in
    {
      devShells = forSystems (pkgs: {
        default = pkgs.mkShell {
          name = "gnome-shell-memento-mori-shell";

          nativeBuildInputs = with pkgs; [
            bashInteractive
            nixd
            nixfmt-rfc-style

            bash-language-server
            npm-check-updates
            package-version-server
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
            GIR_DIRECTORIES = nixpkgs.lib.concatStringsSep " " (
              with pkgs;
              [
                "${glib.dev}/share/gir-1.0"
                "${gnome-shell}/share/gnome-shell"
                "${gobject-introspection.dev}/share/gir-1.0"
                "${gtk4.dev}/share/gir-1.0"
                "${libadwaita.dev}/share/gir-1.0"
                "${mutter}/lib/mutter-15"
              ]
            );
          };
        };
      });
    };
}
