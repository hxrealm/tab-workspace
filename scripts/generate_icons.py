from PIL import Image, ImageDraw, ImageFont
import math

def create_icon(size, output_path):
    img = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)

    # Background circle
    padding = int(size * 0.08)
    r = size - 2 * padding
    cx, cy = size // 2, size // 2

    # Draw rounded rectangle background (warm gradient effect)
    bg_color = (232, 168, 124, 255)  # accent color
    radius = int(size * 0.15)

    # Main background
    draw.rounded_rectangle([padding, padding, size - padding, size - padding],
                          radius=radius, fill=bg_color)

    # Draw tab icon shape (simplified tab with lines)
    tab_padding = int(size * 0.22)
    tab_w = size - 2 * tab_padding
    tab_h = int(size * 0.35)
    tab_x = tab_padding
    tab_y = int(size * 0.25)

    # Tab shape
    white = (255, 255, 255, 255)
    line_color = (92, 74, 61, 255)  # text color

    draw.rounded_rectangle([tab_x, tab_y, tab_x + tab_w, tab_y + tab_h],
                          radius=int(size * 0.06), fill=white, outline=line_color, width=max(1, size // 32))

    # Tab lines (representing text/content)
    line_gap = int(size * 0.08)
    line_h = max(1, size // 16)
    line_width = int(tab_w * 0.6)

    # First line
    y1 = tab_y + int(size * 0.1)
    draw.rounded_rectangle([tab_x + int(size * 0.1), y1,
                           tab_x + int(size * 0.1) + line_width, y1 + line_h],
                          radius=line_h // 2, fill=line_color)

    # Second line
    y2 = y1 + line_gap + line_h
    line_width2 = int(tab_w * 0.4)
    draw.rounded_rectangle([tab_x + int(size * 0.1), y2,
                           tab_x + int(size * 0.1) + line_width2, y2 + line_h],
                          radius=line_h // 2, fill=line_color)

    # Second tab (smaller, overlapping)
    tab2_w = int(tab_w * 0.8)
    tab2_h = int(tab_h * 0.7)
    tab2_x = int(size * 0.28)
    tab2_y = int(size * 0.42)

    alpha_bg = int(255 * 0.85)
    light_bg = (255, 255, 255, alpha_bg)

    draw.rounded_rectangle([tab2_x, tab2_y, tab2_x + tab2_w, tab2_y + tab2_h],
                          radius=int(size * 0.05), fill=light_bg, outline=line_color, width=max(1, size // 32))

    # Mini lines on second tab
    mini_h = max(1, size // 20)
    my1 = tab2_y + int(size * 0.12)
    draw.rounded_rectangle([tab2_x + int(size * 0.1), my1,
                           tab2_x + int(size * 0.1) + int(tab2_w * 0.5), my1 + mini_h],
                          radius=mini_h // 2, fill=line_color)

    img.save(output_path, 'PNG')
    print(f"Created {output_path} ({size}x{size})")

create_icon(16, 'public/icons/icon16.png')
create_icon(32, 'public/icons/icon32.png')
create_icon(48, 'public/icons/icon48.png')
create_icon(128, 'public/icons/icon128.png')
