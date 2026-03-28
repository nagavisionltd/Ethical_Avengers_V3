import cv2
import numpy as np
import sys
import collections

def analyze_fake_transparency(filepath):
    print(f"Analyzing {filepath}")
    img = cv2.imread(filepath, cv2.IMREAD_UNCHANGED)
    if img is None:
        print("Could not read image.")
        return
        
    print(f"Shape: {img.shape}")
    
    # Get color distribution to find the background pattern
    pixels = img.reshape(-1, img.shape[-1])
    # Convert to tuples for counting
    pixel_tuples = [tuple(p) for p in pixels]
    counts = collections.Counter(pixel_tuples)
    
    print("Top 10 most common colors (B, G, R, [A]):")
    top_colors = counts.most_common(10)
    for color, count in top_colors:
        percentage = (count / len(pixels)) * 100
        print(f"  Color {color}: {count} pixels ({percentage:.2f}%)")

if __name__ == "__main__":
    filepath = sys.argv[1]
    analyze_fake_transparency(filepath)
