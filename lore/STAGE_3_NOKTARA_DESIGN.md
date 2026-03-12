### Stage 3: Noktara (Realm of Shadow Memory)
#### Intro Cutscene Script
The camera pans over a monochrome cityscape, the streets filled with the shadows of forgotten memories. Naga Soul and Dr. Jack stand atop a rooftop, gazing out over the city.
```markdown
Naga Soul: (voice low and mysterious) "This is Noktara, a realm where memories manifest as shadows. The Collective Memory is strong here."
Dr. Jack: (looking around cautiously) "And where the shadows hide the truth. We need to be careful, Naga. The False Historian is known to manipulate memories."
Naga Soul: (eyes narrowing) "We'll uncover the truth, no matter how distorted it may be. Let's move out, Dr. Jack."
```
The camera zooms out as they leap off the rooftop, into the shadows below.

#### Enemy Waves
```json
{
  "waves": [
    {
      "x": 100,
      "count": 5,
      "enemyType": "shadow_phantom"
    },
    {
      "x": 400,
      "count": 3,
      "enemyType": "memory_wraith"
    },
    {
      "x": 700,
      "count": 2,
      "enemyType": "forgotten_specter"
    }
  ]
}
```
These enemy waves will challenge the players as they navigate the noir cityscape, with increasing difficulty and variety.

#### Boss Phase: The False Historian
The False Historian awaits in a grand, monochrome library, surrounded by shelves of memory-filled tomes.
```markdown
The False Historian: (smirking) "Welcome, Naga Soul and Dr. Jack. I've been expecting you. You seek the truth, but are you prepared to face the lies that come with it?"
```
Mechanical Logic for the 'Lies' trial:
- The False Historian will summon illusions of the players' past allies and enemies, forcing them to question what is real and what is not.
- Players must use their skills to dispel the illusions and strike the real False Historian.
- The False Historian will periodically attempt to rewrite the players' memories, temporarily reversing their controls or limiting their abilities.

#### Outro Dialogue
After defeating the False Historian, Naga Soul and Dr. Jack stand victorious, but not without scars.
```markdown
Naga Soul: (breathing heavily) "The Collective Memory is fragmented... but we've uncovered a piece of the truth."
Dr. Jack: (examining the False Historian's defeated form) "The False Historian's power was rooted in manipulating memories. We need to be cautious; there may be more like him."
Naga Soul: (eyes gleaming) "We'll press on, Dr. Jack. The Ethical Avengers will not be swayed by lies and half-truths. We'll uncover the entire truth, no matter the cost."
```
The camera pans out as they exit the library, ready to face the next challenge in their quest for truth and justice.
