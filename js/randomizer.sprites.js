function randomizeEnemies(rom) {
    //input json?
    //loop through json
    
    //special cases
    for (let i = 0xE2A2; i < 0xE30B; i += 3) {
        switch (sprite.extract(rom[i], rom[i + 1])) {
            case 0x4E:
                const lv06a = [0x4D, 0x4E, 0x51, 0x53];
                let a = sprite.insert(rom[i], rom[i + 1], lv06a[rng.nextInt(lv06a.length)]);
                sprite.copy(a, rom, i);
                break;
            case 0x4F:
                const lv06b = [0x4D, 0x4F, 0x51, 0x53];
                let b = sprite.insert(rom[i], rom[i + 1], lv06b[rng.nextInt(lv06b.length)]);
                sprite.copy(b, rom, i);
                break;
            case 0x4D: case 0x51: case 0x53:
                const lv06c = [0x4D, 0x51, 0x53];
                let c = sprite.insert(rom[i], rom[i + 1], lv06c[rng.nextInt(lv06c.length)]);
                sprite.copy(c, rom, i);
                break;
            default: break;
        }
    }
    for (let i = 0xE3D4; i < 0xE431; i += 3) {
        switch (sprite.extract(rom[i], rom[i + 1])) {
            case 0x4F:
                const lv09a = [0x4D, 0x4F, 0x53, 0x5A, 0x5C];
                let a = sprite.insert(rom[i], rom[i + 1], lv09a[rng.nextInt(lv09a.length)]);
                sprite.copy(a, rom, i);
                break;
            case 0x4D: case 0x53: case 0x5A: case 0x5C:
                const lv09b = [0x4D, 0x53, 0x5A, 0x5C];
                let b = sprite.insert(rom[i], rom[i + 1], lv09b[rng.nextInt(lv09b.length)]);
                sprite.copy(b, rom, i);
                break;
            default: break;
        }
    }
}

function randomizePowerups(rom) {
    let free = [0x0F, 0x1B, 0x1C, 0x1D, 0x1E, 0x1F];
    let block = [0x11, 0x12, 0x13, 0x14, 0x15, 0x19];
    let castle = [0x1B, 0x1C, 0x1D, 0x1F];
    //allow heart in Wario Fight if DX unless ohko
    if (rom[0x148] == 0x05 && !doOHKO) {
        castle.push(0x0F);
    }
}