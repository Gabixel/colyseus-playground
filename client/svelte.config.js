import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";

// https://github.com/sveltejs/vite-plugin-svelte
// https://github.com/sveltejs/vite-plugin-svelte/blob/main/docs/config.md
// https://github.com/sveltejs/vite-plugin-svelte/blob/main/docs/inspector.md
/** @type {import('@sveltejs/vite-plugin-svelte').SvelteConfig} */
export default {
	preprocess: vitePreprocess(),
	vitePlugin: {
		//hot: false, // deprecated
		inspector: false, //alt-x
		ignorePluginPreprocessors: true,
	},
	compilerOptions: {
		hmr: false,
		dev: true,
		preserveComments: false,
		preserveWhitespace: false,
		discloseVersion: false,
	},
	extensions: [".svelte"],
};
