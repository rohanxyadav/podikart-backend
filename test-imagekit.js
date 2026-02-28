import ImageKit from 'imagekit';
import dotenv from 'dotenv';
dotenv.config();

try {
    const imagekit = new ImageKit({
        publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
        privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
        urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT
    });
    console.log("ImageKit initialized successfully!");
} catch (error) {
    console.error("Initialization error:", error);
}
