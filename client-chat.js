require('dotenv').config()
const fs = require('fs');
const path = require('path');
const WebSocket = require('ws');

const NAME = process.env.NAME;
const INPUT_PATH = path.join('./input.txt');
const CHAT_PATH = path.join('./chat.txt');

const ws = new WebSocket('wss://chat-simple.peresprueba29.workers.dev/ws');
let watcher;

ws.onopen = () => {
  watcher = fs.watch(INPUT_PATH, (eventType, filename) => {
  
    if (eventType === "change") {
      if (getInput() != '') {
        ws.send( JSON.stringify({name: NAME, content: getInput()}) );
        setInput('');
      }
    }
  });
}


ws.onmessage = (e) => {
  let text = '';
  JSON.parse(e.data).mensajes.forEach(mensaje => {
    text += mensaje.name + ': ' + mensaje.content + '\n';
  });

  setChat(text);
};

function getInput() {
  try {
    return fs.readFileSync(INPUT_PATH, 'utf-8');
  } catch (error) {
    console.log(error);
  }
}

function setInput(text) {
  try {
    return fs.writeFileSync(INPUT_PATH, text);
  } catch (error) {
    console.log(error);
  }
}

function setChat(text) {
  try {
    return fs.writeFileSync(CHAT_PATH, text);
  } catch (error) {
    console.log(error);
  }
}