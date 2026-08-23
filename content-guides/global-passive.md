Global Passives

Some characters have a Global Passive / Exclusive Effect that is separate from their normal abilities, Major Traces, Memosprite abilities, or Elation abilities.

Global Passives should be stored in a top-level global_passives object in the character JSON.

Basic Structure

"global_passives": {
    "passive-id": {
        "name": "Passive Name",
        "tag": "Support",
        "description": "Passive description."
    }
}

Use a kebab-case ID for the passive.

Example:

"global_passives": {
    "mcawolfee-999": {
        "name": "McAwolfee 999",
        "tag": "Support",
        "description": "After obtaining Silver Wolf LV.999 or when Silver Wolf LV.999 is present in the current team, gains the following effect..."
    }
}

Where It Goes

global_passives is a top-level field, alongside things such as abilities, memosprite, elation, and major_traces.

Example:

{
    "abilities": {
        ...
    },

    "elation": {
        ...
    },

    "global_passives": {
        "passive-id": {
            "name": "Passive Name",
            "tag": "Support",
            "description": "Passive description."
        }
    },

    "major_traces": {
        ...
    }
}

For a Remembrance character, it can similarly appear alongside memosprite:

{
    "abilities": {
        ...
    },

    "memosprite": {
        ...
    },

    "global_passives": {
        ...
    },

    "major_traces": {
        ...
    }
}

Rules

Do not place Global Passives inside abilities.

Do not place them inside elation.skills.

Do not place them inside memosprite.skills.

Global Passives do not have Trace level sliders.

Use description for normal non-scaling passive text.

tag is optional, but "Support" is appropriate for most current Global Passives.

Passive IDs should use kebab-case.

Current examples include Castorice and Silver Wolf LV.999.