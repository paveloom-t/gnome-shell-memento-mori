{
  inputs.nixpkgs.url = "github:NixOS/nixpkgs/nixpkgs-unstable";
  inputs.flake-utils.url = "github:numtide/flake-utils";

  outputs = {
    self,
    nixpkgs,
    flake-utils,
  }:
    flake-utils.lib.eachDefaultSystem (system: let
      overlays = [
        (self: super: {
          nodejs = super.nodejs-19_x;
        })
      ];

      pkgs = import nixpkgs {inherit system overlays;};

      metadata = pkgs.lib.importJSON ./package.json;

      pname = metadata.name;
      version = metadata.version;

      src = ./.;

      npmDepsHash = "sha256-WuLDjfe5TLd1QsEdPjVbBQDuFUT6N7hK3BV+XGNCEb4=";

      nativeBuildInputs = with pkgs; [
        glib
        nodejs
        zip
      ];
    in {
      devShells.default = pkgs.mkShell {
        inherit nativeBuildInputs;
      };
      packages.default = pkgs.buildNpmPackage {
        inherit pname version src npmDepsHash nativeBuildInputs;

        installPhase = ''
          mkdir $out
          cp -r dist/* $out
        '';
      };
      packages.zip = pkgs.buildNpmPackage {
        inherit src npmDepsHash nativeBuildInputs;

        name = "${pname}-${version}.zip";

        installPhase = ''
          cd dist && zip -qr $out .
        '';
      };
    });
}
