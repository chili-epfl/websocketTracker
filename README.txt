Make sure you have the latest boost (or at least 1.48 or newer):
sudo apt-get install libboost1.48-all-dev

Install the websocketpp library from https://github.com/zaphoyd/websocketpp.

Install google chrome:

wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | sudo apt-key add -
sudo sh -c 'echo "deb http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google-chrome.list'
sudo apt-get update
sudo apt-get install google-chrome-stable


run:

google-chrome chrome://flags/

Look for "Override software rendering list" and Enable that. Restart Chrome. That's it.


