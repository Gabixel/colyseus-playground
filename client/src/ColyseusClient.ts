// @ts-ignore
import { server } from "../../server/src/app.config";
// @ts-ignore
import { type TestRoom } from "../../server/src/TestRoom";
import { Client, type Room, type EndpointSettings } from "@colyseus/sdk";

const colyseusConnectionData: EndpointSettings = {
	hostname: location.host,
	pathname: `/api`,
	secure: location.protocol === "https:",
};

/** The room ID */
const TEST_INSTANCE_ID = "123";

type GameFrontendClient = Client<typeof server>;

export class ColyseusClient {
	private _clientSDK: GameFrontendClient;

	private _room: TestRoom | null = null;

	public get room() {
		if (this._room == null) {
			throw new Error(`Can't get room. Currently is "${typeof this._room}"`);
		}

		return this._room;
	}

	constructor() {
		this._clientSDK = new Client<typeof server>(colyseusConnectionData, {
			urlBuilder(url) {
				return url.href;
			},
		});
	}

	public async requestRoom() {
		// Retrieve approval and user data from server
		const { data } = await this._clientSDK.http.post("/request_room", {
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				instance_id: TEST_INSTANCE_ID,
			}),
		});
	}

	public async connectToLobby(roomId: string = TEST_INSTANCE_ID) {
		let room = await this._clientSDK.joinById(roomId);

		room.reconnection.maxRetries = 10;
		room.reconnection.maxDelay = 10000; // 10 seconds max delay
		room.reconnection.minUptime = 3000; // Allow reconnection after 3 seconds
		room.reconnection.backoff = (attempt: number, delay: number) => {
			return Math.floor(Math.pow(2, attempt) * delay);
		};

		this._room = room;

		return this._room;
	}

	// TODO: unused, for now. Needs testing
	// public async reconnectToLobby() {
	// 	if (this._room == null) {
	// 		return;
	// 	}

	// 	let room = await this._clientSDK.reconnect(
	// 		this._room.reconnectionToken
	// 	);

	// 	this._room = room;

	// 	return room;
	// }
}

export default ColyseusClient;
