from PIL import Image

try:
    img = Image.open('assets/images/levels/25d/sor2_level.png')
    img.thumbnail((300, 25))
    img.save('/tmp/sor2_thumb.png')
    print("Thumbnail saved to /tmp/sor2_thumb.png")
except Exception as e:
    print('Failed:', e)
