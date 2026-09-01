import re

path_gen = r"scripts/portfolio-cinema/generate-data.cjs"
with open(path_gen, "r", encoding="utf-8") as f:
    js = f.read()

# Add to KEY_MAP
js = js.replace(
    "'Description Fr': 'desc_fr',",
    "'Description Fr': 'desc_fr',\n    'Camera': 'camera',\n    'Lens': 'lens',\n    'Format': 'format',"
)

# Add to exported object
old_obj = """            status: info.status ? info.status.toLowerCase().trim() : '',
            link: info.link || '',
            desc: {"""
new_obj = """            status: info.status ? info.status.toLowerCase().trim() : '',
            link: info.link || '',
            camera: info.camera || '',
            lens: info.lens || '',
            format: info.format || '',
            desc: {"""
js = js.replace(old_obj, new_obj)

# Add directory path to exported object so we can locate BTS files later if needed
js = js.replace(
    "id: index + 100,",
    "id: index + 100,\n            folderPath: path.relative(PROJECTS_DIR, path.join(dir, 'BTS')).split(path.sep).join('/'),"
)

with open(path_gen, "w", encoding="utf-8") as f:
    f.write(js)
print("Generator updated.")
