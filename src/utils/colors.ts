
export function colorPicker(): string {
	const colorA = Math.floor(Math.random() * 256).toString(16).padStart(2, '0');
	const colorB = Math.floor(Math.random() * 256).toString(16).padStart(2, '0');
	const colorC = Math.floor(Math.random() * 256).toString(16).padStart(2, '0');

	return `#${colorA}${colorB}${colorC}`;
}