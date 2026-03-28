const ARCADE_LEVELS = [
    {
        key: 'tm_level1_v6',
        title: 'Stage 1: Antarctica (The Ice Wall)',
        collisionLayers: ['Collisions'],
        tilesetOverrides: { 'antarctica_bg': 'bg_antarctica' },
        bgImage: 'bg_antarctica'
    },
    {
        key: 'tm_level1_part2_v6',
        title: 'Stage 1 Part 2: Into the Cavern',
        collisionLayers: ['Collisions'],
        tilesetOverrides: {
            'antarctica_cave_bg': 'bg_antarctica_cave',
            'antarctica_tileset': 'antarctica_tiles',
            'background': 'alien_bg',
            'tileset': 'alien_tileset',
            'back-structures': 'alien_back_structures'
        }
    },
    {
        key: 'tm_level1_part3_v6',
        title: 'Stage 1 Part 3: Deep Freeze',
        collisionLayers: ['Collisions'],
        tilesetOverrides: {
            'antarctica_cave_bg': 'bg_antarctica_cave',
            'antarctica_tileset': 'antarctica_tiles',
            'background': 'alien_bg',
            'tileset': 'alien_tileset',
            'back-structures': 'alien_back_structures'
        }    },
    {
        key: 'v6_level_train_station',
        title: 'Stage 3: Train Station',
        collisionLayers: ['Collisions'], // Standard collisions layer
        tilesetOverrides: {}
    },
    {
        key: 'v6_level_train_station_basement',
        title: 'Stage 3 Part 2: Basement (Underwater)',
        collisionLayers: ['platforms', 'Collisions'],
        tilesetOverrides: {}
    },
    {
        key: 'v6_level_neelo_megaman',
        title: 'Stage 3 Part 3: Neelo Megaman City',
        collisionLayers: ['Collisions'],
        tilesetOverrides: {}
    }
];

const GLOBAL_TILESET_MAP = {
    // Rocky Mountains / Glacial
    'sky': 'g_sky', 'sky_lightened': 'g_sky_light',
    'glacial_mountains': 'g_mountains', 'glacial_mountains_lightened': 'g_mountains_light',
    'clouds_mg_3': 'g_clouds_3', 'clouds_mg_2': 'g_clouds_2', 'clouds_mg_1': 'g_clouds_1',
    'clouds_bg': 'g_clouds_bg', 'cloud_lonely': 'g_cloud_lonely',
    'props1': 'caves_props1', 'props2': 'caves_props2',
    'icy_glacier_tiles': 'icy_glacier_tiles',

    // Mars tilesets
    'back': 'mars_back', 'middle': 'mars_middle', 'near': 'mars_near', 'tileset': 'mars_tileset',
    'mars_back': 'mars_back', 'mars_middle': 'mars_middle', 'mars_near': 'mars_near', 'mars_tileset': 'mars_tileset',
    'mars_floor_002': 'mars_floor_002', 'mars_floor_004': 'mars_floor_004', 'mars_floor_005': 'mars_floor_005',
    // Mars - sunny mountains
    'sunny-mountains-sky': 'sunny_mountains_sky',
    'sunny-mountains-hills': 'sunny_mountains_hills',
    'sunny-mountains-far-back': 'sunny_mountains_far_back',
    'foreground': 'sunny_mountains_fg',

    // Mountain Interior (Alien)
    'background': 'alien_bg', 'back-structures': 'alien_back_structures',

    // Cyberpunk corridor (Lab)
    'cyberpunk-corridor': 'cp_corridor',
    'cyberpunk-corridor-strip': 'cyberpunk_strip',
    'cyberpunk-corridor-bg-custom': 'cp_bg_custom',
    'panel_1_0': 'cp_panel_1_0', 'panel_0_0': 'cp_panel_0_0',
    'panel_2_0': 'cp_panel_2_0', 'panel_1_1': 'cp_panel_1_1', 'panel_2_1': 'cp_panel_2_1',

    // Mega Man Level
    'SNES - Mega Man X - Backgrounds - Intro Stage': 'megaman_intro_bg',

    // Sewers
    'sewer_tiles': 'sewer_tiles', 'sewer_back': 'sewer_back',
    'sewer_front': 'sewer_front', 'sewer_mid': 'sewer_mid',

    // Sewers Part 2 (using sewer tiles as fallback)
    'level3_mockup_169': 'sewer_back',
    'level3_layer3_foreground': 'sewer_front',
    'level3_layer1_abyss': 'sewer_mid',

    // Cyber City
    'GUNSTAR-HEROES': 'gunstar_heroes_tiles',
    'bg1': 'bg1',

    // Lava Lab
    'lava_background': 'lava_back',
    'lava-tile': 'lava_tile',
    'middle-rocks': 'lava_middle_rocks',
    'lab_background': 'lab_back',
    'tile-set-sci-fi-interior-platform': 'lab_platform',
    'lab_cp_back': 'cp_back',

    // Underwater Basement Supplemental
    'lava_bg': 'lava_bg',
    'virella_tiles': 'virella_tiles',
    'virella_bg': 'virella_bg',
    'virella_fg': 'virella_bg',
    'coral_reef_platformer_tileset_014': 'coral_14',
    'coral_reef_platformer_tileset_015': 'coral_15',

    // Night Sky / Nebula
    'spaceworld_parallax_nebula': 'nebula_bg',
    'boss-fight-2': 'bg_boss',
    'warped_tileset': 'warped_tileset',

    // Warped City / Other
    'buildings-bg': 'w_buildings_bg', 'near-buildings-bg': 'w_near_buildings_bg',
    'skyline-a': 'w_skyline_a', 'skyline-b': 'w_skyline_b',

    // Junk
    'junk_back': 'junk_back', 'junk_middle': 'junk_middle',
    'junk_near': 'junk_near', 'junk_tileset': 'junk_tileset',
    'cyberpunk_strip': 'cyberpunk_strip',
    'warped_back2': 'warped_back2', 'warped_back_alt': 'warped_back_alt',
    'warped_tileset_alt': 'warped_tileset_alt',
    'back-2': 'warped_back2',
    'Collisions': 'white_pixel',

    // Train Station Level
    'station_bg': 'station_bg',
    'hover_train': 'hover_train',
    'aquatic_life': 'aquatic_life',
    'pickups': 'pickups'
};

