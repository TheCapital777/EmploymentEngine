import sys
import os

try:
    from rembg import remove
    from PIL import Image
except ImportError:
    print("Dependencies not installed yet.")
    sys.exit(1)

def process_image(input_path, output_path):
    print(f"Processing {input_path}...")
    try:
        # Load image
        input_img = Image.open(input_path).convert("RGBA")
        
        # Determine if we should remove background
        # Let's just run rembg on it to be safe and get a clean alpha mask
        with open(input_path, 'rb') as f:
            input_bytes = f.read()
        
        output_bytes = remove(input_bytes)
        
        # Save temp output
        temp_path = input_path + ".tmp.png"
        with open(temp_path, 'wb') as f:
            f.write(output_bytes)
            
        # Now load with PIL and crop to bounding box
        img = Image.open(temp_path).convert("RGBA")
        
        # getbbox() finds the bounding box of the non-zero regions in the image
        # We use the alpha channel
        alpha = img.split()[-1]
        bbox = alpha.getbbox()
        
        if bbox:
            print(f"Original size: {img.size}, Bounding box: {bbox}")
            # Crop to bbox
            img_cropped = img.crop(bbox)
            img_cropped.save(output_path, "PNG")
            print(f"Saved {output_path} with size {img_cropped.size}")
        else:
            print("Empty bounding box, saving original")
            img.save(output_path, "PNG")
            
        os.remove(temp_path)
    except Exception as e:
        print(f"Error processing {input_path}: {e}")

logos_dir = "C:/Users/SURFACE/Desktop/EmploymentEngine/public/logos"
files = ["crdb.png", "voda.png", "nmb.png", "mix.png"]

for file in files:
    input_p = os.path.join(logos_dir, file)
    process_image(input_p, input_p)
    
print("Done!")
