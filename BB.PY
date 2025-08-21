from pathlib import Path
from zipfile import ZipFile

zip_path = Path("C:/Users/Alire/OneDrive/Desktop/alirezanorouziazad.github.io/academic-website-template-source.zip")
out_dir  = Path("C:/Users/Alire/OneDrive/Desktop/alirezanorouziazad.github.io")

out_dir.mkdir(parents=True, exist_ok=True)

with ZipFile(zip_path, "r") as zf:
    zf.extractall(out_dir)

print(f"Done! Extracted to: {out_dir.resolve()}")
