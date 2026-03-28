# Key Material Storage (Internal)

Do **not** store signing keys or certificates in this repository.

Store local Android debug/release key material in a developer-only path outside the repo, for example:

- `~/.config/brunch-body/keys/`
- company-managed secret storage (for shared release keys)

Applies to files such as: `.keystore`, `.jks`, `.p12`, `.pem`, `.key`.
