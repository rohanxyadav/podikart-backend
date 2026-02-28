import fetch from 'node-fetch';

async function testUpload() {
    try {
        // Need a valid token to test the protected /api/products route
        // Assuming we can generate a test payload without image first
        const payload = new FormData();
        payload.append('name', 'Test Error Capture');
        payload.append('slug', 'test-error-capture-' + Date.now());
        payload.append('category', 'spicy-podis');
        // If we hit a 500, we want to read the new error payload.

        console.log("We need an auth token to hit the POST /api/products endpoint.");
        console.log("Will check MongoDB validation rules and image middleware instead.");

    } catch (e) {
        console.error(e);
    }
}
testUpload();
