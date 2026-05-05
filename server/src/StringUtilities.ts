export abstract class StringUtilities {
	/**
	 * Calculates the hash value of a given string.
	 *
	 * @see {@link https://stackoverflow.com/a/7616484/16804863}
	 * @param str - The string to calculate the hash for.
	 * @returns The hash value of the string.
	 */
	public static getHash(str: string) {
		let hash = 0;
		if (str.length === 0) return hash;

		for (let i = 0; i < str.length; i++) {
			const char = str.charCodeAt(i);
			hash = (hash << 5) - hash + char;
			hash |= 0; // Convert to 32bit integer
		}

		return hash;
	}

	/**
	 * Returns the hue value for a given string.
	 *
	 * @param str - The string to convert to the hue value.
	 * @returns The hue value.
	 */
	public static getHueFromString(str: string): number {
		const hash = this.getHash(str);

		// Result will always be between -360 and 360 with the remainder operator
		const result = hash % 360;

		return result < 0 ? result + 360 : result;
	}
}

export default StringUtilities;
