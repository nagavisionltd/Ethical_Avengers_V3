# STAGE_4_VIRELLA_DESIGN
## Introduction
Virella, also known as The Verdant Deep, is a unique stage that transitions from a lush jungle environment to a calcified, gray stone area, symbolizing the rot and decay caused by The Blight Core. This stage aims to challenge players with its hybrid setting, diverse enemy waves, and a formidable boss fight.

## Intro Cutscene Script
The stage begins with an intro cutscene where Naga Soul and Big Zeeko discuss their approach to tackling The Blight Core.

```markdown
[Scene: Aerial view of the jungle-ocean hybrid, with Naga Soul and Big Zeeko standing on a cliff overlooking the area]

Naga Soul: "Big Zeeko, our reconnaissance indicates that The Blight Core is hidden deep within Virella. We must be cautious; the environment itself seems to be against us."

Big Zeeko: "I've fought in worse conditions, Naga. But I agree, this place feels... off. The rot is spreading fast. We need to end this before it's too late."

Naga Soul: "Then let's proceed with the mission. Our goal is to reach The Blight Core and put an end to its destructive influence. Stay sharp; the jungle and the sea are full of surprises."

Big Zeeko: "You got it. Let's move out, Naga. For the Ethical Avengers!"
```

## Enemy Waves
The enemy waves in Virella will challenge players with a variety of foes, from agile jungle creatures to armored sea beasts. The enemy waves are designed as follows:

```json
{
  "enemyWaves": [
    {
      "x": 100,
      "count": 5,
      "enemyType": "Jungle Scout"
    },
    {
      "x": 300,
      "count": 3,
      "enemyType": "Sea Crawler"
    },
    {
      "x": 500,
      "count": 2,
      "enemyType": "Jungle Warrior"
    },
    {
      "x": 700,
      "count": 4,
      "enemyType": "Toxic Spitter"
    },
    {
      "x": 900,
      "count": 1,
      "enemyType": "Ancient Guardian"
    }
  ]
}
```

## Boss Phase Mechanics: The Blight Core
The Blight Core is a parasitic growth that has infected the heart of Virella, causing the environment to decay and become hostile. The boss fight is divided into phases, focusing on a healing node defense trial.

1. **Initial Phase**: The Blight Core begins by summoning waves of smaller, infected creatures to attack the players. It has a set amount of health and will periodically enter a healing phase.
2. **Healing Phase**: The Blight Core extends tendrils to nearby healing nodes. Players must destroy these nodes to prevent The Blight Core from recovering health. Each node destroyed increases the damage The Blight Core takes during its vulnerable state.
3. **Vulnerable State**: After all healing nodes are destroyed, The Blight Core enters a vulnerable state for a short duration. Players must deal as much damage as possible during this time.
4. **Repeat and Escalation**: The fight repeats these phases, with The Blight Core summoning more aggressive enemies and generating additional healing nodes as its health decreases.

## Outro Dialogue
After defeating The Blight Core, Naga Soul and Big Zeeko reflect on their victory and the state of Virella.

```markdown
[Scene: Naga Soul and Big Zeeko standing victorious over the defeated Blight Core, with the environment beginning to heal]

Naga Soul: "It's done. The Blight Core is no more. Virella can begin to heal."

Big Zeeko: "But at what cost? This place... it's been through so much. I hope our actions here will bring back the beauty it once had."

Naga Soul: "Our mission is to protect and restore. We've taken a crucial step today. The Ethical Avengers will continue to fight for the well-being of our planet and its inhabitants."

Big Zeeko: "Then our work here is done. Let's head back and prepare for the next challenge. There's still much to be done."

Naga Soul: "Agreed. Virella will flourish again. And we will be ready for whatever comes next."
```

## Conclusion
Stage 4: Virella, offers a unique blend of environments and challenges, culminating in a boss fight that requires strategy and teamwork. The defeat of The Blight Core is a significant victory for the Ethical Avengers, marking another step in their mission to protect the planet from those who would seek to harm it.
