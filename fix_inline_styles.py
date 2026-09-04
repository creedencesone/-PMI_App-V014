#!/usr/bin/env python3
"""
Replace inline CSS styles in proyecto.html with utility classes,
and replace the <style> block with a <link> to styles.css.
"""

import re

INPUT  = '/Users/albertoalbaalarco/Desktop/PMI_App/proyecto.html'
OUTPUT = '/Users/albertoalbaalarco/Desktop/PMI_App/proyecto.html'

with open(INPUT, 'r', encoding='utf-8') as f:
    html = f.read()

total = 0

def sub(regex, replacement, text):
    """Run re.sub, return (new_text, count)."""
    new_text, repl_count = re.subn(regex, replacement, text)
    return new_text, repl_count

# ─── 1. Replace <style>…</style> with <link> ─────────────────────────────────
html, cnt = sub(
    r'<style>.*?</style>',
    '<link rel="stylesheet" href="styles.css">',
    html,
)
# Only replace first occurrence (the main block)
# re.subn replaces all — redo with count=1 via re.sub
with open(INPUT, 'r', encoding='utf-8') as f:
    html = f.read()

html = re.sub(r'<style>.*?</style>', '<link rel="stylesheet" href="styles.css">', html, count=1, flags=re.DOTALL)
print("Replaced <style> block with <link>")

