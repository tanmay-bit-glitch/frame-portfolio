import os
import sys
from rembg import remove, new_session
from PIL import Image, ImageFilter, ImageOps
import numpy as np

source_path = "assets/source/portrait_original.jpg"
out_dir = "assets/cutout"
os.makedirs(out_dir, exist_ok=True)

print(f"Loading {source_path}...")
input_image = Image.open(source_path).convert("RGBA")

# Use u2net_human_seg or u2net for human portraits
print("Running rembg background removal with human segmentation...")
session = new_session("u2net_human_seg")
output_image = remove(
    input_image,
    session=session,
    alpha_matting=True,
    alpha_matting_foreground_threshold=240,
    alpha_matting_background_threshold=10,
    alpha_matting_erode_size=5,
    post_process_mask=True
)

raw_cutout_path = os.path.join(out_dir, "portrait_cutout_raw.png")
output_image.save(raw_cutout_path, "PNG")
print(f"Saved raw cutout: {raw_cutout_path} ({output_image.size[0]}x{output_image.size[1]})")

# Post-processing: defringe and subtle feather (<= 1px)
r, g, b, a = output_image.split()

# Defringe edges: smooth alpha slightly to avoid harsh pixel stepping
a_feathered = a.filter(ImageFilter.GaussianBlur(radius=0.5))
clean_cutout = Image.merge("RGBA", (r, g, b, a_feathered))

# Save master full-size cutout
clean_master_png = os.path.join(out_dir, "portrait_cutout_master.png")
clean_cutout.save(clean_master_png, "PNG")

# Export at specified widths: 1600, 1000, 600
widths = [1600, 1000, 600]
orig_w, orig_h = clean_cutout.size
aspect = orig_h / orig_w

for w in widths:
    h = int(w * aspect)
    resized = clean_cutout.resize((w, h), Image.Resampling.LANCZOS)
    
    png_path = os.path.join(out_dir, f"portrait_cutout_{w}.png")
    webp_path = os.path.join(out_dir, f"portrait_cutout_{w}.webp")
    
    resized.save(png_path, "PNG", optimize=True)
    resized.save(webp_path, "WEBP", quality=92, method=6)
    
    png_size = os.path.getsize(png_path)
    webp_size = os.path.getsize(webp_path)
    print(f"Width {w}px -> PNG: {png_size/1024:.1f} KB, WebP: {webp_size/1024:.1f} KB")

print("Cutout processing complete!")

