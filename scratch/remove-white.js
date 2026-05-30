const { Jimp } = require('jimp');

async function removeWhite(filePath) {
    try {
        const image = await Jimp.read(filePath);
        
        image.scan(0, 0, image.bitmap.width, image.bitmap.height, function(x, y, idx) {
            const red = this.bitmap.data[idx + 0];
            const green = this.bitmap.data[idx + 1];
            const blue = this.bitmap.data[idx + 2];
            const alpha = this.bitmap.data[idx + 3];

            // If it's a white-ish pixel
            if (red > 230 && green > 230 && blue > 230) {
                this.bitmap.data[idx + 3] = 0; // set alpha to 0 (transparent)
            }
        });
        
        await image.write(filePath);
        console.log(`Processed ${filePath}`);
    } catch (e) {
        console.error(`Error processing ${filePath}:`, e);
    }
}

async function run() {
    await removeWhite('../public/logos/crdb.png');
    await removeWhite('../public/logos/nmb.png');
}

run();
