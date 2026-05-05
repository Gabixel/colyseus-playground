import { ArraySchema, schema, SchemaType } from "@colyseus/schema";

export const PlayingUser = schema({
	playerId: {
		type: "string",
		default: undefined,
	},
});
export type PlayingUserEntity = SchemaType<typeof PlayingUser>;

export const GameData = schema({
	playingUsers: {
		type: [PlayingUser],
		default: new ArraySchema<PlayingUserEntity>(),
	},
});
export type GameDataEntity = SchemaType<typeof GameData>;

export const TestState = schema({
	gameData: {
		type: GameData,
		// default: new GameData(),
	},
});
export type TestStateEntity = SchemaType<typeof TestState>;
