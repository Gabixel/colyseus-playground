import {
	Client,
	Messages,
	Room,
	type RoomException,
	type RoomMethodName,
} from "@colyseus/core";
import {
	GameData,
	type GameDataEntity,
	PlayingUser,
	type PlayingUserEntity,
	TestState,
	type TestStateEntity,
} from "./schema/TestRoomState";
import { StateView } from "@colyseus/schema";

export class TestRoom extends Room<{
	state: TestStateEntity;
}> {
	state = new TestState();

	maxClients = 20;

	patchRate = 500;

	messages = {
		"*": (client: Client, type: string | number, payload: any) => {
			console.log(
				"message '%s' requested by %s\ndata:",
				type,
				client.sessionId,
				payload,
			);
		},
		"create-users-schema": (
			client: Client,
			messageType: string,
			payload: void,
		) => {
			console.log("creating playingUsers data");
			this.createPlayingUsersData();
		},
	};

	private _playingUsersByPlayerId: Map<string, PlayingUserEntity> = new Map();

	private createPlayingUsersData() {
		console.log(this.clients.length);
		for (const client of this.clients) {
			let playingUser = new PlayingUser();

			// session id isn't really that permanent, but this is just for demo purposes
			playingUser.playerId = client.sessionId;

			this._playingUsersByPlayerId.set(client.sessionId, playingUser);

			this.state.gameData.playingUsers.push(playingUser);
		}
	}

	private _disposeTimeout = 60;
	onCreate(options: any): void | Promise<any> {
		this.roomId = options.roomId;

		this["resetAutoDisposeTimeout"](this._disposeTimeout);

		this.state.gameData = new GameData();
	}

	onJoin(client: Client<any>, options?: any, auth?: any): void | Promise<any> {
		console.log(`user ${client.sessionId} join`);

		client.view = new StateView();
	}

	onLeave(client: Client<any>, code?: number): void | Promise<any> {}

	onReconnect(client: Client<any>): void | Promise<any> {}

	onBeforePatch(state: object): void | Promise<any> {
		// console.log("sending patch");
	}

	onDispose() {
		console.log("disposing room", this.roomId);
	}

	onUncaughtException(error: RoomException, methodName: RoomMethodName): void {
		console.error("An error ocurred in", methodName, ":", error);
	}

	// Some junk from previous attempts
	/*

	// private _cardsByCardId: Map<string, CardEntity> = new Map();

	// private doQuirkyStuff() {
	// 	let cardsToPlay: {
	// 		playerId: string;
	// 		card: CardEntity;
	// 	}[] = [];

	// 	for (const [playerId, playingUser] of this._playingUsersByPlayerId) {
	// 		// let card = this._cardsByCardId.get(playingUser.pickingCard.cardId)!;

	// 		cardsToPlay.push({
	// 			playerId,
	// 			card: playingUser.pickingCard,
	// 		});

	// 		// let client = this.clients.getById(playerId)!;
	// 		// client.view!.remove(card);

	// 		this.state.gameData.publicCards.push(playingUser.pickingCard);

	// 		// // @ts-ignore
	// 		// playingUser.pickingCard = undefined;
	// 	}

	// 	for (const cardDataToPlay of cardsToPlay) {
	// 		// this.state.gameData.publicCards.push(cardDataToPlay.card);

	// 		for (const [playerId, playingUser] of this._playingUsersByPlayerId) {
	// 			let client = this.clients.getById(playerId)!;

	// 			// ---- The bug seems to occur here --------|
	// 			if (playerId === cardDataToPlay.playerId) {
	// 				client.view!.remove(cardDataToPlay.card);

	// 				// @ts-ignore
	// 				// playingUser.pickingCard = undefined;
	// 			}

	// 			// client.view!.add(cardDataToPlay.card, -1); // group -1
	// 			client.view!.add(cardDataToPlay.card);
	// 		}
	// 	}

	// 	// // loop again to assign all cards to everyone's state view (with a specific tag)
	// 	// for (const [playerId, playingUser] of this._playingUsersByPlayerId) {
	// 	// 	let client = this.clients.getById(playerId)!;

	// 	// 	for (const card of cardsToPlay) {
	// 	// 		client.view!.add(card, 1);
	// 	// 	}
	// 	// }

	// 	// this.state.gameData.publicCards.push(...cardsToPlay)
	// }
	*/
}

export default TestRoom;
