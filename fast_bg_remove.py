import os
from PIL import Image

def remove_bg_and_crop(input_path):
    print(f"Processing {input_path}")
    try:
        img = Image.open(input_path).convert("RGBA")
        width, height = img.size
        pixels = img.load()
        
        # Get background color from top-left corner
        bg_color = pixels[0, 0]
        
        # If the background is already fully transparent, we just skip the floodfill
        if bg_color[3] != 0:
            print(f"Background color detected: {bg_color}")
            
            # Simple threshold matching to replace background color with transparent
            # This works well for flat white or blue backgrounds
            tolerance = 20
            
            for y in range(height):
                for x in range(width):
                    r, g, b, a = pixels[x, y]
                    if (abs(r - bg_color[0]) <= tolerance and
                        abs(g - bg_color[1]) <= tolerance and
                        abs(b - bg_color[2]) <= tolerance):
                        pixels[x, y] = (r, g, b, 0)
        
        # Find bounding box
        alpha = img.split()[-1]
        bbox = alpha.getbbox()
        
        if bbox:
            print(f"Cropping to {bbox}")
            img_cropped = img.crop(bbox)
            img_cropped.save(input_path, "PNG")
        else:
            print("Empty image, not cropping")
    except Exception as e:
        print(f"Error: {e}")

logos_dir = "C:/Users/SURFACE/Desktop/EmploymentEngine/public/logos"
files = ["crdb.png", "voda.png", "nmb.png", "mix.png"]

for file in files:
    remove_bg_and_crop(os.path.join(logos_dir, file))
    
print("All done!")
