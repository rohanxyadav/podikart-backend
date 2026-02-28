import 'dotenv/config';
import ImageKit from '@imagekit/nodejs';

const ik = new ImageKit({ privateKey: process.env.IMAGEKIT_PRIVATE_KEY });
const b64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=';
const r = await ik.upload({ file: b64, fileName: 'test-final-' + Date.now() + '.png', folder: '/test' });
console.log('SUCCESS:', r.url);
