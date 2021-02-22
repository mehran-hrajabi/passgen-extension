# passgen-extension
A password generator chrome extension using Secure hash algorithms.

# Usage
Go to chrome://extensions in your google chrome browser. In extensions page, click on "Load unpacked" button and select the project's folder to add the extension to your browser. First thing you need to do, is to set your master password and hashing algorithm. You can right click on the extension and go to options page. There you can set or edit your master password and hashing algorithm.

# Implementation
This extension uses Web Crypto API to generate passwords based on Secure Hash Algorithms. It also uses chrome storage to save master password and selected hashing algorithm.