# ─── 2. Attribute-level substitutions ────────────────────────────────────────
# Each entry: (regex for style="...", replacement class string)
ATTR_SUBS = [
    # cards-grid 4 cols
    (r'style="grid-template-columns:\s*repeat\(4,\s*1fr\);\s*margin-bottom:\s*24px;"', 'class="u-mb-24 cards-grid-4"'),
    (r'style="margin-bottom:\s*24px;\s*grid-template-columns:\s*repeat\(4,\s*1fr\);"', 'class="u-mb-24 cards-grid-4"'),
    # cards-grid 2 cols
    (r'style="grid-template-columns:\s*repeat\(2,\s*1fr\);\s*margin-bottom:\s*24px;"', 'class="u-mb-24 cards-grid-2"'),
    (r'style="margin-bottom:\s*24px;\s*grid-template-columns:\s*repeat\(2,\s*1fr\);"', 'class="u-mb-24 cards-grid-2"'),

    # value-card colour variants (exact matches, no trailing space variance)
    (r'style="background:\s*linear-gradient\(135deg,\s*rgba\(0,\s*122,\s*255,\s*0\.3\),\s*rgba\(0,\s*85,\s*204,\s*0\.15\)\);"', 'class="vc-blue-lg"'),
    (r'style="background:\s*linear-gradient\(135deg,\s*rgba\(0,\s*122,\s*255,\s*0\.2\),\s*rgba\(0,\s*90,\s*158,\s*0\.1\)\);"', 'class="vc-blue-alt"'),
    (r'style="background:\s*linear-gradient\(135deg,\s*rgba\(0,\s*122,\s*255,\s*0\.2\),\s*rgba\(0,\s*85,\s*204,\s*0\.1\)\);"', 'class="vc-blue"'),
    (r'style="background:\s*linear-gradient\(135deg,\s*rgba\(52,\s*199,\s*89,\s*0\.2\),\s*rgba\(40,\s*159,\s*68,\s*0\.1\)\);"', 'class="vc-green"'),
    (r'style="background:\s*linear-gradient\(135deg,\s*rgba\(255,\s*140,\s*0,\s*0\.2\),\s*rgba\(230,\s*126,\s*0,\s*0\.1\)\);"', 'class="vc-orange"'),
    (r'style="background:\s*linear-gradient\(135deg,\s*rgba\(255,\s*59,\s*48,\s*0\.2\),\s*rgba\(204,\s*47,\s*37,\s*0\.1\)\);"', 'class="vc-red"'),
    (r'style="background:\s*linear-gradient\(135deg,\s*rgba\(156,\s*39,\s*176,\s*0\.2\),\s*rgba\(123,\s*31,\s*162,\s*0\.1\)\);"', 'class="vc-purple"'),
    (r'style="background:\s*linear-gradient\(135deg,\s*rgba\(255,\s*204,\s*0,\s*0\.2\),\s*rgba\(204,\s*163,\s*0,\s*0\.1\)\);"', 'class="vc-yellow"'),
    (r'style="background:\s*linear-gradient\(135deg,\s*rgba\(26,\s*42,\s*58,\s*0\.5\),\s*rgba\(15,\s*26,\s*36,\s*0\.3\)\);"', 'class="vc-dark"'),
    (r'style="background:\s*linear-gradient\(135deg,\s*rgba\(224,\s*60,\s*49,\s*0\.2\),\s*rgba\(192,\s*53,\s*43,\s*0\.1\)\);"', 'class="vc-dark-red"'),
    (r'style="background:\s*linear-gradient\(135deg,\s*rgba\(0,\s*168,\s*89,\s*0\.2\),\s*rgba\(0,\s*136,\s*68,\s*0\.1\)\);"', 'class="vc-lime"'),

    # info-card with gradient backgrounds
    (r'style="margin-top:\s*16px;\s*background:\s*linear-gradient\(135deg,\s*rgba\(0,122,255,0\.1\),\s*rgba\(0,85,204,0\.05\)\);"', 'class="info-card-blue info-card-mt16"'),
    (r'style="background:\s*linear-gradient\(135deg,\s*rgba\(0,122,255,0\.1\),\s*rgba\(0,85,204,0\.05\)\);"', 'class="info-card-blue"'),
    (r'style="background:\s*linear-gradient\(135deg,\s*rgba\(156,39,176,0\.15\),\s*rgba\(123,31,162,0\.08\)\);"', 'class="info-card-purple"'),

    # info-card center (salud semaforo card)
    (r'style="text-align:\s*center;\s*margin-bottom:\s*24px;\s*background:\s*linear-gradient\(135deg,\s*rgba\(0,0,0,0\.3\),\s*rgba\(0,0,0,0\.2\)\);"', 'class="info-card-center"'),

    # Tab bar container
    (r'style="display:\s*flex;\s*gap:\s*8px;\s*margin-bottom:\s*20px;\s*border-bottom:\s*0\.5px\s+solid\s+rgba\(255,255,255,0\.1\);\s*flex-wrap:\s*wrap;"',
     'class="u-tab-bar"'),

    # Active tab btn
    (r'style="color:\s*#007AFF;\s*border-bottom:\s*2px\s+solid\s+#007AFF;"', 'class="btn-tab-active"'),

    # Action row
    (r'style="margin-top:\s*12px;\s*display:\s*flex;\s*gap:\s*8px;"', 'class="u-action-row"'),
    (r'style="display:\s*flex;\s*gap:\s*8px;\s*margin-top:\s*12px;"', 'class="u-action-row"'),

    # canvas max-height
    (r'style="max-height:\s*300px;"', 'class="u-canvas-300"'),
    (r'style="max-height:\s*350px;"', 'class="u-canvas-350"'),

    # display: none (subpanels, modals)
    (r'style="display:\s*none;"', 'class="u-hidden"'),

    # flex sizes on form-group divs
    (r'style="flex:\s*1;"',    'class="u-flex-1"'),
    (r'style="flex:\s*0\.5;"', 'class="u-flex-half"'),
    (r'style="flex:\s*2;"',    'class="u-flex-2"'),

    # text-align center on td/div/span
    (r'style="text-align:\s*center;"', 'class="u-text-center"'),
    (r'style="text-align:center;"',    'class="u-text-center"'),

    # width: 100%
    (r'style="width:\s*100%;"', 'class="u-w-full"'),

    # modal max-width
    (r'style="max-width:\s*550px;"', 'class="modal-sm"'),
    (r'style="max-width:\s*700px;"', 'class="modal-md"'),

    # margin-left 8px
    (r'style="margin-left:\s*8px;"', 'class="u-mt-ml-8"'),

    # font-size + line-height
    (r'style="font-size:\s*13px;\s*line-height:\s*1\.6;"', 'class="u-fs-13 u-lh-16"'),

    # select full width
    (r'style="width:\s*100%;\s*padding:\s*8px;\s*border-radius:\s*8px;"', 'class="select-full"'),

    # Simple margin-bottoms / margin-tops (single declarations)
    (r'style="margin-bottom:\s*24px;"', 'class="u-mb-24"'),
    (r'style="margin-bottom:\s*20px;"', 'class="u-mb-20"'),
    (r'style="margin-bottom:\s*16px;"', 'class="u-mb-16"'),
    (r'style="margin-bottom:\s*12px;"', 'class="u-mb-12"'),
    (r'style="margin-top:\s*24px;"',    'class="u-mt-24"'),
    (r'style="margin-top:\s*16px;"',    'class="u-mt-16"'),
    (r'style="margin-top:\s*12px;"',    'class="u-mt-12"'),
    (r'style="margin-top:\s*8px;"',     'class="u-mt-8"'),
    (r'style="margin-bottom:\s*8px;"',  'class="u-mb-8"'),

    # btn with margin-top 16
    (r'style="margin-top:\s*16px;"', 'class="u-mt-16"'),
]

