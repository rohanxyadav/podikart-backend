import ImageKit from 'imagekit';
import dotenv from 'dotenv';
dotenv.config();

const imagekit = new ImageKit({
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
    urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT
});

async function run() {
    try {
        const base64String = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII="; // 1x1 png
        const response = await imagekit.upload({
            file: base64String,
            fileName: 'test-image.png',
            folder: '/podikart/products'
        });
        console.log("Upload success:", response.url);
    } catch (error) {
        console.error("Upload failed:");
        console.error(error);
    }
}
run();
