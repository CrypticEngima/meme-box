import * as http from "http";
import * as WebSocket from "ws";
import {ACTIONS, TriggerClip} from "../projects/contracts/src/lib/actions";
import {PersistenceInstance} from "./persistence";
import {MetaTriggerTypes} from "../projects/contracts/src/lib/types";
import {MediaType} from "../projects/contracts/src/lib/media.types";

// no type ?!
interface WebSocketType {
  send(message: string);
  readyState: number;
}

const server = http.createServer();

const wss = new WebSocket.Server({ server });

const obsPages: {[key: string]: WebSocketType} = {};
let wsToSend: WebSocketType[] = [];

export function sendDataToScreen(targetId: string|null, message: string) {
  console.info('SENDING DATA TO', targetId, message);
  if (obsPages[targetId] && obsPages[targetId].readyState === WebSocket.OPEN) {
    obsPages[targetId].send(message);
    console.info('SENT DATA TO', targetId);
  }
}

// todo refactor?
// currently only the server tell which WS to do stuff
export function sendDataToAllSockets (message: string) {
  wsToSend.forEach(ws => {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(message)
    }
  });
}

export async function triggerMediaClipById(payloadObs: TriggerClip) {
  const allScreens = PersistenceInstance.listScreens();
  const clipConfig = PersistenceInstance.fullState().clips[payloadObs.id];

  if (clipConfig.type !== MediaType.Meta) {
    // No Meta Type
    // Trigger the clip on all assign screens
    for (const screen of allScreens) {
      if (screen.clips[payloadObs.id]) {
        const newMessageObj = {
          ...payloadObs,
          targetScreen: screen.id
        };

        sendDataToScreen(screen.id, `${ACTIONS.TRIGGER_CLIP}=${JSON.stringify(newMessageObj)}`);
      }
    }
  } else {
    // Get all Tags
    const assignedTags = clipConfig.tags || [];

    if (assignedTags.length === 0) {
      return;
    }

    // Get all clips assigned with these tags
    const allClips = PersistenceInstance.listClips().filter(
      clip => clip.id !== clipConfig.id && clip.tags && clip.tags.some(tagId => assignedTags.includes(tagId))
    );
    // per metaType
    switch (clipConfig.metaType) {
      case MetaTriggerTypes.Random: {
        // random 0..1
        const randomIndex = Math.floor(Math.random()*allClips.length);

        const clipToTrigger = allClips[randomIndex];

        triggerMediaClipById(clipToTrigger);

        break;
      }
      case MetaTriggerTypes.All: {
        allClips.forEach(clipToTrigger => {
          triggerMediaClipById(clipToTrigger);
        });

        break;
      }
      case MetaTriggerTypes.AllDelay: {

        for (const clipToTrigger of allClips) {
          await triggerMediaClipById(clipToTrigger);
          await timeoutAsync(clipConfig.metaDelay)
        }

        break;
      }
    }
  }
}

function timeoutAsync(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

wss.on("connection", (ws: WebSocket) => {
  //connection is up, let's add a simple simple event
  ws.on("message", (message: string) => {
    //log the received message and send it back to the client
    console.log("received: %s", message);
    // ws.send(`Hello, you sent -> ${message}`);

    // ACTION={payload}
    const [action, payload] = message.split('=');

    console.info({action, payload});

    switch (action) {
      case ACTIONS.I_AM_OBS: {
        obsPages[payload] = ws;
        wsToSend.push(ws);
        break;
      }
      case ACTIONS.TRIGGER_CLIP: {
        const payloadObs: TriggerClip = JSON.parse(payload);

        console.info('TRIGGER', payloadObs);

        if (!payloadObs.targetScreen) {
          console.info('NO TARGET');

          triggerMediaClipById(payloadObs);
        } else {
          sendDataToScreen(payloadObs.targetScreen, message);
        }

        break;
      }
      case ACTIONS.RELOAD_SCREEN: {
        sendDataToScreen(payload, message);
        break;
      }
    }

  });

  //send immediatly a feedback to the incoming connection
  ws.send("Hi there, I am a WebSocket server");
});

export function createWebSocketServer(port) {
  //start our server
  server.listen(port, () => {
    console.log(`Server started on port: ${port}`);
  });

  return {server, wss};
}
