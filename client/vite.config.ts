import { defineConfig, type UserConfig } from "vite";
// @ts-ignore
import { resolve } from "node:path";

// @ts-ignore
const proc: any = process;

const node_env_mode: string = proc.env.NODE_ENV;

const package_version = proc.env.npm_package_version.toString();

// switch (node_env_mode) {
// 	case "development":
// 		break;
// 	case "production":
// 		break;
// }

// https://vitejs.dev/config/
// https://vitejs.dev/config/server-options#server-host
export default defineConfig(({ mode }) => {
	const vite_env_mode = mode as
		| "development"
		| "staging"
		| "production"
		| undefined;

	/** Default is '/' */
	let basePath = "/";

	// switch (vite_env_mode) {
	// 	case "development":
	// 		break;
	// 	case "staging":
	// 		break;
	// 	case "production":
	// 		break;
	// }

	return {
		base: basePath,
		root: "./",
		envDir: "../",
		build: {
			outDir: "dist",
			commonjsOptions: {
				sourceMap: false,
			},
		},
		publicDir: "public",
		appType: "spa",
		// TODO: `esbuild`
		define: {
			__APP_VERSION__: JSON.stringify(package_version),
		},
		clearScreen: false,
		server: {
			// host: "http://localhost:5173/", // https://github.com/vitejs/vite/discussions/7620#discussioncomment-4168948
			//watch: null,
			port: 3000,
			proxy: {
				"/api": {
					target: "http://localhost:3001",
					changeOrigin: true,
					// TODO: only when embedded.
					// only way to check is through manual env
					secure: false,
					ws: true,
					rewrite: (path) => path.replace(/^\/api/, ""),
				},
			},
			//https: false,
			//origin:
			//warmup:
			// ws: false, // don't
			strictPort: true,
			middlewareMode: false,
			fs: {
				allow: [
					"./",
					"../server/src/rooms/schema",
				],
			},
			allowedHosts: [
				"localhost",
				".trycloudflare.com",
				".discordsays.com",
				".app.github.dev",
			],
			// allowedHosts: true //unsafe
			hmr: false,
			headers: {
				// TODO: only on debug
				// 'Cache-Control': 'no-store',
			},
		},
		dev: {
			sourcemap: {
				css: true,
				js: true,
			},
		},
		//cacheDir
	};
});
