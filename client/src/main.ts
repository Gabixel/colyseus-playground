import type TestRoom from "../../server/src/rooms/TestRoom";
import { ColyseusClient } from "./ColyseusClient";
import { Room, Callbacks as RoomCallbacks } from "@colyseus/sdk";

const appDom = document.getElementById("app")!;
const loadingParagraph = document.getElementById("loading")!;
const playerListDom = document.getElementById("player-list")!;

const btn_assignUsers = document.getElementById("server-assign-users")!;

let colyseusClient = new ColyseusClient();

type ClientRoom = Room<TestRoom>;

async function connect() {
	await colyseusClient.requestRoom();
	await colyseusClient.connectToLobby();

	console.log("connected to room!");

	let room: ClientRoom = colyseusClient.room;

	appDom.classList.remove("hidden");
	loadingParagraph.classList.add("hidden");

	const _ = RoomCallbacks.get(room);

	const ourId = room.sessionId;

	_.listen("gameData", (data) => {
		console.log("listening to room gameData", data);

		_.onAdd(data, "playingUsers", (newUser) => {
			let li = document.createElement("li");
			li.innerText = newUser.playerId;
			li.id = `user-${newUser.playerId}`;

			// our user
			if (newUser.playerId === ourId) {
				li.innerText += ` (you)`;
			}

			playerListDom.appendChild(li);
		});
	});

	btn_assignUsers.onclick = () => {
		room.send("create-users-schema");
	};
}

connect();
