const stringToByteArray = (str: string) => {
    const byteArray = [];
    for (let i = 0; i < str.length; i++) {
        const codePoint = str.codePointAt(i);

        if (!codePoint) continue;
       
        if (codePoint > 0xFFFF) {
            i++; 
        }

        
        if (codePoint < 0x80) {
            byteArray.push(codePoint);
        } else if (codePoint < 0x800) {
            byteArray.push(0xc0 | (codePoint >> 6)); // First byte
            byteArray.push(0x80 | (codePoint & 0x3f)); // Second byte
        } else if (codePoint < 0x10000) {
            byteArray.push(0xe0 | (codePoint >> 12)); // First byte
            byteArray.push(0x80 | ((codePoint >> 6) & 0x3f)); // Second byte
            byteArray.push(0x80 | (codePoint & 0x3f)); // Third byte
        } else {
            byteArray.push(0xf0 | (codePoint >> 18)); // First byte
            byteArray.push(0x80 | ((codePoint >> 12) & 0x3f)); // Second byte
            byteArray.push(0x80 | ((codePoint >> 6) & 0x3f)); // Third byte
            byteArray.push(0x80 | (codePoint & 0x3f)); // Fourth byte
        }
    }
    console.log("Encoded byte array:", byteArray);
    return byteArray;
};


const byteArrayToString = (byteArray: string) => {
    console.log("Input array:", byteArray);

    const byteArrayNumbers = byteArray
        .split(',')
        .map(value => parseInt(value.trim(), 10))
        .filter(num => !isNaN(num) && num >= 0 && num <= 255); // Ensure valid byte range

    if (byteArrayNumbers.length === 0) {
        console.warn("Input byteArray is empty or invalid.");
        return ""; 
    }

    try {
        const uint8Array = new Uint8Array(byteArrayNumbers);
        const decodedString = new TextDecoder('utf-8', { fatal: true }).decode(uint8Array);
        console.log("Decoded string:", decodedString);
        return decodedString;
    } catch (error) {
        console.error("Decoding error:", error);
        return "";
    }
};