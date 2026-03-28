class Boot extends Phaser.Scene {
    constructor() { super('Boot'); }

    preload() {
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;
        const progressBar = this.add.graphics();
        const progressBox = this.add.graphics();
        progressBox.fillStyle(0x222222, 0.8);
        progressBox.fillRect(width / 2 - 160, height / 2 - 30, 320, 50);
        const loadingText = this.make.text({ x: width / 2, y: height / 2 - 50, text: 'LOADING...', style: { font: '20px "Press Start 2P"', fill: '#ffffff' } }).setOrigin(0.5);
        const percentText = this.make.text({ x: width / 2, y: height / 2 - 5, text: '0%', style: { font: '18px "Press Start 2P"', fill: '#ffffff' } }).setOrigin(0.5);

        this.load.on('progress', (value) => {
            percentText.setText(parseInt(value * 100) + '%');
            progressBar.clear();
            progressBar.fillStyle(0x00ffaa, 1);
            progressBar.fillRect(width / 2 - 150, height / 2 - 20, 300 * value, 30);
        });

        this.load.on('loaderror', (file) => console.error(`Asset failed to load: ${file.key} from ${file.src}`));

        // --- UI & CORE ASSETS ---
        this.load.image('dialogue_box', 'assets/ui/world_map.png');
        this.load.image('select_bg', 'assets/ui/select_character_screen.png');
        this.load.image('title_bg_v17', 'assets/images/backgrounds/ethical_avengers_title_screen.jpeg');
        this.load.image('portal', 'assets/ui/world_map.png');

        // --- INTRO ASSETS ---
        this.load.video('intro_video', 'assets/video/ethical_avengers_HYPERLAPSE_V3.mp4');
        this.load.video('arcade_intro_video', 'assets/video/ethical_avengers_HYPERLAPSE_V3.mp4');
        this.load.audio('intro_music', 'assets/audio/intro_music.mp3');
        // --- TILESETS ---
        this.load.image('antarctica_tiles', 'assets/images/tilesets/antarctica_tileset.png');
        this.load.image('icy_glacier_tiles', 'assets/images/tilesets/icy_glacier_tiles.png');
        this.load.image('white_pixel', 'assets/ui/white_pixel.png');

        // --- HUD PORTRAITS (Fixed Spritesheet Style from Reference Sheets) ---
        this.load.image('hud_portrait_leon', 'assets/ui/portraits/fixed/hud_leon_v2.png');
        this.load.image('hud_portrait_verona', 'assets/ui/portraits/fixed/hud_verona_v2.png');
        this.load.image('hud_portrait_jack', 'assets/ui/portraits/fixed/hud_jack_v2.png');
        this.load.image('hud_portrait_naga', 'assets/ui/portraits/fixed/hud_naga_v2.png');
        this.load.image('hud_portrait_zeeko', 'assets/ui/portraits/fixed/hud_zeeko_v2.png');
        this.load.image('hud_portrait_sophia', 'assets/ui/portraits/fixed/hud_sophia_v2.png');

        // --- LEVEL BACKGROUNDS ---
        this.load.image('bg1', 'assets/images/backgrounds/bg1.jpg');
        this.load.image('bg_antarctica', 'assets/images/backgrounds/antarctica_bg.png');
        this.load.image('bg_antarctica_cave', 'assets/images/backgrounds/antarctica_cave_bg.png');
        this.load.image('floor', 'assets/images/tiles/ground_tile_v1.png');
        this.load.image('sky', 'assets/images/Environments/sci-fi-environment-background-files/PNG/sky.png');
        this.load.image('celestial_bg', 'assets/images/backgrounds/celestial_bg.png');
        this.load.image('warped_sky_a', 'new_tilesets/warped_city_files/ENVIRONMENT/background/skyline-a.png');
        this.load.image('warped_sky_b', 'new_tilesets/warped_city_files/ENVIRONMENT/background/skyline-b.png');
        this.load.image('warped_far_bg', 'new_tilesets/warped_city_files/ENVIRONMENT/background/buildings-bg.png');
        this.load.image('warped_near_bg', 'new_tilesets/warped_city_files/ENVIRONMENT/background/near-buildings-bg.png');
        this.load.image('warped_prop_antenna', 'new_tilesets/warped_city_files/ENVIRONMENT/props/antenna.png');
        this.load.image('warped_tileset', 'new_tilesets/warped_city_files/ENVIRONMENT/tileset.png');
        this.load.image('prop_control_box_1', 'new_tilesets/warped_city_files/ENVIRONMENT/props/control-box-1.png');
        this.load.image('lab_back', 'assets/images/Environments/sci-fi-interior-paltform/PNG/background.png');
        this.load.image('lab_mid', 'assets/images/Environments/bulkhead-walls/PNG/bg-wall.png');
        this.load.image('lab_fore', 'assets/images/Environments/bulkhead-walls/PNG/foreground.png');
        this.load.image('lab_platform', 'assets/levels/Lab-level/lab-part-2/PNG/tile-set-sci-fi-interior-platform.png');

        // --- PLACEHOLDER ASSETS (For missing files) ---
        this.load.image('aetherion_bg', 'assets/images/backgrounds/bg1.jpg');
        this.load.image('aetherion_tileset', 'assets/images/Environments/sci-fi-interior-paltform/PNG/tile-set-sci-fi-interior-platform.png');
        this.load.image('terra_tileset', 'assets/images/Environments/sci-fi-interior-paltform/PNG/tile-set-sci-fi-interior-platform.png');

        // --- JUNK PLAINS ASSETS ---
        this.load.tilemapTiledJSON('junk_plains_map', 'assets/tilemaps/mountain_new.json?v=16.4.0');
        this.load.image('junk_back', 'assets/images/tilesets/junk/junk_back.png');
        this.load.image('junk_middle', 'assets/images/tilesets/junk/junk_middle.png');
        this.load.image('junk_near', 'assets/images/tilesets/junk/junk_near.png');
        this.load.image('junk_tileset', 'assets/images/tilesets/junk/junk_tileset.png');
        this.load.image('cyberpunk_strip', 'assets/images/tilesets/cyberpunk/cyberpunk_strip.png');
        this.load.image('warped_back2', 'assets/images/tilesets/warped/warped_back2.png');
        this.load.image('warped_back_alt', 'assets/images/tilesets/warped/warped_back.png');
        this.load.image('warped_tileset_alt', 'assets/images/tilesets/warped/warped_tileset.png');

        // --- ARCADE ---
        // --- TILEMAPS ---
        this.load.tilemapTiledJSON('tm_level1_v6', 'assets/tilemaps/v6_level_1_antartica.tmj?v=2026');
        this.load.tilemapTiledJSON('tm_level1_part2_v6', 'assets/tilemaps/v6_level_1_antartica_part_2.tmj?v=2026');
        this.load.tilemapTiledJSON('tm_level1_part3_v6', 'assets/tilemaps/v6_level_1_antartica_part_3.tmj?v=2026');
        this.load.tilemapTiledJSON('tm_level1_part4_v6', 'assets/tilemaps/v6_level_1_antartica_part_4_Boss.tmj?v=2026');
        this.load.tilemapTiledJSON('tm_level2_v6', 'assets/tilemaps/v6_level_2_inside_basev2.tmj?v=2026');
        this.load.tilemapTiledJSON('tm_antarctica', 'assets/tilemaps/v6_level_1_antarticav2.tmj');
        
        // --- Train Station Levels ---
        this.load.tilemapTiledJSON('v6_level_train_station', 'assets/tilemaps/v6_level_train_station.tmj?v=2026');
        this.load.tilemapTiledJSON('v6_level_train_station_basement', 'assets/tilemaps/v6_level_train_station_basement.tmj?v=2026');
        this.load.tilemapTiledJSON('v6_level_neelo_megaman', 'assets/tilemaps/neelo_megaman_city_levelv3.tmj?v=2026');

        // Mega Man Tileset
        this.load.image('megaman_intro_bg', 'assets/images/tilesets/megaman/SNES - Mega Man X - Backgrounds - Intro Stage.png');

        this.load.tilemapTiledJSON('tm_rocky_mountains', 'tilemaps26/rocky_mountains_level.tmj?v=17.0');
        this.load.tilemapTiledJSON('tm_arcade_map', 'tilemaps26/arcade-map.tmj?v=17.0');
        this.load.tilemapTiledJSON('tm_night_sky', 'tilemaps26/night-sky.tmj?v=17.0');
        this.load.tilemapTiledJSON('tm_mars', 'tilemaps26/mars-part 1.tmj?v=17.0');
        this.load.tilemapTiledJSON('tm_mountain_interior', 'tilemaps26/mountain_base_interior_level.tmj?v=17.0');
        this.load.tilemapTiledJSON('tm_abandoned_lab', 'tilemaps26/lab-small-abandoned.tmj?v=17.0');
        this.load.tilemapTiledJSON('tm_lab_sewers', 'tilemaps26/lab-sewers.tmj?v=17.0');
        this.load.tilemapTiledJSON('tm_sewers_part2', 'tilemaps26/sewers-part2.tmj?v=17.0');
        this.load.tilemapTiledJSON('tm_cyber_city', 'tilemaps26/cyber_city.tmj?v=17.0');

        // --- NEW ARCADE ASSETS ---
        this.load.image('nebula_bg', 'assets/images/backgrounds/spaceworld_parallax_nebula.png');

        // --- Lava Lab tilesets ---
        this.load.image('lava_back', 'assets/levels/lava-background/PNG/background.png');
        this.load.image('lava_tile', 'assets/levels/lava-background/PNG/lava-tile.png');
        this.load.image('lava_middle_rocks', 'assets/levels/lava-background/PNG/middle-rocks.png');

        // --- Mars: Sunny Mountains tilesets ---
        this.load.image('sunny_mountains_sky', 'new_tilesets/sunny-rocky-mountains/PNG/sunny-mountains-sky.png');
        this.load.image('sunny_mountains_hills', 'new_tilesets/sunny-rocky-mountains/PNG/sunny-mountains-hills.png');
        this.load.image('sunny_mountains_far_back', 'new_tilesets/sunny-rocky-mountains/PNG/sunny-mountains-far-back.png');
        this.load.image('sunny_mountains_fg', 'new_tilesets/sunny-rocky-mountains/PNG/foreground.png');

        // --- Abandoned Lab: Cyberpunk Corridor tilesets ---
        this.load.image('cp_corridor', 'assets/images/Environments/cyberpunk-corridor-files/PNG/layers/cyberpunk-corridor.png');
        this.load.image('cp_back', 'assets/images/Environments/cyberpunk-corridor-files/PNG/layers/back.png');
        this.load.image('cp_fg', 'assets/images/Environments/cyberpunk-corridor-files/PNG/layers/cyberpunk-corridor-foreground.png');
        this.load.image('cyberpunk_strip', 'assets/images/Environments/cyberpunk-corridor-files/PNG/cyberpunk-corridor-strip.png');
        this.load.image('cp_bg_custom', 'assets/images/Environments/cyberpunk-corridor-files/PNG/cyberpunk-corridor-bg-custom.png');
        this.load.image('cp_panel_1_0', 'assets/images/Environments/cyberpunk-corridor-files/PNG/tiles/panel_1_0.png');
        this.load.image('cp_panel_0_0', 'assets/images/Environments/cyberpunk-corridor-files/PNG/tiles/panel_0_0.png');
        this.load.image('cp_panel_2_0', 'assets/images/Environments/cyberpunk-corridor-files/PNG/tiles/panel_2_0.png');
        this.load.image('cp_panel_1_1', 'assets/images/Environments/cyberpunk-corridor-files/PNG/tiles/panel_1_1.png');
        this.load.image('cp_panel_2_1', 'assets/images/Environments/cyberpunk-corridor-files/PNG/tiles/panel_2_1.png');

        // --- Sewer tilesets ---
        this.load.image('sewer_tiles', 'assets/images/tilesets/sewer/sewer_tiles.png');
        this.load.image('sewer_back', 'assets/images/tilesets/sewer/sewer_back.png');
        this.load.image('sewer_front', 'assets/images/tilesets/sewer/sewer_front.png');
        this.load.image('sewer_mid', 'assets/images/tilesets/sewer/sewer_mid.png');

        // --- Train Station Level ---
        this.load.image('station_bg', 'assets/levels/underwater_station/station_bg.png');
        this.load.image('hover_train', 'assets/levels/underwater_station/hover_train.png');
        this.load.image('aquatic_life', 'assets/levels/underwater_station/aquatic_life.png');
        this.load.image('pickups', 'assets/levels/underwater_station/pickups.png');

        // --- Cyber City tilesets ---
        this.load.image('gunstar_heroes_tiles', 'EA_V4/tiles_samples/GUNSTAR-HEROES.png');

        // --- OLD TEST MAPS (kept for story mode) ---
        this.load.tilemapTiledJSON('map_warped_city', 'assets/tilemaps/warped_city.tmj?v=16.4.0');
        this.load.tilemapTiledJSON('map_rocky_mountains', 'assets/tilemaps/rocky_mountains.tmj?v=16.4.0');
        this.load.tilemapTiledJSON('map_mountain_interior', 'assets/tilemaps/mountain_base_interior.tmj?v=16.4.0');

        // Mountain Base Interior Tiles
        this.load.image('alien_bg', 'assets/images/Environments/alien-environment/PNG/layers/background.png');
        this.load.image('alien_tileset', 'assets/images/Environments/alien-environment/PNG/layers/tileset.png');
        this.load.image('alien_back_structures', 'assets/images/Environments/alien-environment/PNG/layers/back-structures.png');

        // Rocky Mountains Tiles (Glacial & Caves)
        this.load.image('g_sky', 'new_tilesets/Glacial-mountains-parallax-background_vnitti/Layers/sky.png');
        this.load.image('g_sky_light', 'new_tilesets/Glacial-mountains-parallax-background_vnitti/Layers/sky_lightened.png');
        this.load.image('g_mountains', 'new_tilesets/Glacial-mountains-parallax-background_vnitti/Layers/glacial_mountains.png');
        this.load.image('g_mountains_light', 'new_tilesets/Glacial-mountains-parallax-background_vnitti/Layers/glacial_mountains_lightened.png');
        this.load.image('g_clouds_3', 'new_tilesets/Glacial-mountains-parallax-background_vnitti/Layers/clouds_mg_3.png');
        this.load.image('g_clouds_2', 'new_tilesets/Glacial-mountains-parallax-background_vnitti/Layers/clouds_mg_2.png');
        this.load.image('g_clouds_1', 'new_tilesets/Glacial-mountains-parallax-background_vnitti/Layers/clouds_mg_1.png');
        this.load.image('g_clouds_bg', 'new_tilesets/Glacial-mountains-parallax-background_vnitti/Layers/clouds_bg.png');
        this.load.image('g_cloud_lonely', 'new_tilesets/Glacial-mountains-parallax-background_vnitti/Layers/cloud_lonely.png');
        this.load.image('caves_props1', 'new_tilesets/PixelFantasy_Caves_1.0/props1.png');
        this.load.image('caves_props2', 'new_tilesets/PixelFantasy_Caves_1.0/props2.png');

        // Warped City Tiles
        this.load.image('w_tileset', 'new_tilesets/warped_city_files/ENVIRONMENT/tileset.png');
        this.load.image('w_buildings_bg', 'new_tilesets/warped_city_files/ENVIRONMENT/background/buildings-bg.png');
        this.load.image('w_near_buildings_bg', 'new_tilesets/warped_city_files/ENVIRONMENT/background/near-buildings-bg.png');
        this.load.image('w_skyline_a', 'new_tilesets/warped_city_files/ENVIRONMENT/background/skyline-a.png');
        this.load.image('w_skyline_b', 'new_tilesets/warped_city_files/ENVIRONMENT/background/skyline-b.png');

        // --- MARS LEVEL ASSETS ---
        this.load.tilemapTiledJSON('new_map', 'assets/tilemaps/new.json?v=16.4.0');
        this.load.image('mars_back', 'assets/images/tilesets/mars/mars_back.png');
        this.load.image('mars_middle', 'assets/images/tilesets/mars/mars_middle.png');
        this.load.image('mars_near', 'assets/images/tilesets/mars/mars_near.png');
        this.load.image('mars_tileset', 'assets/images/tilesets/mars/mars_tileset.png');
        this.load.image('mars_floor_001', 'assets/images/tilesets/mars/mars_floor_001.png');
        this.load.image('mars_floor_002', 'assets/images/tilesets/mars/mars_floor_002.png');
        this.load.image('mars_floor_003', 'assets/images/tilesets/mars/mars_floor_003.png');
        this.load.image('mars_floor_004', 'assets/images/tilesets/mars/mars_floor_004.png');
        this.load.image('mars_floor_005', 'assets/images/tilesets/mars/mars_floor_005.png');
        this.load.image('mars_floor_006', 'assets/images/tilesets/mars/mars_floor_006.png');

        // --- BASEMENT LEVEL SUPPLEMENTAL ASSETS ---
        this.load.image('lava_bg', 'assets/levels/level1_lava/lava_bg.png');
        this.load.image('virella_tiles', 'assets/levels/level4_virella/virella_tiles.png');
        this.load.image('virella_bg', 'assets/levels/level4_virella/virella_bg.png');
        this.load.image('coral_14', 'assets/levels/level4_virella/coral_reef_platformer_tileset_sprites/coral_reef_platformer_tileset_014.png');
        this.load.image('coral_15', 'assets/levels/level4_virella/coral_reef_platformer_tileset_sprites/coral_reef_platformer_tileset_015.png');

        // --- VIDEOS ---
        this.load.video('vid_boss_bg', 'assets/video/level1_boss_bg.mp4');
        this.load.video('vid_vs_bg_1', 'assets/video/vs_arena_bg.mp4');
        this.load.video('vid_vs_bg_2', 'assets/video/vs_arena_bg_alt.mp4');
        this.load.image('bg_boss', 'assets/images/backgrounds/boss-fight-2.png');

        // --- CHARACTERS ---
        // 1. Cherry — Full move set loaded
        const cF = [
            // Idle (6)
            0, 3, 6, 9, 12, 15, 18,
            // Run (8)
            24, 26, 28, 29, 31, 33, 35, 37,
            // Forward kicks (7)
            38, 40, 42, 44, 46, 48, 52,
            // Back kicks (7)
            69, 77, 85, 87, 90, 94, 97,
            // Spin kicks (4)
            100, 102, 105, 108,
            // Air recovery (3)
            116, 119, 123,
            // Jump / Double jump (11)
            130, 132, 134, 138, 140, 143, 146, 150, 153, 156, 158,
            // Roundhouse & sweep (10)
            170, 172, 175, 179, 181, 183, 189, 191, 196, 198,
            // Special kick (5)
            211, 213, 215, 217, 219,
            // Ground combo chain (27)
            233, 235, 237, 239, 240, 242, 243, 245, 247, 249, 251,
            253, 254, 256, 259, 261, 263, 265, 268, 270, 271, 274, 276, 278, 280, 281, 282,
            // Kick combo chain (18)
            301, 303, 305, 307, 310, 312, 313, 315, 317, 320, 324, 326, 328,
            334, 336, 338, 340, 343, 345, 347, 349, 351, 353,
            // Slide / dash (3)
            379, 382, 386,
            // Super special (18)
            399, 401, 403, 405, 407, 411, 414, 416, 419, 421,
            425, 427, 433, 439, 443, 447, 449, 451, 453, 456, 462,
            // Flight / projectile throw (17)
            468, 470, 472, 475, 478, 480, 482, 484, 486, 488, 491, 495, 497, 499, 501, 505,
            // Air projectile (7)
            509, 511, 513, 516, 519, 521, 523,
            // Hover (10)
            544, 546, 548, 550, 552, 554, 556, 558, 561, 563,
            // Crouch (11)
            570, 573, 575, 577, 579, 581, 583, 585, 587, 589, 593
        ];
        cF.forEach(n => {
            const fName = `cherry_${n.toString().padStart(4, '0')}`;
            this.load.image(fName, `assets/images/characters/cherry/${fName}.png`);
        });

        // 2. Adam
        const aF = [
            0, 3, 6, 9, 11, 14, 17, 20, 23, 47, 49, 51, 53, 56, 58, 60, 62,
            132, 134, 138, 140, 143, 147, 151, 154, 157,
            88, 89, 90, 91, 93, 94,
            104, 105, 106, 108,
            311, 312, 315, 321, 323, 325, 328, 330, 331, 332
        ];
        aF.forEach(n => {
            const fName = `adam_${n.toString().padStart(4, '0')}`;
            this.load.image(fName, `assets/images/characters/adam/${fName}.png`);
        });

        // 3. Big Z (Individual Frames)
        const bzPath = 'assets/images/characters/big-z/big_z_sprite_sheet_sprites/';
        this.load.image('bigz_thumb', 'assets/images/characters/big-z/bigz_thumbnail.png');

        // Idle
        [1, 2, 3, 4, 5].forEach(i => this.load.image(`bigz_idle_${i}`, bzPath + `idle/big_z_sprite_sheet_00${i}.png`));
        // Walk
        [6, 7, 8, 9].forEach(i => this.load.image(`bigz_walk_${i}`, bzPath + `walk/big_z_sprite_sheet_00${i}.png`));
        // Run
        [10, 11, 12, 13, 14].forEach(i => this.load.image(`bigz_run_${i}`, bzPath + `run/big_z_sprite_sheet_0${i}.png`));
        // Melee
        [1, 2, 3, 4, 5].forEach(i => this.load.image(`bigz_atk_${i}`, bzPath + `melee/hit${i}.png`));

        // Jump & Aerial
        this.load.image('bigz_jump_up_1', bzPath + 'jump/jump_up/jump1.png');
        this.load.image('bigz_jump_up_2', bzPath + 'jump/jump_up/jump2.png');
        this.load.image('bigz_jump_fall_1', bzPath + 'jump/jump_fall/fall1.png');
        this.load.image('bigz_jump_fall_2', bzPath + 'jump/jump_fall/fall2_land.png');
        this.load.image('bigz_jump_forward', bzPath + 'jump/jump_forward/jump_forward.png');
        this.load.image('bigz_fly', bzPath + 'fly_forward_hover.png');

        // Blast & Projectiles
        this.load.image('bigz_special_blast', bzPath + 'energy_blast/energy_blast.png');
        this.load.image('bigz_proj_energy', bzPath + 'energy_blast/projectile/energy.png');
        this.load.image('bigz_proj_hit', bzPath + 'energy_blast/projectile/energy_hit.png');

        // 5. Dr. Ignite — Full move set loaded
        const igniteFrames = [
            'idle_01', 'idle_02', 'run_1', 'run_2', 'run_3',
            'jump_01', 'jump_02', 'jump_03_land',
            'combo_0', 'combo_01', 'combo_02', 'combo_03_hit',
            'combo_04_hit', 'combo_5_hit', 'combo_05', 'combo_06',
            'combo_07', 'combo_08_hit', 'combo_09',
            'blast_projectile_01', 'blast_projectile_02',
            'blast_0', 'blast_01', 'blast_02', 'blast_03',
            'light_special_01'
        ];
        igniteFrames.forEach(f => this.load.image(`ignite_${f}`, `assets/images/characters/dr-ignite/frames/${f}.png`));
        this.load.image('ignite_portrait', 'assets/images/characters/dr-ignite/dr-ignite-thumbnail.png');

        // 7. Chibi Soul (prefix: default) — ALL individual frames from CHIBI_SOUL
        const csBasePath = 'assets/images/characters/CHIBI_SOUL/';
        // Idle: single image (85x183)
        this.load.image('cs_idle', csBasePath + 'idle.png');
        // Run: 8 individual frames (238x402 each)
        for (let i = 1; i <= 8; i++) this.load.image(`cs_run_${i}`, csBasePath + `run/run_0${i}.png`);
        // Crouch (109x140)
        this.load.image('cs_crouch', csBasePath + 'crouch.png');
        // Forward/fly (136x160)
        this.load.image('cs_forward', csBasePath + 'forward.png');
        this.load.image('cs_idle_fly', csBasePath + 'idle_fly.png');

        // --- CHIBI SOUL: Jump, Jump+Movement, Hover ---
        for (let i = 1; i <= 4; i++) this.load.image(`cs_jump_up_${i}`, csBasePath + `jump/jump up/jump_up_0${i}.png`);
        for (let i = 1; i <= 6; i++) this.load.image(`cs_jump_fwd_${i}`, csBasePath + `jump/jump+movement/jump_up_0${i}.png`);
        for (let i = 1; i <= 6; i++) this.load.image(`cs_hover_${i}`, csBasePath + `hover/hover_0${i}.png`);

        // --- CHIBI SOUL: 9-Hit Melee Combo (individual frames) ---
        const meleePath = 'assets/images/characters/CHIBI_SOUL/attack/melee_attack_combo/';
        // Hit 1: 3 frames
        this.load.image('cs_m1_01', meleePath + 'melee_01/melee1_01.png');
        this.load.image('cs_m1_02', meleePath + 'melee_01/melee1_02.png');
        this.load.image('cs_m1_03', meleePath + 'melee_01/melee1_03.png');
        // Hit 2: 3 frames
        this.load.image('cs_m2_01', meleePath + 'melee_02/melee2_01.png');
        this.load.image('cs_m2_02', meleePath + 'melee_02/melee2_02.png');
        this.load.image('cs_m2_03', meleePath + 'melee_02/melee2_03.png');
        // Hit 3: 2 frames
        this.load.image('cs_m3_01', meleePath + 'melee_03/melee3_01.png');
        this.load.image('cs_m3_02', meleePath + 'melee_03/melee3_02.png');
        // Hit 4: 3 frames
        this.load.image('cs_m4_01', meleePath + 'melee_04/melee4_01.png');
        this.load.image('cs_m4_02', meleePath + 'melee_04/melee4_02.png');
        this.load.image('cs_m4_03', meleePath + 'melee_04/melee4_03.png');
        // Hit 5: 2 frames
        this.load.image('cs_m5_01', meleePath + 'melee_05/melee5_01.png');
        this.load.image('cs_m5_02', meleePath + 'melee_05/melee5_02.png');
        // Hit 6: 2 frames
        this.load.image('cs_m6_01', meleePath + 'melee_06/melee6_01.png');
        this.load.image('cs_m6_02', meleePath + 'melee_06/melee6_02.png');
        // Hit 7: 4 frames
        this.load.image('cs_m7_01', meleePath + 'melee_07/melee7_01.png');
        this.load.image('cs_m7_02', meleePath + 'melee_07/melee7_02.png');
        this.load.image('cs_m7_03', meleePath + 'melee_07/melee7_03.png');
        this.load.image('cs_m7_04', meleePath + 'melee_07/melee7_04.png');
        // Hit 8: 2 frames
        this.load.image('cs_m8_01', meleePath + 'melee_08/melee8_01.png');
        this.load.image('cs_m8_02', meleePath + 'melee_08/melee8_02.png');
        // Hit 9: 2 frames
        this.load.image('cs_m9_01', meleePath + 'melee_09/melee9_01.png');
        this.load.image('cs_m9_02', meleePath + 'melee_09/melee9_02.png');

        // --- CHIBI SOUL: Special Blast Attack ---
        const blastPath = 'assets/images/characters/CHIBI_SOUL/attack/special_blast_attack/';
        for (let i = 1; i <= 8; i++) {
            this.load.image(`cs_blast_${i}`, blastPath + `special_blast_attack_0${i}.png`);
        }

        // --- CHIBI SOUL: Blast Projectile ---
        const projPath = blastPath + 'special_blast_projectile_animation/';
        for (let i = 1; i <= 4; i++) {
            this.load.image(`cs_proj_${i}`, projPath + `special_blast_attack_projectile_0${i}.png`);
        }

        this.load.image('chibi_soul_thumb', 'assets/images/characters/CHIBI_SOUL/idle.png');

        // --- CYBORG NINJA (Neon Ninja) ---
        const cnPath = 'assets/images/characters/cyborg_ninja/';
        // Idle (8 frames)
        for (let i = 0; i <= 7; i++) this.load.image(`cn_idle_${i}`, cnPath + `idle/idle_${i}.png`);
        this.load.image('cn_thumb', cnPath + 'idle/idle_0.png');
        this.load.image('cn_idle_4', cnPath + 'idle/idle_4.png');
        // Run (8 frames)
        for (let i = 0; i <= 7; i++) this.load.image(`cn_run_${i}`, cnPath + `run/run_${i}.png`);
        // Jump (5 frames)
        for (let i = 0; i <= 4; i++) this.load.image(`cn_jump_${i}`, cnPath + `jump/jump_${i}.png`);
        // Hurt (5 frames)
        for (let i = 0; i <= 4; i++) this.load.image(`cn_hurt_${i}`, cnPath + `hurt/hurt_${i}.png`);
        // Melee combo (4 hits, 2 frames each) — kept as fallback
        for (let h = 1; h <= 4; h++) {
            this.load.image(`cn_m${h}_1`, cnPath + `melee_combo_${h}/melee_combo_0${h}_1.png`);
            this.load.image(`cn_m${h}_2`, cnPath + `melee_combo_${h}/melee_combo_0${h}_2.png`);
        }
        // Sword combos (replaces melee for attacks)
        this.load.image('cn_sw1_1', cnPath + 'sword_combo_01/sword_combo_01_1.png');
        this.load.image('cn_sw1_2', cnPath + 'sword_combo_01/sword_combo_01_2.png');
        this.load.image('cn_sw1_3', cnPath + 'sword_combo_01/sword_combo_01_3.png');
        this.load.image('cn_sw2_1', cnPath + 'sword_combo_02/sword_combo_02_1.png');
        this.load.image('cn_sw2_2', cnPath + 'sword_combo_02/sword_combo_02_2.png');
        this.load.image('cn_sw2_3', cnPath + 'sword_combo_02/sword_combo_02_3.png');
        this.load.image('cn_sw3_1', cnPath + 'sword_combo_03/sword_combo_03_1.png');
        this.load.image('cn_sw3_2', cnPath + 'sword_combo_03/sword_combo_03_2.png');
        this.load.image('cn_sw4_1', cnPath + 'sword_combo_04/sword_combo_04_1.png');
        this.load.image('cn_sw4_2', cnPath + 'sword_combo_04/sword_combo_04_2.png');
        // Somersault (double jump)
        for (let i = 1; i <= 4; i++) this.load.image(`cn_som_${i}`, cnPath + `somersault_sprites/somersault_00${i}.png`);
        // Crouch (2 frames)
        for (let i = 0; i <= 1; i++) this.load.image(`cn_crouch_${i}`, cnPath + `crouch/crouch_0${i}.png`);
        // Dash (4 frames)
        for (let i = 0; i <= 3; i++) this.load.image(`cn_dash_${i}`, cnPath + `dash/dash_0${i}.png`);
        // Energy Blast (3 frames)
        for (let i = 0; i <= 2; i++) this.load.image(`cn_blast_${i}`, cnPath + `energy_blast/energy_blast_${i}.png`);

        // --- LORD SOUL (naga-soul-26) ---
        const lsPath = 'assets/images/characters/naga-soul-26/animation_frames/';
        this.load.image('ls_idle', lsPath + 'idle/idle.png');
        this.load.image('ls_move', lsPath + 'move.png');
        
        // Walk (1-6)
        for (let i = 1; i <= 6; i++) this.load.image(`ls_walk_${i}`, lsPath + `walk/walk_run_jump_00${i}.png`);
        // Run (7-14)
        for (let i = 7; i <= 14; i++) {
            let fNum = i;
            if (i === 8) fNum = 7; // Fallback for missing frame 8
            this.load.image(`ls_run_${i}`, lsPath + `run/walk_run_jump_0${fNum < 10 ? '0' + fNum : fNum}.png`);
        }
        
        for (let i = 1; i <= 6; i++) this.load.image(`ls_fly_${i}`, lsPath + `flying_soul_sprites/flying_soul_00${i}.png`);
        for (let i = 1; i <= 8; i++) this.load.image(`ls_dash_aura_${i}`, lsPath + `flying_soul_sprites/dash_aura/dash_aura_00${i}.png`);
        for (let i = 1; i <= 3; i++) this.load.image(`ls_hover_${i}`, lsPath + `hover/hover${i}.png`);
        
        // Hurt/Hit frames (ls_hit1 used for lordsoul_hurt anim)
        this.load.image('ls_hit1_1', lsPath + 'jump_attack/jump_attack/jump_attack_1.png');
        this.load.image('ls_hit1_2', lsPath + 'jump_attack/jump_attack/jump_attack_2.png');
        this.load.image('ls_hit2_1', lsPath + 'jump_attack/jump_sword/jump_attack_3.png');
        this.load.image('ls_hit2_2', lsPath + 'jump_attack/jump_attack/jump_attack_2.png'); // Fallback for missing jump_attack_4
        
        // Z Punches (1-8 mapped to 8-hit combo)
        this.load.image('ls_p1_1', lsPath + 'punches_Z/punch1/jab1.png');
        this.load.image('ls_p1_2', lsPath + 'punches_Z/punch1/jab2.png');
        
        this.load.image('ls_p2_1', lsPath + 'punches_Z/punch2/jab2_1.png');
        this.load.image('ls_p2_2', lsPath + 'punches_Z/punch2/jab2_2.png');
        this.load.image('ls_p2_3', lsPath + 'punches_Z/punch2/jab2_3.png');
        this.load.image('ls_p2_4', lsPath + 'punches_Z/punch2/jab2_4.png');
        this.load.image('ls_p2_5', lsPath + 'punches_Z/punch2/jab2_5.png');
        
        this.load.image('ls_p3_1', lsPath + 'punches_Z/punch3/heavy_punch_1.png');
        this.load.image('ls_p3_2', lsPath + 'punches_Z/punch3/heavy_punch_2.png');
        this.load.image('ls_p3_3', lsPath + 'punches_Z/punch3/heavy_punch_3.png');
        
        this.load.image('ls_p4_1', lsPath + 'punches_Z/punch4/body_blow_1.png');
        this.load.image('ls_p4_2', lsPath + 'punches_Z/punch4/body_blow_2.png');
        
        this.load.image('ls_p5_1', lsPath + 'punches_Z/punch5/uppercut1.png');
        this.load.image('ls_p5_2', lsPath + 'punches_Z/punch5/uppercut2.png');
        
        this.load.image('ls_p6_1', lsPath + 'punches_Z/punch6/uppercut2_1.png');
        this.load.image('ls_p6_2', lsPath + 'punches_Z/punch6/uppercut2_2.png');
        this.load.image('ls_p6_3', lsPath + 'punches_Z/punch6/uppercut2_3.png');
        this.load.image('ls_p6_4', lsPath + 'punches_Z/punch6/uppercut2_4.png');
        this.load.image('ls_p6_5', lsPath + 'punches_Z/punch6/uppercut2_5.png');
        this.load.image('ls_p6_6', lsPath + 'punches_Z/punch6/uppercut2_6.png');
        
        this.load.image('ls_p7_1', lsPath + 'punches_Z/punch7/power_jab_1.png');
        this.load.image('ls_p7_2', lsPath + 'punches_Z/punch7/power_jab_2.png');
        this.load.image('ls_p7_3', lsPath + 'punches_Z/punch7/power_jab_3.png');
        this.load.image('ls_p7_4', lsPath + 'punches_Z/punch7/power_jab_4.png');
        this.load.image('ls_p7_5', lsPath + 'punches_Z/punch7/power_jab_5.png');
        
        this.load.image('ls_p8_1', lsPath + 'punches_Z/punch8/heavy_punch2_1.png');
        this.load.image('ls_p8_2', lsPath + 'punches_Z/punch8/heavy_punch2_2.png');
        this.load.image('ls_p8_3', lsPath + 'punches_Z/punch8/heavy_punch2_3.png');

        // X Swords/Strikes
        this.load.image('ls_x1_1', lsPath + 'sword_attacks_X/strike1/sword.png');
        this.load.image('ls_x1_2', lsPath + 'sword_attacks_X/strike1/sword1.png');
        this.load.image('ls_x2_1', lsPath + 'sword_attacks_X/strike2/sword2.png');
        this.load.image('ls_x2_2', lsPath + 'sword_attacks_X/strike2/sword3.png');
        this.load.image('ls_x3_1', lsPath + 'sword_attacks_X/strike3/sword4.png');
        this.load.image('ls_x4_1', lsPath + 'sword_attacks_X/strike4/sword5.png');
        this.load.image('ls_x4_2', lsPath + 'sword_attacks_X/strike4/sword6.png');

        // C Kicks
        this.load.image('ls_c1_1', lsPath + 'kicks/kick1/cyborg_kick_combos_000.png');
        this.load.image('ls_c1_2', lsPath + 'kicks/kick1/cyborg_kick_combos_001.png');
        this.load.image('ls_c1_3', lsPath + 'kicks/kick1/cyborg_kick_combos_002.png');
        this.load.image('ls_c2_1', lsPath + 'kicks/kick2/kick2_1.png');
        this.load.image('ls_c2_2', lsPath + 'kicks/kick2/kick2_2.png');
        this.load.image('ls_c3_1', lsPath + 'kicks/kick3/kick3_1_idle.png');
        this.load.image('ls_c3_2', lsPath + 'kicks/kick3/kick3_2.png');
        this.load.image('ls_c3_3', lsPath + 'kicks/kick3/kick3_3.png');
        this.load.image('ls_c3_4', lsPath + 'kicks/kick3/kick3_4.png');

        // V Projectile Combo
        this.load.image('ls_v1_1', lsPath + 'projectiles/blast_combo_C/blast1/small_blast_0.png');
        this.load.image('ls_v1_2', lsPath + 'projectiles/blast_combo_C/blast1/small_blast_1.png');
        this.load.image('ls_v1_3', lsPath + 'projectiles/blast_combo_C/blast1/small_blast_2.png');
        // V Blast 1 projectile frames
        for (let i = 1; i <= 5; i++) this.load.image(`ls_blast1_proj_${i}`, lsPath + `projectiles/blast_combo_C/blast1/small_blast_projectile${i}.png`);
        
        this.load.image('ls_v2_1', lsPath + 'projectiles/blast_combo_C/blast2/blast_beam_0.png');
        this.load.image('ls_v2_2', lsPath + 'projectiles/blast_combo_C/blast2/blast_beam_1.png');
        this.load.image('ls_v2_3', lsPath + 'projectiles/blast_combo_C/blast2/blast_beam_2.png');
        // V Blast 2 projectile frames
        for (let i = 4; i <= 7; i++) this.load.image(`ls_blast2_proj_${i-3}`, lsPath + `projectiles/blast_combo_C/blast2/blast_beam_${i}_projectile.png`);

        // E Key - Big Energy Beam (blast_E folder)
        // Character animation frames (blast_00 to blast_05)
        for (let i = 0; i <= 5; i++) this.load.image(`ls_blast_${i}`, lsPath + `projectiles/blast_E/blast_0${i}.png`);
        // E projectile frames (charged1 to charged6) - THE ACTUAL PROJECTILE
        for (let i = 1; i <= 6; i++) this.load.image(`ls_blast3_proj_${i}`, lsPath + `projectiles/blast_E/charged${i}.png`);
        // Additional E projectile frame (sci-fi mage action)
        this.load.image('ls_blast3_proj_7', lsPath + 'projectiles/sci_fi_mage_actions_009.png');
        for (let i = 1; i <= 6; i++) this.load.image(`ls_power_${i}`, lsPath + `power_up/power_up_${i}.png`);
        for (let i = 1; i <= 4; i++) this.load.image(`ls_shield_${i}`, lsPath + `shield/shield_${i}.png`);

        // Lord Soul Jump Attacks
        this.load.image('ls_jump_up', lsPath + 'jump/jump_up.png');
        for (let i = 1; i <= 5; i++) this.load.image(`ls_jump_m_${i}`, lsPath + `jump/jump+movement/jump+move${i}.png`);
        
        // Jump Punch Combo (Fixed paths)
        for (let i = 1; i <= 4; i++) this.load.image(`ls_jp_${i}`, lsPath + `jump_attack/jump_punch_combo/jump_punch${i}.png`);
        this.load.image('ls_jp_5_proj', lsPath + 'jump_attack/jump_punch_combo/jump_punch5_projectile.png');
        
        // Jump Kick
        for (let i = 1; i <= 6; i++) {
            let fName = (i === 3) ? 'jump_kick3_hit.png' : `jump_kick${i}.png`;
            this.load.image(`ls_jk_${i}`, lsPath + `jump_attack/jump_kick/${fName}`);
        }
        
        // Jump Sword
        this.load.image('ls_js_1', lsPath + 'jump_attack/jump_attack/jump_attack_1.png');
        this.load.image('ls_js_2', lsPath + 'jump_attack/jump_attack/jump_attack_2.png');
        this.load.image('ls_js_3', lsPath + 'jump_attack/jump_sword/jump_attack_3.png');

        // Lord Soul Movement Kicks
        this.load.image('ls_mkick_1', lsPath + 'kicks/movement+kick/mkick1.png');
        this.load.image('ls_mkick_2', lsPath + 'kicks/movement+kick/mkick2.png');
        this.load.image('ls_mkick_3', lsPath + 'kicks/movement+kick/mkick3.png');

        // Lord Soul Blast E+Movement
        this.load.image('ls_bigbeam_1', lsPath + 'projectiles/blast_E+Movement/bigbeam1.png');
        this.load.image('ls_bigbeam_2', lsPath + 'projectiles/blast_E+Movement/bigbeam2.png');
        this.load.image('ls_bigbeam_3', lsPath + 'projectiles/blast_E+Movement/bigbeam3.png');

        // Lord Soul Projectile Effects (Warped shooting fx) - REMOVED: Using actual Lord Soul projectiles now

        // --- ENEMIES ---
        const enemyRoot = 'assets/images/enemies/';
        this.load.image('walker_i', enemyRoot + 'alien-walking-enemy/PNG/alien-enemy-idle.png');
        this.load.image('walker_w', enemyRoot + 'alien-walking-enemy/PNG/alien-enemy-walk.png');
        this.load.image('boss_tex', 'assets/images/enemies/enemy-cyborg.png');

        const cyborgFrames = ['001', '002', '004', '005', '006', '007', '008', '009', '010', '011', '012', '013', '014', '015', '017', '020'];
        cyborgFrames.forEach(f => this.load.image(`cyborg_${f}`, enemyRoot + `cyborg_enemy/sprite_${f}.png`));

        for (let i = 1; i <= 4; i++) this.load.image(`drone${i}`, `new_tilesets/warped_city_files/SPRITES/misc/drone/drone-${i}.png`);

        // --- PROPS & VFX ---
        for (let i = 1; i <= 4; i++) {
            this.load.image(`wc_neon_${i}`, `new_tilesets/warped_city_files/ENVIRONMENT/props/banner-neon/banner-neon-${i}.png`);
            this.load.image(`wc_monitor_${i}`, `new_tilesets/warped_city_files/ENVIRONMENT/props/monitorface/monitor-face-${i}.png`);
        }
        this.load.spritesheet('exp', 'assets/images/Explosion/spritesheet/explosion-animation.png', { frameWidth: 100, frameHeight: 100 });
        this.load.image('orb', 'assets/images/characters/dr-ignite/frames/blast_projectile_01.png');
        this.load.image('barrel1', 'assets/images/Objects/Barrel (1).png');
        this.load.image('box', 'assets/images/Objects/Box.png');
        this.load.image('warped_vehicle_police', 'new_tilesets/warped_city_files/SPRITES/vehicles/v-police.png');
        this.load.image('warped_vehicle_truck', 'new_tilesets/warped_city_files/SPRITES/vehicles/v-truck.png');

        // --- AUDIO ---
        this.load.audio('sa', 'assets/sfx/snd_select.ogg');
        this.load.audio('sj', 'assets/sfx/snd_jump.ogg');
        this.load.audio('sh', 'assets/sfx/snd_hurt.ogg');
        this.load.audio('hit_light', 'assets/sfx/snd_snap.ogg');
        this.load.audio('hit_medium', 'assets/sfx/snd_landing.ogg');
        this.load.audio('hit_heavy', 'assets/sfx/snd_explosion_solid.ogg');
        this.load.audio('m1', 'assets/music/Neon Shadows - LEVEL 1.mp3');
        this.load.audio('m2', 'assets/music/Neon Shadows PART 2 LEVEL 2.mp3');
        this.load.audio('mc', 'assets/music/Shadows in the Alley - CUT SCENES.mp3');
        this.load.audio('music_drama', 'assets/music/music_drama_loop.wav');
        this.load.audio('music_aetherion', 'assets/music/music_aetherion_loop.wav');
        this.load.audio('music_khemra', 'assets/music/music_khemra_loop.wav');

        // --- CUSTOM SCENE BGM ---
        this.load.audio('title_bgm', 'assets/music/Nebula_s_Lament.mp3');
        this.load.audio('cutscene_bgm', 'assets/music/EA_intro_cutscene_music_1.mp3');
        this.load.audio('train_bgm', 'assets/music/Neon Shadows PART 2 LEVEL 2.mp3');
        this.load.audio('boss_bgm', 'assets/music/Nebula_Confrontation.mp3');
    }

    create() {
        console.log("%c --- BOOT SCENE CREATE START --- ", "background: #ff00ff; color: #fff; font-weight: bold;");

        try {
            // VFX Anims
            this.anims.create({ key: 'explode', frames: this.anims.generateFrameNumbers('exp'), frameRate: 15, repeat: 0 });
            this.anims.create({ key: 'orb_f', frames: [{ key: 'orb' }], frameRate: 1, repeat: -1 });
            this.anims.create({ key: 'ignite_projectile_anim', frames: [{ key: 'ignite_blast_projectile_01' }, { key: 'ignite_blast_projectile_02' }], frameRate: 10, repeat: -1 });

            const createModernAnim = (key, prefix, frameNumbers, repeat = -1) => {
                const frames = frameNumbers.map(n => {
                    const fKey = `${prefix}_${n.toString().padStart(4, '0')}`;
                    if (!this.textures.exists(fKey)) {
                        console.error(`Missing frame texture for ${key}: ${fKey}`);
                        return null;
                    }
                    return { key: fKey };
                }).filter(f => f !== null);

                if (frames.length > 0) {
                    this.anims.create({ key, frames, frameRate: 15, repeat });
                    console.log(`%c Animation Created: ${key} (${frames.length} frames) `, "color: #00ffaa;");
                } else {
                    console.error(`Failed to create animation ${key}: No valid frames found.`);
                }
            };

            // Cherry Anims — Full move set
            createModernAnim('cherry_idle', 'cherry', [3, 6, 9, 12, 15, 18]);
            createModernAnim('cherry_run', 'cherry', [24, 26, 28, 29, 31, 33, 35, 37]);
            // Ground combo chain — matched to hit1-hit5 folders
            // Hit 1: Fast jab (18fps) — 3 frames
            createModernAnim('cherry_atk1', 'cherry', [235, 237, 239], 0);
            this.anims.get('cherry_atk1')?.msPerFrame && (this.anims.get('cherry_atk1').msPerFrame = 1000 / 18);
            // Hit 2: Follow-up strike (18fps) — 3 frames
            createModernAnim('cherry_atk2', 'cherry', [240, 242, 243], 0);
            this.anims.get('cherry_atk2')?.msPerFrame && (this.anims.get('cherry_atk2').msPerFrame = 1000 / 18);
            // Hit 3: Multi-strike flurry (14fps) — 8 frames
            createModernAnim('cherry_atk3', 'cherry', [247, 249, 251, 253, 254, 256, 259, 261], 0);
            this.anims.get('cherry_atk3')?.msPerFrame && (this.anims.get('cherry_atk3').msPerFrame = 1000 / 14);
            // Hit 4: Kick chain (14fps) — 6 frames
            createModernAnim('cherry_atk4', 'cherry', [263, 265, 268, 270, 271, 274], 0);
            this.anims.get('cherry_atk4')?.msPerFrame && (this.anims.get('cherry_atk4').msPerFrame = 1000 / 14);
            // Hit 5: FINISHER (10fps) — 6 frames, big impact
            createModernAnim('cherry_atk5', 'cherry', [276, 278, 280, 281, 282, 573], 0);
            this.anims.get('cherry_atk5')?.msPerFrame && (this.anims.get('cherry_atk5').msPerFrame = 1000 / 10);
            // (Cherry combo capped at 5 hits)
            // Air attacks
            createModernAnim('cherry_atk_air_horiz', 'cherry', [301, 303, 305, 307, 310, 312], 0);
            createModernAnim('cherry_atk_air_spin', 'cherry', [313, 315, 317, 320, 324], 0);
            // Special
            createModernAnim('cherry_special', 'cherry', [399, 401, 403, 405, 407, 411, 414, 416], 0);
            // Jump & Fall
            createModernAnim('cherry_jump', 'cherry', [130, 132], 0);
            createModernAnim('cherry_jump_double', 'cherry', [134, 138, 140, 143], 0);
            createModernAnim('cherry_fall', 'cherry', [146, 150, 153], -1);
            createModernAnim('cherry_hurt', 'cherry', [156, 158], 0);

            // Shoot (expanded from 1 frame to full sequence)
            createModernAnim('cherry_shoot', 'cherry', [468, 470, 472, 475, 478, 480], 0);
            // Hover & Crouch
            createModernAnim('cherry_hover', 'cherry', [544, 546, 548, 550, 552, 554, 556, 558]);
            createModernAnim('cherry_crouch', 'cherry', [570, 573, 575, 577, 579, 581, 583], 0);

            // Adam Anims — Refined for Weight & Impact
            createModernAnim('adam_idle', 'adam', [0, 3, 6, 9, 11, 14, 17, 20, 23]);
            createModernAnim('adam_run', 'adam', [47, 49, 51, 53, 56, 58, 60, 62]);

            // Refined Combo Chain
            createModernAnim('adam_atk1', 'adam', [88, 89], 0);
            this.anims.get('adam_atk1')?.msPerFrame && (this.anims.get('adam_atk1').getFrameAt(1).duration = 150); // Linger on hit 1

            createModernAnim('adam_atk2', 'adam', [90, 91], 0);
            this.anims.get('adam_atk2')?.msPerFrame && (this.anims.get('adam_atk2').getFrameAt(1).duration = 150); // Linger on hit 2

            createModernAnim('adam_atk3', 'adam', [93, 94], 0);
            this.anims.get('adam_atk3')?.msPerFrame && (this.anims.get('adam_atk3').getFrameAt(1).duration = 200); // Heavy kick swing

            createModernAnim('adam_atk4', 'adam', [104, 105, 106, 108], 0);
            this.anims.get('adam_atk4')?.msPerFrame && (this.anims.get('adam_atk4').getFrameAt(2).duration = 180); // Roundhouse linger

            createModernAnim('adam_atk5', 'adam', [311, 312, 315, 321, 323, 325, 328, 330, 331, 332], 0);
            // Finisher weight: speed up the windup, stretch the extension
            if (this.anims.get('adam_atk5')) {
                const a5 = this.anims.get('adam_atk5');
                a5.getFrameAt(0).duration = 50;
                a5.getFrameAt(1).duration = 50;
                a5.getFrameAt(5).duration = 250; // IMPACT FRAME LINGER
                a5.getFrameAt(6).duration = 200;
            }

            createModernAnim('adam_jump', 'adam', [132, 134], 0);
            createModernAnim('adam_fall', 'adam', [138, 140, 143], -1);
            createModernAnim('adam_hurt', 'adam', [147, 151, 154], 0);

            // Chibi Soul (prefix: default) — all from CHIBI_SOUL individual frames
            this.anims.create({ key: 'default_idle', frames: [{ key: 'cs_idle' }], frameRate: 8, repeat: -1 });
            this.anims.create({ key: 'default_run', frames: [{ key: 'cs_forward' }], frameRate: 12, repeat: -1 }); // Replaced 8-frame run with forward float
            this.anims.create({ key: 'default_crouch', frames: [{ key: 'cs_crouch' }], frameRate: 1, repeat: 0 });
            this.anims.create({ key: 'default_hurt', frames: [{ key: 'cs_idle' }], frameRate: 1, repeat: 0 });
            this.anims.create({ key: 'default_fall', frames: [{ key: 'cs_jump_up_4' }], frameRate: 1, repeat: -1 });

            this.anims.create({ key: 'default_jump', frames: Array.from({ length: 4 }, (_, i) => ({ key: `cs_jump_up_${i + 1}` })), frameRate: 10, repeat: 0 });
            this.anims.create({ key: 'default_jump_forward', frames: Array.from({ length: 6 }, (_, i) => ({ key: `cs_jump_fwd_${i + 1}` })), frameRate: 12, repeat: 0 });
            this.anims.create({ key: 'default_hover', frames: Array.from({ length: 6 }, (_, i) => ({ key: `cs_hover_${i + 1}` })), frameRate: 12, repeat: -1 });
            // Chibi Soul Special Blast Attack (8 frames) & Projectile
            const csBlastFrames = Array.from({ length: 8 }, (_, i) => ({ key: `cs_blast_${i + 1}` }));
            this.anims.create({ key: 'default_shoot', frames: csBlastFrames, frameRate: 12, repeat: 0 });
            this.anims.create({ key: 'default_special', frames: csBlastFrames, frameRate: 12, repeat: 0 }); // Map special input to blast as well

            const csProjFrames = Array.from({ length: 4 }, (_, i) => ({ key: `cs_proj_${i + 1}` }));
            this.anims.create({ key: 'default_projectile_anim', frames: csProjFrames, frameRate: 12, repeat: -1 });

            // Chibi Soul 9-Hit Melee Combo — variable frame rates for weight & impact
            // Hits 1-3: Fast jabs (16fps) — snappy openers
            this.anims.create({ key: 'default_atk1', frames: [{ key: 'cs_m1_01' }, { key: 'cs_m1_02' }, { key: 'cs_m1_03' }], frameRate: 16, repeat: 0 });
            this.anims.create({ key: 'default_atk2', frames: [{ key: 'cs_m2_01' }, { key: 'cs_m2_02' }, { key: 'cs_m2_03' }], frameRate: 16, repeat: 0 });
            this.anims.create({ key: 'default_atk3', frames: [{ key: 'cs_m3_01' }, { key: 'cs_m3_02' }], frameRate: 16, repeat: 0 });
            // Hits 4-6: Building momentum (13fps)
            this.anims.create({ key: 'default_atk4', frames: [{ key: 'cs_m4_01' }, { key: 'cs_m4_02' }, { key: 'cs_m4_03' }], frameRate: 13, repeat: 0 });
            this.anims.create({ key: 'default_atk5', frames: [{ key: 'cs_m5_01' }, { key: 'cs_m5_02' }], frameRate: 13, repeat: 0 });
            this.anims.create({ key: 'default_atk6', frames: [{ key: 'cs_m6_01' }, { key: 'cs_m6_02' }], frameRate: 13, repeat: 0 });
            // Hit 7: Heavy multi-frame strike (10fps) — big impact
            this.anims.create({ key: 'default_atk7', frames: [{ key: 'cs_m7_01' }, { key: 'cs_m7_02' }, { key: 'cs_m7_03' }, { key: 'cs_m7_04' }], frameRate: 10, repeat: 0 });
            // Hits 8-9: Decisive finishers (12fps)
            this.anims.create({ key: 'default_atk8', frames: [{ key: 'cs_m8_01' }, { key: 'cs_m8_02' }], frameRate: 12, repeat: 0 });
            this.anims.create({ key: 'default_atk9', frames: [{ key: 'cs_m9_01' }, { key: 'cs_m9_02' }], frameRate: 12, repeat: 0 });

            // Big Z Anims (Frame by Frame)
            this.anims.create({ key: 'bigz_idle', frames: [1, 2, 3, 4, 5].map(i => ({ key: `bigz_idle_${i}` })), frameRate: 8, repeat: -1 });
            this.anims.create({ key: 'bigz_walk', frames: [6, 7, 8, 9].map(i => ({ key: `bigz_walk_${i}` })), frameRate: 8, repeat: -1 });
            this.anims.create({ key: 'bigz_run', frames: [10, 11, 12, 13, 14].map(i => ({ key: `bigz_run_${i}` })), frameRate: 10, repeat: -1 });
            this.anims.create({ key: 'bigz_jump', frames: [{ key: 'bigz_jump_up_1' }, { key: 'bigz_jump_up_2' }, { key: 'bigz_jump_fall_1' }, { key: 'bigz_jump_fall_2' }], frameRate: 8, repeat: 0 });
            this.anims.create({ key: 'bigz_fall', frames: [{ key: 'bigz_jump_fall_1' }, { key: 'bigz_jump_fall_2' }], frameRate: 8, repeat: -1 });
            this.anims.create({ key: 'bigz_hurt', frames: [{ key: 'bigz_idle_1' }], frameRate: 1, repeat: 0 });

            // Big Z Attacks
            this.anims.create({ key: 'bigz_atk1', frames: [{ key: 'bigz_atk_1' }], frameRate: 12, repeat: 0 });
            this.anims.create({ key: 'bigz_atk2', frames: [{ key: 'bigz_atk_2' }], frameRate: 12, repeat: 0 });
            this.anims.create({ key: 'bigz_atk3', frames: [{ key: 'bigz_atk_3' }], frameRate: 12, repeat: 0 });
            this.anims.create({ key: 'bigz_atk4', frames: [{ key: 'bigz_atk_4' }], frameRate: 12, repeat: 0 });
            this.anims.create({ key: 'bigz_atk5', frames: [{ key: 'bigz_atk_5' }], frameRate: 12, repeat: 0 });
            this.anims.create({ key: 'bigz_special', frames: [{ key: 'bigz_special_blast' }], frameRate: 12, repeat: 0 });
            this.anims.create({ key: 'bigz_hover', frames: [{ key: 'bigz_fly' }], frameRate: 12, repeat: -1 });

            this.anims.create({ key: 'ignite_shoot', frames: [{ key: 'ignite_combo_0' }, { key: 'ignite_blast_projectile_01' }], frameRate: 10, repeat: 0 });

            // Dr. Ignite Anims — Full move set
            this.anims.create({ key: 'ignite_idle', frames: [{ key: 'ignite_idle_01' }, { key: 'ignite_idle_02' }], frameRate: 6, repeat: -1 });
            this.anims.create({ key: 'ignite_run', frames: [{ key: 'ignite_run_1' }, { key: 'ignite_run_2' }, { key: 'ignite_run_3' }], frameRate: 10, repeat: -1 });
            this.anims.create({ key: 'ignite_jump', frames: [{ key: 'ignite_jump_01' }, { key: 'ignite_jump_02' }, { key: 'ignite_jump_03_land' }], frameRate: 8, repeat: 0 });
            this.anims.create({ key: 'ignite_fall', frames: [{ key: 'ignite_jump_01' }], frameRate: 1, repeat: -1 });
            this.anims.create({ key: 'ignite_hurt', frames: [{ key: 'ignite_idle_01' }], frameRate: 1, repeat: 0 });

            // Combo chain (4 hits)
            this.anims.create({ key: 'ignite_atk1', frames: [{ key: 'ignite_combo_0' }, { key: 'ignite_combo_01' }, { key: 'ignite_combo_02' }, { key: 'ignite_combo_03_hit' }], frameRate: 12, repeat: 0 });
            this.anims.create({ key: 'ignite_atk2', frames: [{ key: 'ignite_combo_04_hit' }, { key: 'ignite_combo_5_hit' }], frameRate: 12, repeat: 0 });
            this.anims.create({ key: 'ignite_atk3', frames: [{ key: 'ignite_combo_05' }, { key: 'ignite_combo_06' }, { key: 'ignite_combo_07' }, { key: 'ignite_combo_08_hit' }], frameRate: 12, repeat: 0 });
            // 4th combo finisher (NEW)
            this.anims.create({ key: 'ignite_atk4', frames: [{ key: 'ignite_combo_08_hit' }, { key: 'ignite_combo_09' }], frameRate: 12, repeat: 0 });
            // Dash+Attack special (NEW)
            this.anims.create({ key: 'ignite_special', frames: [{ key: 'ignite_light_special_01' }, { key: 'ignite_combo_09' }], frameRate: 10, repeat: 0 });
            // Energy blast attack (NEW)
            this.anims.create({ key: 'ignite_blast', frames: [{ key: 'ignite_blast_0' }, { key: 'ignite_blast_01' }, { key: 'ignite_blast_02' }, { key: 'ignite_blast_03' }], frameRate: 10, repeat: 0 });

            // --- CYBORG NINJA (Neon Ninja) — prefix: ninja ---
            this.anims.create({ key: 'ninja_idle', frames: Array.from({ length: 8 }, (_, i) => ({ key: `cn_idle_${i}` })), frameRate: 8, repeat: -1 });
            this.anims.create({ key: 'ninja_run', frames: Array.from({ length: 8 }, (_, i) => ({ key: `cn_run_${i}` })), frameRate: 12, repeat: -1 });
            this.anims.create({ key: 'ninja_jump', frames: Array.from({ length: 5 }, (_, i) => ({ key: `cn_jump_${i}` })), frameRate: 10, repeat: 0 });
            this.anims.create({ key: 'ninja_fall', frames: [{ key: 'cn_jump_4' }], frameRate: 1, repeat: -1 });
            this.anims.create({ key: 'ninja_hurt', frames: Array.from({ length: 5 }, (_, i) => ({ key: `cn_hurt_${i}` })), frameRate: 10, repeat: 0 });
            this.anims.create({ key: 'ninja_crouch', frames: [{ key: 'cn_crouch_0' }, { key: 'cn_crouch_1' }], frameRate: 6, repeat: 0 });
            this.anims.create({ key: 'ninja_dash', frames: Array.from({ length: 4 }, (_, i) => ({ key: `cn_dash_${i}` })), frameRate: 12, repeat: 0 });
            this.anims.create({ key: 'ninja_blast', frames: Array.from({ length: 3 }, (_, i) => ({ key: `cn_blast_${i}` })), frameRate: 10, repeat: 0 });
            // 4-hit melee combo
            // Sword combo attacks (replacing melee)
            this.anims.create({ key: 'ninja_atk1', frames: [{ key: 'cn_sw1_1' }, { key: 'cn_sw1_2' }, { key: 'cn_sw1_3' }], frameRate: 16, repeat: 0 });
            this.anims.create({ key: 'ninja_atk2', frames: [{ key: 'cn_sw2_1' }, { key: 'cn_sw2_2' }, { key: 'cn_sw2_3' }], frameRate: 16, repeat: 0 });
            this.anims.create({ key: 'ninja_atk3', frames: [{ key: 'cn_sw3_1' }, { key: 'cn_sw3_2' }], frameRate: 14, repeat: 0 });
            this.anims.create({ key: 'ninja_atk4', frames: [{ key: 'cn_sw4_1' }, { key: 'cn_sw4_2' }], frameRate: 10, repeat: 0 });
            // Somersault double-jump
            this.anims.create({ key: 'ninja_jump_double', frames: [{ key: 'cn_som_1' }, { key: 'cn_som_2' }, { key: 'cn_som_3' }, { key: 'cn_som_4' }], frameRate: 12, repeat: 0 });

            // --- LORD SOUL (naga-soul-26) ---
            this.anims.create({ key: 'lordsoul_idle', frames: [{ key: 'ls_idle' }], frameRate: 6, repeat: -1 });
            this.anims.create({ key: 'lordsoul_walk', frames: Array.from({ length: 6 }, (_, i) => ({ key: `ls_walk_${i + 1}` })), frameRate: 8, repeat: -1 });
            this.anims.create({ key: 'lordsoul_move', frames: [{ key: 'ls_move' }], frameRate: 6, repeat: -1 });
            this.anims.create({ key: 'lordsoul_run', frames: Array.from({ length: 8 }, (_, i) => ({ key: `ls_run_${i + 7}` })), frameRate: 14, repeat: -1 });
            this.anims.create({ key: 'lordsoul_dash_aura', frames: Array.from({ length: 8 }, (_, i) => ({ key: `ls_dash_aura_${i + 1}` })), frameRate: 16, repeat: -1 });
            this.anims.create({ key: 'lordsoul_fly', frames: Array.from({ length: 6 }, (_, i) => ({ key: `ls_fly_${i + 1}` })), frameRate: 12, repeat: -1 });
            this.anims.create({ key: 'lordsoul_hover', frames: [{ key: 'ls_hover_1' }, { key: 'ls_hover_2' }, { key: 'ls_hover_3' }], frameRate: 10, repeat: -1 });
            this.anims.create({ key: 'lordsoul_jump', frames: [{ key: 'ls_jump_up' }], frameRate: 1, repeat: 0 });
            this.anims.create({ key: 'lordsoul_jump_forward', frames: [{ key: 'ls_jump_up' }], frameRate: 1, repeat: 0 });
            this.anims.create({ key: 'lordsoul_fall', frames: [{ key: 'ls_jump_up' }], frameRate: 1, repeat: 0 });
            this.anims.create({ key: 'lordsoul_hurt', frames: [{ key: 'ls_hit1_1' }, { key: 'ls_hit1_2' }], frameRate: 10, repeat: 0 });

            // 8-Hit Z Punches Combo - Streets of Rage 2 / Street Fighter 2 timing
            // Light jabs (Ultra snappy)
            this.anims.create({ key: 'lordsoul_atk1', frames: [{ key: 'ls_p1_1' }, { key: 'ls_p1_2', duration: 80 }], frameRate: 24, repeat: 0 });
            this.anims.create({ key: 'lordsoul_atk2', frames: [{ key: 'ls_p2_1' }, { key: 'ls_p2_2' }, { key: 'ls_p2_3', duration: 100 }, { key: 'ls_p2_4' }, { key: 'ls_p2_5' }], frameRate: 22, repeat: 0 });
            
            // Medium strikes
            this.anims.create({ key: 'lordsoul_atk3', frames: [{ key: 'ls_p3_1' }, { key: 'ls_p3_2' }, { key: 'ls_p3_3', duration: 150 }], frameRate: 18, repeat: 0 });
            this.anims.create({ key: 'lordsoul_atk4', frames: [{ key: 'ls_p4_1' }, { key: 'ls_p4_2', duration: 150 }], frameRate: 16, repeat: 0 });
            
            // Heavy uppercuts (Wind-up on frame 1)
            this.anims.create({ key: 'lordsoul_atk5', frames: [{ key: 'ls_p5_1', duration: 120 }, { key: 'ls_p5_2', duration: 200 }], frameRate: 14, repeat: 0 });
            this.anims.create({ key: 'lordsoul_atk6', frames: [{ key: 'ls_p6_1', duration: 100 }, { key: 'ls_p6_2' }, { key: 'ls_p6_3' }, { key: 'ls_p6_4' }, { key: 'ls_p6_5' }, { key: 'ls_p6_6', duration: 200 }], frameRate: 20, repeat: 0 });
            
            // Power combos / Finishers (Impact and Force)
            this.anims.create({ key: 'lordsoul_atk7', frames: [{ key: 'ls_p7_1' }, { key: 'ls_p7_2' }, { key: 'ls_p7_3' }, { key: 'ls_p7_4', duration: 150 }, { key: 'ls_p7_5', duration: 250 }], frameRate: 20, repeat: 0 });
            this.anims.create({ key: 'lordsoul_atk8', frames: [{ key: 'ls_p8_1', duration: 100 }, { key: 'ls_p8_2' }, { key: 'ls_p8_3', duration: 400 }], frameRate: 16, repeat: 0 });

            // 4-Hit X Sword Combo
            this.anims.create({ key: 'lordsoul_sw1', frames: [{ key: 'ls_x1_1' }, { key: 'ls_x1_2', duration: 150 }], frameRate: 16, repeat: 0 });
            this.anims.create({ key: 'lordsoul_sw2', frames: [{ key: 'ls_x2_1' }, { key: 'ls_x2_2', duration: 150 }], frameRate: 16, repeat: 0 });
            this.anims.create({ key: 'lordsoul_sw3', frames: [{ key: 'ls_x3_1', duration: 200 }], frameRate: 12, repeat: 0 });
            this.anims.create({ key: 'lordsoul_sw4', frames: [{ key: 'ls_x4_1' }, { key: 'ls_x4_2', duration: 300 }], frameRate: 14, repeat: 0 });

            // C Kicks - Faster, snappy leg attacks
            this.anims.create({ key: 'lordsoul_kick1', frames: [{ key: 'ls_c1_1' }, { key: 'ls_c1_2' }, { key: 'ls_c1_3', duration: 120 }], frameRate: 22, repeat: 0 });
            this.anims.create({ key: 'lordsoul_kick2', frames: [{ key: 'ls_c2_1' }, { key: 'ls_c2_2', duration: 150 }], frameRate: 22, repeat: 0 });
            this.anims.create({ key: 'lordsoul_kick3', frames: [{ key: 'ls_c3_1' }, { key: 'ls_c3_2' }, { key: 'ls_c3_3' }, { key: 'ls_c3_4', duration: 200 }], frameRate: 18, repeat: 0 });

            // V Key - Energy Blast Combo (2 hits, then E is separate big beam)
            this.anims.create({ key: 'lordsoul_blast1', frames: [{ key: 'ls_v1_1' }, { key: 'ls_v1_2' }, { key: 'ls_v1_3', duration: 120 }], frameRate: 18, repeat: 0 });
            this.anims.create({ key: 'lordsoul_blast2', frames: [{ key: 'ls_v2_1' }, { key: 'ls_v2_2' }, { key: 'ls_v2_3', duration: 180 }], frameRate: 16, repeat: 0 });
            
            // E Key - Big Energy Beam (separate from V combo)
            this.anims.create({ key: 'lordsoul_blast3', frames: [{ key: 'ls_blast_0' }, { key: 'ls_blast_1' }, { key: 'ls_blast_2' }, { key: 'ls_blast_3' }, { key: 'ls_blast_4' }, { key: 'ls_blast_5', duration: 250 }], frameRate: 18, repeat: 0 });

            // Lord Soul Projectiles (animated sprites)
            this.anims.create({ key: 'lordsoul_blast1_proj', frames: Array.from({ length: 5 }, (_, i) => ({ key: `ls_blast1_proj_${i + 1}` })), frameRate: 20, repeat: -1 });
            this.anims.create({ key: 'lordsoul_blast2_proj', frames: Array.from({ length: 4 }, (_, i) => ({ key: `ls_blast2_proj_${i + 1}` })), frameRate: 18, repeat: -1 });
            this.anims.create({ key: 'lordsoul_blast3_proj', frames: Array.from({ length: 7 }, (_, i) => ({ key: `ls_blast3_proj_${i + 1}` })), frameRate: 16, repeat: -1 }); // E beam: charged1-6 + sci-fi swirl

            this.anims.create({ key: 'lordsoul_powerup', frames: [{ key: 'ls_power_1' }, { key: 'ls_power_2' }, { key: 'ls_power_3' }, { key: 'ls_power_4' }, { key: 'ls_power_5' }, { key: 'ls_power_6' }], frameRate: 12, repeat: -1 });

            // Lord Soul Jump Attacks
            // Jump Punch Combo - Split for manual chaining (1 press = 1 hit)
            this.anims.create({ key: 'lordsoul_jump_atk1', frames: [{ key: 'ls_jp_1' }], frameRate: 20, repeat: 0 });
            this.anims.create({ key: 'lordsoul_jump_atk2', frames: [{ key: 'ls_jp_2' }], frameRate: 20, repeat: 0 });
            this.anims.create({ key: 'lordsoul_jump_atk3', frames: [{ key: 'ls_jp_3' }], frameRate: 20, repeat: 0 });
            this.anims.create({ key: 'lordsoul_jump_atk4', frames: [{ key: 'ls_jp_4' }], frameRate: 20, repeat: 0 });
            this.anims.create({ key: 'lordsoul_jump_atk5', frames: [{ key: 'ls_jp_5_proj' }], frameRate: 20, repeat: 0 });

            // Jump Kick (6 frames)
            this.anims.create({ key: 'lordsoul_jump_kick', frames: [{ key: 'ls_jk_1' }, { key: 'ls_jk_2' }, { key: 'ls_jk_3', duration: 200 }, { key: 'ls_jk_4' }, { key: 'ls_jk_5' }, { key: 'ls_jk_6' }], frameRate: 15, repeat: 0 });
            // Jump Sword (3 frames)
            this.anims.create({ key: 'lordsoul_jump_sword', frames: [{ key: 'ls_js_1' }, { key: 'ls_js_2', duration: 150 }, { key: 'ls_js_3', duration: 200 }], frameRate: 12, repeat: 0 });

            // Lord Soul Movement Kicks
            this.anims.create({ key: 'lordsoul_mkick', frames: [{ key: 'ls_mkick_1' }, { key: 'ls_mkick_2' }, { key: 'ls_mkick_3' }], frameRate: 12, repeat: 0 });

            // Lord Soul Big Beam (E+Movement)
            this.anims.create({ key: 'lordsoul_bigbeam', frames: [{ key: 'ls_bigbeam_1' }, { key: 'ls_bigbeam_2' }, { key: 'ls_bigbeam_3' }], frameRate: 10, repeat: -1 });
            this.anims.create({ key: 'lordsoul_shield', frames: [{ key: 'ls_shield_1' }, { key: 'ls_shield_2' }, { key: 'ls_shield_3' }, { key: 'ls_shield_4' }], frameRate: 12, repeat: -1 });

            // Enemy Anims
            const wIT = this.textures.get('walker_i');
            if (wIT && wIT.key !== '__MISSING') {
                for (let i = 0; i < 4; i++) {
                    if (!wIT.has(`f${i}`)) wIT.add(`f${i}`, 0, i * 48, 0, 48, 48);
                }
                if (!this.anims.exists('walker_idle')) {
                    this.anims.create({ key: 'walker_idle', frames: Array.from({ length: 4 }, (_, i) => ({ key: 'walker_i', frame: `f${i}` })), frameRate: 8, repeat: -1 });
                }
            }
            const wWT = this.textures.get('walker_w');
            if (wWT && wWT.key !== '__MISSING') {
                for (let i = 0; i < 6; i++) {
                    if (!wWT.has(`f${i}`)) wWT.add(`f${i}`, 0, i * 57, 0, 57, 42);
                }
                if (!this.anims.exists('walker_walk')) {
                    this.anims.create({ key: 'walker_walk', frames: Array.from({ length: 6 }, (_, i) => ({ key: 'walker_w', frame: `f${i}` })), frameRate: 10, repeat: -1 });
                }
            }
            this.anims.create({ key: 'drone_fly', frames: [{ key: 'drone1' }, { key: 'drone2' }, { key: 'drone3' }, { key: 'drone4' }], frameRate: 10, repeat: -1 });

            // Boss Anims
            const bT = this.textures.get('boss_tex');
            if (bT && bT.key !== '__MISSING') {
                D.boss.forEach((y, r) => { for (let c = 0; c < 11; c++) bT.add(`b${c}_${r}`, 0, c * 256, y, 256, 400); });
                this.anims.create({ key: 'b_i', frames: [{ key: 'boss_tex', frame: 'b0_0' }, { key: 'boss_tex', frame: 'b1_0' }], frameRate: 8, repeat: -1 });
                this.anims.create({ key: 'boss_idle', frames: [{ key: 'boss_tex', frame: 'b0_0' }, { key: 'boss_tex', frame: 'b1_0' }], frameRate: 8, repeat: -1 });
                this.anims.create({ key: 'boss_walk', frames: [{ key: 'boss_tex', frame: 'b2_0' }, { key: 'boss_tex', frame: 'b3_0' }, { key: 'boss_tex', frame: 'b4_0' }, { key: 'boss_tex', frame: 'b5_0' }], frameRate: 10, repeat: -1 });
                this.anims.create({ key: 'boss_atk', frames: [{ key: 'boss_tex', frame: 'b6_0' }, { key: 'boss_tex', frame: 'b7_0' }, { key: 'boss_tex', frame: 'b8_0' }, { key: 'boss_tex', frame: 'b9_0' }], frameRate: 12, repeat: 0 });
                this.anims.create({ key: 'boss_hurt', frames: [{ key: 'boss_tex', frame: 'b10_0' }], frameRate: 1, repeat: 0 });
            }
            const cyborgFrames = ['001', '002', '004', '005', '006', '007', '008', '009', '010', '011', '012', '013', '014', '015', '017', '020'];
            this.anims.create({ key: 'b_w', frames: cyborgFrames.map(f => ({ key: `cyborg_${f}` })), frameRate: 10, repeat: -1 });

            // Prop Anims
            this.anims.create({ key: 'wc_neon_anim', frames: [{ key: 'wc_neon_1' }, { key: 'wc_neon_2' }, { key: 'wc_neon_3' }, { key: 'wc_neon_4' }], frameRate: 6, repeat: -1 });
            this.anims.create({ key: 'wc_monitor_anim', frames: [{ key: 'wc_monitor_1' }, { key: 'wc_monitor_2' }, { key: 'wc_monitor_3' }, { key: 'wc_monitor_4' }], frameRate: 4, repeat: -1 });

            // Registry
            this.registry.set('playerLives', 3);
            this.registry.set('gameState', { score: 0, level: 1 });
            this.registry.set('charStats', {
                'cherry': { health: 7, power: 6, speed: 10 },
                'adam': { name: 'LEON G', health: 8, power: 8, speed: 6 },
                'bigz': { health: 10, power: 10, speed: 3 },
                'ignite': { health: 6, power: 9, speed: 8 },
                'ninja': { name: 'NAGA SOUL', health: 6, power: 8, speed: 10 },
                'lordsoul': { health: 9, power: 8, speed: 7 },
                'default': { health: 7, power: 7, speed: 7 }
            });

            console.log("%c --- BOOT SCENE CREATE FINISHED --- ", "background: #00ffaa; color: #000; font-weight: bold;");
            console.log("Total Anims Registered:", this.anims.anims.size);

            // Add a "Click to Start" overlay to comply with browser audio/video autoplay policies
            const startBg = this.add.graphics();
            startBg.fillStyle(0x000000, 0.8);
            startBg.fillRect(0, 0, this.cameras.main.width, this.cameras.main.height);
            startBg.setDepth(9998);

            const startText = this.add.text(this.cameras.main.width / 2, this.cameras.main.height / 2, 'CLICK ANYWHERE TO START', {
                fontFamily: '"Press Start 2P"',
                fontSize: '24px',
                color: '#00ffaa',
                stroke: '#000000',
                strokeThickness: 4
            }).setOrigin(0.5).setDepth(9999);

            // Blinking effect for the text
            this.tweens.add({
                targets: startText,
                alpha: 0.2,
                duration: 800,
                yoyo: true,
                repeat: -1
            });

            // Wait for user interaction before proceeding to video scene
            const startGame = () => {
                this.input.off('pointerdown', startGame);
                this.input.keyboard.off('keydown', startGame);
                this.scene.start('VideoIntroScene');
            };

            this.input.once('pointerdown', startGame);
            this.input.keyboard.once('keydown', startGame);


        } catch (e) {
            console.error("Critical error in Boot Scene Create:", e);
        }
    }
}
