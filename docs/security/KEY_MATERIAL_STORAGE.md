# Key Material Storage (Internal)

Do **not** store signing keys or certificates in this repository.

Store local Android debug/release key material and Apple signing assets in developer-only paths outside the repo, for example:

- macOS: `~/Library/Application Support/brunch-body/keys/`
- Linux: `~/.config/brunch-body/keys/`
- Windows: `%APPDATA%\\brunch-body\\keys\\`
- company-managed secret storage (for shared release keys)

For team-shared release credentials, use your approved secrets manager (for example, 1Password Secrets Automation, AWS Secrets Manager, GCP Secret Manager, or Azure Key Vault) instead of local disks or source control.

Applies to files such as: `.keystore`, `.jks`, `.p12`, `.pem`, `.key`, `.mobileprovision`.
