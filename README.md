# passgen-extension
A password generator chrome extension using Secure hash algorithms.

# Usage
Go to chrome://extensions in your google chrome browser. In extensions page, enable Developer Mode and click the "Load unpacked" button and select the project's directory. This will add the extension to your browser. First thing you need to do, is to set your master password and hashing algorithm. Default hashing algorithm is SHA-256. In the extension itself you can set or edit your master password and hashing algorithm.

# Implementation
This extension uses Web Crypto API to generate passwords based on Secure Hash Algorithms. It also uses chrome storage to save master password, selected hashing algorithm and view mode state.