const D = {
    p: {
        idle: [ {x:0, w:51, d:100}, {x:108, w:53, d:100}, {x:216, w:59, d:100}, {x:321, w:56, d:100}, {x:427, w:58, d:100}, {x:532, w:58, d:100} ],
        run: [ {x:0, w:79, d:80}, {x:107, w:79, d:80}, {x:216, w:79, d:80}, {x:319, w:89, d:80}, {x:427, w:79, d:80}, {x:529, w:99, d:80}, {x:636, w:95, d:80}, {x:740, w:80, d:80}, {x:848, w:96, d:80} ],
        jv: [ {x:0, w:59}, {x:102, w:62}, {x:201, w:63}, {x:301, w:69}, {x:402, w:60}, {x:501, w:60} ],
        jh: [ {x:0, w:80}, {x:100, w:80}, {x:200, w:80}, {x:300, w:80}, {x:400, w:80}, {x:500, w:80} ],
        cr: [ {x:0, w:55, d:80}, {x:101, w:65, d:80}, {x:201, w:69, d:80}, {x:303, w:69, d:80} ],
        atk: [ 
            {x:0, w:80, d:180, kb:0, hit:{x:-40,y:-85,w:110,h:60}},   // Hit 1: Fast Hook
            {x:108, w:104, d:100, kb:0, hit:{x:-40,y:-85,w:110,h:60}}, // Hit 2: Turbo Punch A
            {x:214, w:101, d:100, kb:0, hit:{x:-40,y:-85,w:110,h:60}}, // Hit 3: Turbo Punch B
            {x:318, w:65, d:120},                                        // Hit 4 start
            {x:426, w:100, d:300, kb:0, hit:{x:-40,y:-85,w:130,h:60}}, // Hit 4 end (KICK)
            {x:526, w:99, d:200, kb:0.1, hit:{x:-40,y:-85,w:120,h:60}},  // Hit 5
            {x:636, w:145, d:400, kb:2.8, hit:{x:-40,y:-95,w:180,h:100}} // Hit 6 (FINISHER)
        ],
        sh: [ 
            {x:0, w:107, d:100}, {x:109, w:147, d:100}, {x:280, w:125, d:100}, 
            {x:421, w:107, d:100}, {x:541, w:114, d:100}, {x:662, w:110, d:100} 
        ]
    },
    orb: [ {x:0, w:122}, {x:133, w:147}, {x:307, w:126}, {x:466, w:122} ],
    boss: [ 51, 550, 1040 ]
};
