//gravity
function randomizeGravity(rom) {
    const v = rom[0x14C] == 0x02 ? 0x3 : 0x0;
    for (let i = 0x1F91 + v; i <= 0x1FB0 + v; i++) {
        switch (rom[i]) {
            case 0x00:
                //no changing levels 07 and 15
                if (i != 0x1F98 + v && i != 0x1FA6 + v) {
                    if (rng.nextFloat() < 0.05) rom[i] = 0x01;
                //no moon for level 08
                } else if (rng.nextFloat() < 0.1 && i != 0x1F99 + v) rom[i] = 0x08;
                break;
            case 0x01:
                if (rng.nextFloat() < 0.1) rom[i] = 0x00;
                else if (rng.nextFloat() < 0.3) rom[i] = 0x08;
                break;
            case 0x08:
                if (rng.nextFloat() < 0.3) rom[i] = 0x00;
                else if (rng.nextFloat() < 0.05) rom[i] = 0x01;
                break;
            default: break;
        }
    }
}

//ice

//luigi

//scrolling
