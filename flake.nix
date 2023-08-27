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

      nativeBuildInputs = with pkgs; [
        glib
        nodejs
        zip
      ];
    in {
      devShells.default = pkgs.mkShell {
        name = "gnome-shell-memento-mori-shell";

        nativeBuildInputs =
          nativeBuildInputs
          ++ (with pkgs; [
            alejandra
            ltex-ls
            nil
            nodePackages.npm-check-updates
            nodePackages.typescript-language-server
            vscode-langservers-extracted
          ]);
      };

      packages = let
        metadata = pkgs.lib.importJSON ./package.json;

        pname = metadata.name;
        version = metadata.version;

        src = ./.;

        npmDepsHash = "sha256-WuLDjfe5TLd1QsEdPjVbBQDuFUT6N7hK3BV+XGNCEb4=";
      in {
        default = pkgs.buildNpmPackage {
          inherit pname version src npmDepsHash nativeBuildInputs;

          installPhase = ''
            mkdir $out
            cp -r dist/* $out
          '';
        };

        zip = pkgs.buildNpmPackage {
          inherit src npmDepsHash nativeBuildInputs;

          name = "${pname}-${version}.zip";

          installPhase = ''
            cd dist && zip -qr $out .
          '';
        };
      };
    });
}
