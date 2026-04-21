#!/usr/bin/env python3
"""Generate TTS audio for all question prompts using edge-tts."""

import asyncio
import json
import os
import re

import edge_tts

VOICE = "en-US-AriaNeural"  # Friendly, energetic female voice
RATE = "+10%"  # Slightly faster for game energy
PITCH = "+5Hz"  # Slightly higher pitch for playfulness
OUTPUT_DIR = "public/audio/prompts"

def prompt_to_filename(prompt):
    """Convert prompt text to a safe filename."""
    # e.g. "CHOOSE YOUR BED" -> "choose_your_bed.mp3"
    return re.sub(r'[^a-z0-9]+', '_', prompt.lower()).strip('_') + '.mp3'

async def generate_one(prompt, filepath):
    """Generate a single TTS file."""
    # Make the text more natural: "Choose Your Bed!" instead of "CHOOSE YOUR BED"
    text = prompt.title() + "!"
    communicate = edge_tts.Communicate(text, VOICE, rate=RATE, pitch=PITCH)
    await communicate.save(filepath)

async def main():
    with open("src/data/questions.json") as f:
        data = json.load(f)

    prompts = sorted(set(q["prompt"] for q in data["questions"]))
    print(f"Generating TTS for {len(prompts)} prompts...")

    os.makedirs(OUTPUT_DIR, exist_ok=True)

    for i, prompt in enumerate(prompts):
        filename = prompt_to_filename(prompt)
        filepath = os.path.join(OUTPUT_DIR, filename)

        if os.path.exists(filepath):
            print(f"  [{i+1}/{len(prompts)}] SKIP {filename}")
            continue

        print(f"  [{i+1}/{len(prompts)}] {filename}")
        await generate_one(prompt, filepath)

    # Generate a mapping file for the app to use
    mapping = {}
    for prompt in prompts:
        mapping[prompt] = f"/audio/prompts/{prompt_to_filename(prompt)}"

    with open(os.path.join(OUTPUT_DIR, "manifest.json"), "w") as f:
        json.dump(mapping, f, indent=2)

    print(f"\nDone! Generated {len(prompts)} files + manifest.json")

if __name__ == "__main__":
    asyncio.run(main())
