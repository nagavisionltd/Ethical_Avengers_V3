from PIL import Image

try:
    img = Image.open('assets/images/levels/25d/tmnt_street_level.png')
    img.thumbnail((300, 25))
    img.save('/tmp/tmnt_thumb.png')
    print("Thumbnail saved to /tmp/tmnt_thumb.png")
except Exception as e:
    print('Failed:', e)
