const { Jimp } = require('jimp');

async function removeWhite(filePath) {
    try {
        const image = await Jimp.read(filePath);
        
        image.scan(0, 0, image.bitmap.width, image.bitmap.height, function(x, y, idx) {
            const red = this.bitmap.data[idx + 0];
            const green = this.bitmap.data[idx + 1];
            const blue = this.bitmap.data[idx + 2];

            // The user stated the logo is ONLY green and black.
            // White/gray/light backgrounds will have high red AND high blue.
            // Green will have low red/blue, high green.
            // Black will have low everything.
            
            // If the pixel is fairly bright and lacks strong color saturation (i.e., it's a shade of white/gray)
            // Let's remove anything where red > 120 AND blue > 120 AND green > 120
            if (red > 120 && blue > 120 && green > 120) {
                this.bitmap.data[idx + 3] = 0; // set alpha to 0
            }
            // Also, to be safe, if it's a very light pixel even with some tint
            else if (red > 200 || blue > 200) {
                this.bitmap.data[idx + 3] = 0;
            }
        });
        
        await image.write(filePath);
        console.log(`Aggressively processed ${filePath}`);
    } catch (e) {
        console.error(`Error processing ${filePath}:`, e);
    }
}

async function run() {
    // Only run on the CRDB logo this time
    await removeWhite('../public/logos/crdb.png');
}

run();
