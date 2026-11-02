# Moving the signing key into GitHub Secrets

Right now the APK is signed with the key from the `android-signing/` folder: it lies in the public repository together with its password.
This means anyone can build an APK with your signature, and Android will accept it as an update of your app
(with access to the catalog data on the phone). Your own key in Secrets closes this hole.

## Steps (once, about 10 minutes)
1. **Make a backup of the data in the app**: Settings, “Export to a file”, “Full backup”. Save the file outside the phone.
2. On a computer with Java create a key (invent a long password and write it down in a password manager):
   `keytool -genkeypair -v -keystore my.keystore -alias gamecatalog -keyalg RSA -keysize 2048 -validity 36500 -storetype PKCS12 -storepass YOUR_PASSWORD -keypass YOUR_PASSWORD -dname "CN=Game Catalog"`
   The store password and the key password must be the same: the build uses one `KEYSTORE_PASS` for both.
3. Turn the file into a base64 string.
   Windows PowerShell: `[Convert]::ToBase64String([IO.File]::ReadAllBytes("my.keystore"))`
   Linux/macOS: `base64 -w0 my.keystore`
4. GitHub: the repository, Settings, Secrets and variables, Actions, New repository secret. Create three secrets:
   `KEYSTORE_B64` (the string from step 3), `KEYSTORE_PASS` (the password), `KEY_ALIAS` (`gamecatalog`).
5. Delete the `android-signing/` folder from the repository (a commit with the deletion).
6. Start the build (Actions). In the log of the signing step there must be the line “Signing with a personal key from GitHub Secrets”,
   and there must be no warning about the public key.
7. **Reinstalling:** Android does not install an APK with a different signature over the old one. Delete the old app,
   install the new one and import the backup from step 1.

## Important
- Keep the file `my.keystore` and the password in a safe place and do not commit them to the repository (it is added to `.gitignore`).
  If the key is lost, the app cannot be updated over the installed one, only reinstalled with a data import.
- The browser version (GitHub Pages) does not depend on the key.
