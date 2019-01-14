//adapted from https://github.com/marcrobledo/RomPatcher.js/
//originally licensed under the MIT license by Marc Robledo
//license available https://github.com/marcrobledo/RomPatcher.js/blob/master/LICENSE
var RECORD_RLE = 0x0000;
var RECORD_SIMPLE = 1;

function patchRom (romBuffer, patchBuffer) {
    let records = [];
    let initialRom = new DataView(romBuffer);
    let patch = new DataView(patchBuffer);
    records = setRecords(patch);
    
    let newFileSize = initialRom.byteLength;
    records.forEach(record => {
        if (record.type === RECORD_RLE) {
            if (record.offset + record.length > newFileSize) newFileSize = record.offset + record.length;
        } else {
            if (record.offset + record.data.length > newFileSize) newFileSize = record.offset + record.data.length;
        }
    });
    
    let adjustedRom = new DataView(romBuffer, 0, newFileSize);
    
    records.forEach(record => {
        if (record.type === RECORD_RLE) {
            for (let i = 0; i < record.length; i++) adjustedRom.setUint8(record.offset + j, record.byte);
        } else {
            for (let j = 0; j < record.data.length; j++) adjustedRom.setUint8(record.offset + j, record.data[j]);
        }
    });
}

var setRecords = patch => {
    let EoF = false, seek = 5, rec = [];
    
    let addSimpleRecord = (r, o, d) => r.push({offset:o, type:RECORD_SIMPLE, data:d});
    let addRLERecord = (r, o, l, b) => r.push({offset:o, type:RECORD_RLE, length:l, byte:b});
    let readBytes = (p, a, b) => { for (let c = new Array(b), d = 0; d < b; d++) c[d] = p.getUint8(a + d); return c }
    
    while (seek < patch.byteLength) {
        let address = (patch.getUint8(seek + 0) << 16) + (patch.getUint8(seek + 1) << 8) + (patch.getUint8(seek + 2));
        seek += 3;
        
        if (!EoF && address === 0x454F46) EoF = true;
        else {
            let length = patch.getUint16(seek);
            seek += 2;
            
            if (length == RECORD_RLE) {
                addRLERecord(rec, address, patch.getUint16(seek), patch.getUint8(seek + 2));
                seek += 3;
            } else {
                addSimpleRecord(rec, address, readBytes(patch, seek, length));
                seek += length;
            }
        }
    }
    return rec;
}