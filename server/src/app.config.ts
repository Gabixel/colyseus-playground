import {
	defineRoom,
	defineServer,
	logger,
	matchMaker,
	WebSocketTransport,
} from "colyseus";
import { monitor } from "@colyseus/monitor";
import { playground } from "@colyseus/playground";
import { auth, JWT } from "@colyseus/auth";
import { TestRoom } from "./rooms/TestRoom.js";
const compression = require("compression");
const express = require("express");


const DUMMY_USER_NAMES = [
	"Cool User",
	"Dummy User",
	"John Doe",
	"Rick",
	"Manny",
	"Sandy",
	"Xx_Destroyer_xX",
	"ASDFGHJKL",
	"HAHAHA123",
	"....",
	"._.",
];

export function getDummyUsername() {
	const part1Index = Math.floor(Math.random() * DUMMY_USER_NAMES.length);

	// const SLICED_ARRAY = [...DUMMY_USER_NAMES];
	const SLICED_ARRAY = DUMMY_USER_NAMES.slice(0);
	SLICED_ARRAY.splice(part1Index, 1);

	let randomUserNamePart1 = DUMMY_USER_NAMES[part1Index];

	let randomUserNamePart2 =
		SLICED_ARRAY[Math.floor(Math.random() * SLICED_ARRAY.length)];

	return randomUserNamePart1 + randomUserNamePart2;
}

const gameServer = defineServer({
	greet: false,
	// logger: ...,
	// routes: ...,

	transport: new WebSocketTransport({
		pingMaxRetries: 4,
		pingInterval: 3000,
		/* In bytes */
		maxPayload: 2048,
		perMessageDeflate: false,
		// TODO: verifyClient
	}),

	beforeListen: () => {
		logger.info("Initializing game server...");

		printDebugInfo();

		matchMaker.controller.exposedMethods = ["joinById", "reconnect"];
	},

	rooms: {
		test_room: defineRoom(
			TestRoom,
		)
			.on("create", (room) => console.log("room created:", room.roomId))
			.on("dispose", (room) => console.log("room disposed:", room.roomId))
			.on("join", (room, client) =>
				console.log(client.sessionId, "joined", room.roomId),
			)
			.on("leave", (room, client) =>
				console.log(client.sessionId, "left", room.roomId),
			),
	},

	// Middleware
	express: (app) => {
		logger.info("Initializing express...");

		app.use(compression());
		app.use(express.json({ limit: "100kb" }));

		/* More info about routings: https://expressjs.com/en/starter/basic-routing.html */
		app.get("/hello_world", (req, res) => {
			res.send("It's time to kick ass and chew bubblegum!");
		});

		app.get("/ping", (req, res) => {
			console.log(req.body);
			res.send("pong");
		});

		/**
		 * Playground
		 */
		if (process.env.SAMPLE !== "production") {
			app.use("/playground", playground());
		}

		app.post("/request_room", async (req, res) => {
			console.log("checking lobby");

			// TODO: reject malformed requests

			console.log(req.body);

			const requestedInstanceId: string = req.body.instance_id;

			await checkRoomAvailabilityForInstance(requestedInstanceId);

			console.log("requested instance id:", requestedInstanceId);

			res.send({})
		});

		/**
		 * It's recommended to protect this route with a password
		 * Read more: https://docs.colyseus.io/tools/monitoring#restrict-access-to-the-panel-using-a-password
		 */
		app.use("/monitor", monitor());

		// /**
		//  * See more about the Authentication Module:
		//  * https://docs.colyseus.io/auth/module#bind-the-auth-routes-to-express
		//  */
		// app.use(auth.prefix, auth.routes());
	},

	// presence: ..., // Redis
});

gameServer.onBeforeShutdown(async () => {
	logger.info("onBeforeShutdown called");
});
gameServer.onShutdown(async () => {
	logger.info("shutting down. bu-bye");
});


async function checkRoomAvailabilityForInstance(instanceId: string) {
	let doesRoomExist = matchMaker.getLocalRoomById(instanceId) != null;

	console.log("does room already exist?", doesRoomExist);

	if (!doesRoomExist) {
		await matchMaker.createRoom("test_room", {
			roomId: instanceId
		});
	}
}

function printDebugInfo() {
	logger.debug("OS: '%s'", process.env.OS);
	logger.debug("NODE_ENV: '%s'", process.env.NODE_ENV);
	logger.debug("SAMPLE: '%s'", process.env.SAMPLE);

	logger.debug(
		'Allowed room chars: "%s"',
		matchMaker.controller.allowedRoomNameChars.source,
	);
}

export { gameServer as server };
