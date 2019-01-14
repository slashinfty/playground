//list of settings
var doLevels, doBosses, doAllDuals, doRandomDuals, doGambling, doEnemies, doPowerups, doPlatforms, doBonus, doGravity, doIce, doRandomLuigi, doAllLuigi, doScrolling, doRandomFast, doAllFast, doMusic, doFastMusic, doBossHP, doOHKO;

//random number generator
//Adapted from https://github.com/bit101/lcg
var rng = {
    a: 1664525,
    c: 1013904223,
    m: Math.pow(2, 32),
    printSeed: "",
    seed: 0,
    setSeed: function(seed) {
        this.printSeed = seed;
        this.seed = parseInt(this.printSeed, 16);
    },
    nextPrng: function() {
        this.seed = (this.seed * this.a +this.c) % this.m;
        return this.seed;
    },
    nextFloat: function() {
        //range [0, 1)
        return this.nextPrng() / this.m;
    },
    nextInt: function(lim) {
        //range [0, lim)
        return Math.floor(this.nextFloat() * lim);
    },
    nextBool: function() {
        //0.5 probability of true
        return this.nextFloat() < 0.5;
    }
};

//sprite manipulation functions
var sprite = {
    extract: (a, b) => {
        let first = ((0b00010000 & a) << 2);
        let second = ((0b11100000 & a) >>> 2);
        let third = ((0b11100000 & b) >>> 5);
        return (first | second | third);
    },
    insert: (a, b, s) => {
        let first = ((s & 0b01000000) >>> 2);
        let second = ((s & 0b00111000) << 2);
        let third = ((s & 0b00000111) << 5);
        return [((a & 0b00001111) | first | second), ((b & 0b00011111) | third)];
    },
    copy: (src, dest, pos) => {
        for (let i = 0; i < 2; i++) {
            dest[pos + i] = src[0 + i];
        }
    },
    randomize: (rom, poss, start, end) => {
        for (let i = start; i < end; i += 3) {
            let s = this.extract(rom[i], rom[i + 1]);
            if (rom[i] == 0xFF) i -= 2;
            else if (poss.indexOf(s) > -1) {
                let n = this.insert(rom[i], rom[i + 1], poss[rng.nextInt(poss.length)]);
                this.copy(n, rom, i);
            }
        }
    }
}

//Adapted from https://github.com/vhelin/wla-dx/blob/master/wlalink/compute.c
function checksum(rom) {
    let csum = 0;
    let comp = 0;
    for (let i = 0x00; i < 0x14E; i++) {
        csum += rom[i];
    }
    for (let j = 0x150; i <= 0x7FFFF; i++) {
        csum += rom[i];
    }
    rom[0x14E] = (csum >> 8) & 0xFF;
    rom[0x14F] = csum & 0xFF;
    for (let k = 0x134; i <= 0x14C; i++) {
        comp += rom[i];
    }
    comp += 25;
    rom[0x14D] = 0 - (comp & 0xFF);
}

//Fisher-Yates shuffle algorithm
function shuffle(b) {
    for (let i = b.length - 1; i > 0; i--) {
        let r = rng.nextInt(i + 1);
        let a = b[r];
        b[r] = b[i];
        b[i] = a;
    }
}

//verifying ROM
function verification(buffer) {
    let rom = new Uint8Array(buffer);
    let print = "Not a valid MARIOLAND2 ROM";
    let nameInRom = [0x4D, 0x41, 0x52, 0x49, 0x4F, 0x4C, 0x41, 0x4E, 0x44, 0x32, 0x00];
    let countdown = 11;
    nameInRom.forEach((element, index) => {
        if (rom[0x134 + index] == element) {
            countdown--;
        }
    });
    if (countdown == 0) {
        if (rom[0x148] == 0x05 && rom[0xC2000] < 0x13) {
            print = "SML2 DX ROM must be v1.8.1 or greater";
            toggleButton('#randomizeROM', true);
        } else {
            const version = rom[0x14C] == 0x00 ? 'v1.0' : 'v1.2';
            const dx = rom[0x148] == 0x05 ? 'DX - ' : '';
            print = "ROM: MARIOLAND2 - " + dx + version;
            toggleButton('#randomizeROM', false);
        }
    } else {
        toggleButton('#randomizeROM', true);
    }
    $('#romUploadLabel').text(print);
}

//go through randomize functions
function doRandomize(buffer) {
    let rom = new Uint8Array(buffer);
    //go through settings
    
    //testing
    //let dxIps = getIPS('patches/SML2DXv181.ips');
    patchRom(buffer, 'patches/SML2DXv181.ips');
    
    if (doLevels) randomizeLevels(rom);
    if (doAllDuals || doRandomDuals) swapExits(rom);
    if (doBosses) randomizeBoss;es(rom);
    //credits & file select (make same?)    
    checksum(rom);
    let seed = document.getElementById('seedNumber').value;
    let flags = document.getElementById('flagSet').value;
    let link = 'http://sml2r.download/?s=' + seed + '&f=' + flags;
    showLink(link);
    let dx = rom[0x148] == 0x05 ? 'DX-' : '';
    let fileName = 'sml2r-' + dx + seed + '-' + flags;
    saveAs(new Blob([buffer], {type: "octet/stream"}), fileName + ".gb");
}