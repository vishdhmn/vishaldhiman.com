#!/usr/bin/env python3
"""Generate/enhance an image via Gemini image models.

Usage:
  gen_image.py --out OUT.png --prompt "..." [--ref a.png --ref b.png] [--model gemini-3-pro-image]

- With --ref images, Gemini edits/composes from them (enhance/recreate).
- Without --ref, pure text-to-image generation.
Reads GEMINI_API_KEY from env.
"""
import argparse, base64, json, mimetypes, os, sys, urllib.request

API = "https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent?key={key}"

def b64_image(path):
    mime = mimetypes.guess_type(path)[0] or "image/png"
    with open(path, "rb") as f:
        return mime, base64.b64encode(f.read()).decode()

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--out", required=True)
    ap.add_argument("--prompt", required=True)
    ap.add_argument("--ref", action="append", default=[])
    ap.add_argument("--model", default="gemini-3-pro-image")
    args = ap.parse_args()

    key = os.environ.get("GEMINI_API_KEY")
    if not key:
        sys.exit("GEMINI_API_KEY not set")

    parts = [{"text": args.prompt}]
    for r in args.ref:
        mime, data = b64_image(r)
        parts.append({"inline_data": {"mime_type": mime, "data": data}})

    body = {
        "contents": [{"parts": parts}],
        "generationConfig": {"responseModalities": ["IMAGE"]},
    }
    url = API.format(model=args.model, key=key)
    req = urllib.request.Request(url, data=json.dumps(body).encode(),
                                headers={"Content-Type": "application/json"})
    try:
        resp = urllib.request.urlopen(req, timeout=180)
    except urllib.error.HTTPError as e:
        sys.exit(f"HTTP {e.code}: {e.read().decode()[:500]}")

    out = json.loads(resp.read())
    cands = out.get("candidates", [])
    if not cands:
        sys.exit(f"No candidates: {json.dumps(out)[:500]}")
    for part in cands[0].get("content", {}).get("parts", []):
        inline = part.get("inline_data") or part.get("inlineData")
        if inline:
            os.makedirs(os.path.dirname(os.path.abspath(args.out)), exist_ok=True)
            with open(args.out, "wb") as f:
                f.write(base64.b64decode(inline["data"]))
            print(f"OK {args.out} ({os.path.getsize(args.out)} bytes)")
            return
    sys.exit(f"No image in response: {json.dumps(out)[:500]}")

if __name__ == "__main__":
    main()
