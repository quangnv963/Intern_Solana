// import EncryptRsa from 'encrypt-rsa';
// import fs from 'mz/fs';

// export async function readFile(
//     path
// ){

//     // Get our program public key
//     return await fs.readFile(path, {encoding: 'utf-8'});
// }

export function encrypt(text) {
	let etext = '';
	const num = 5;
	for (let i = 0; i < text.length; i++) {
		etext += String.fromCharCode(text.charCodeAt(i) + 1 + (i % (num + i)));
	}
	return etext;
}

