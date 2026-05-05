export abstract class ColorUtilities {
	/**
	 * @author ChatGPT
	 */
	public static rgbToHue(r: number, g: number, b: number) {
		// Normalize
		r /= 255;
		g /= 255;
		b /= 255;

		const max = Math.max(r, g, b);
		const min = Math.min(r, g, b);
		const delta = max - min;

		let hue;

		if (delta === 0) hue = 0;
		else if (max === r) hue = ((g - b) / delta) % 6;
		else if (max === g) hue = (b - r) / delta + 2;
		else hue = (r - g) / delta + 4;

		hue = Math.round(hue * 60);
		if (hue < 0) hue += 360;

		return hue;
	}

	public static randomHue(min = 0, max = 360): number {
		return randomMinMax(min, max);
	}
}

function randomMinMax(min: number, max: number): number {
	return Math.floor(Math.random() * (max - min + 1) + min);
}

export default ColorUtilities;