for pat, replacement in ATTR_SUBS:
    new_html, count = sub(pat, replacement, html)
    if count:
        print(f"  [{count:3d}x] {pat[:60]}...")
        total += count
        html = new_html

# ─── 3. Full-element substitutions ───────────────────────────────────────────
ELEMENT_SUBS = [
    # <hr style="...">
    (r'<hr\s+style="border-color:\s*rgba\(255,\s*255,\s*255,\s*0\.1\);\s*margin:\s*16px\s+0;">',
     '<hr class="u-hr">'),
    (r'<hr\s+style="border-color:\s*rgba\(255,255,255,0\.1\);\s*margin:\s*16px\s+0;">',
     '<hr class="u-hr">'),
    (r'<hr\s+style="border-color:\s*rgba\(255,\s*255,\s*255,\s*0\.1\);\s*margin:\s*12px\s+0;">',
     '<hr class="u-hr u-hr-sm">'),
    (r'<hr\s+style="border-color:\s*rgba\(255,255,255,0\.1\);\s*margin:\s*12px\s+0;">',
     '<hr class="u-hr u-hr-sm">'),

    # <p style="font-size: 12px;">
    (r'<p\s+style="font-size:\s*12px;">', '<p class="u-p-sm">'),
    (r'<p\s+style="font-size:\s*11px;">', '<p class="u-fs-11">'),
    (r'<p\s+style="font-size:\s*11px;\s*color:\s*rgba\(255,\s*255,\s*255,\s*0\.5\);\s*margin-top:\s*4px;">',
     '<p class="u-p-xs">'),
    # info text in dark colour muted
    (r'<p\s+style="font-size:\s*12px;\s*color:\s*rgba\(255,255,255,0\.5\);">', '<p class="u-p-sm u-color-muted">'),

    # <h4 style="font-size: 13px; margin-bottom: 12px;">
    (r'<h4\s+style="font-size:\s*13px;\s*margin-bottom:\s*12px;">', '<h4 class="u-section-title">'),
]

for pat, replacement in ELEMENT_SUBS:
    new_html, count = sub(pat, replacement, html)
    if count:
        print(f"  [{count:3d}x] element: {pat[:60]}...")
        total += count
        html = new_html

# ─── 4. Handle class="..." + style="..." merges ──────────────────────────────
# When an element already has class="foo" and we left a style="...", convert it
# Pattern: class="X" style="Y" → class="X Y" (when Y maps to a utility class)
MERGE_MAP = {
    'u-hidden': 'display: none;',
    'u-flex-1': 'flex: 1;',
    'u-flex-half': 'flex: 0.5;',
    'u-mb-24': 'margin-bottom: 24px;',
    'u-mb-16': 'margin-bottom: 16px;',
    'u-mt-16': 'margin-top: 16px;',
    'u-mt-24': 'margin-top: 24px;',
    'u-canvas-300': 'max-height: 300px;',
    'u-canvas-350': 'max-height: 350px;',
    'u-text-center': 'text-align: center;',
    'u-w-full': 'width: 100%;',
}

# For remaining style="" attributes where class="" already exists, try to merge
def merge_class_style(m):
    """Replace style="X" with class additions if X is known."""
    tag_open = m.group(0)
    # extract existing class
    cls_match = re.search(r'class="([^"]*)"', tag_open)
    style_match = re.search(r'style="([^"]*)"', tag_open)
    if not cls_match or not style_match:
        return tag_open
    existing_cls = cls_match.group(1)
    style_val = style_match.group(1).strip().rstrip(';')

    for util_cls, css_val in MERGE_MAP.items():
        if css_val.rstrip(';') in style_val:
            new_tag = tag_open.replace(f'style="{style_match.group(1)}"', '')
            new_tag = new_tag.replace(f'class="{existing_cls}"', f'class="{existing_cls} {util_cls}"')
            return new_tag
    return tag_open

# Apply merge on elements that have BOTH class and style
html, count = sub(
    r'<(?:div|span|button|canvas|select|input|td|th)[^>]+class="[^"]*"[^>]+style="[^"]*"[^>]*>',
    merge_class_style,
    html
)
total += count
if count:
    print(f"  [{count:3d}x] merged class+style attributes")

with open(OUTPUT, 'w', encoding='utf-8') as f:
    f.write(html)

print(f"\n✅ Done. Total substitutions applied: {total}")
