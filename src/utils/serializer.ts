import {Buffer} from 'buffer'
import { format } from 'date-fns';

// Pads a starknet address with leading zeros
export const padAddress = (address: string) => {
    return '0x' + address.slice(2).padStart(64, '0');
};

// Truncates a starknet address with leading zeros
export const truncAddress = (address: string) => {
    return address.slice(0,4) + "...." + address.slice(62,66);
};

// Converts a Felt to a string
export const feltToString = (felt: any)=> {
    const newStrB = Buffer.from(felt.toString(16), 'hex')
    return newStrB.toString()
}

// Converts a string to a Felt
export const stringToFelt = (str: string)=> {
    return "0x" + Buffer.from(str).toString('hex');
}

// Converts a string to a byte array
export const stringToByteArray = (data: string) => {
    const byteArray = [];
    for (let i = 0; i < data.length; i++) {
        const codePoint = data.codePointAt(i);

        if (!codePoint) continue;

        // If the codePoint is part of a surrogate pair, skip the next character
        if (codePoint > 0xFFFF) {
            i++; // Advance to the next character as it's part of the same emoji
        }

        // Handle UTF-8 encoding
        if (codePoint < 0x80) {
            byteArray.push(codePoint); // 1-byte character
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


// Converts a byte array (string of comma-separated values) to a string
export const byteArrayToString = (byteArrayString: string) => {
    try {
        // Remove any surrounding quotes and split into numbers
        const byteArray = byteArrayString
            .replace(/^"|"$/g, "") // Remove leading and trailing quotes
            .split(",")
            .map(Number);

        // Convert to Uint8Array
        const uint8Array = new Uint8Array(byteArray);

        // Decode the byte array
        return new TextDecoder().decode(uint8Array);
    } catch (error) {
        console.error("Error decoding byte array string:", error);
        return "";
    }
};




// Converts a hexadecimal string to a number
export const hexToNumber = (hex: string) => {
    console.log('hex', hex)
    if (hex && hex.startsWith('0x')) {
        hex = hex.slice(2);
    }
    return parseInt(hex, 16);
};



// Converts a number to a hexadecimal string
export const numberToHex = (num: number, prefix = true) => {
    let hex = num.toString(16);
    console.log('hex', hex)
    return prefix ? '0x' + hex : hex;
};



// Converts a hex timestamp to formatted date string
export const hexTimestampToFormattedDate = (hexTimestamp: any) => {
    // Convert hex to number (timestamp in seconds)
    let timestamp;
    if (hexTimestamp){

         timestamp = numberToHex(hexTimestamp);
    }
    
    // Convert to milliseconds and create Date object
    const date = new Date(Number(timestamp) * 1000);
    
    // Format the date using date-fns
    return format(date, "EEEE, do MMMM yyyy. hh:mm:ss aaaa");
};



export const base64ToImageFile = (base64Data: string, fileName: string)=> {
    const base64 = base64Data.split(',')[1];
    const binaryData = atob(base64);   
    const byteArray = new Uint8Array(binaryData.length);
    for (let i = 0; i < binaryData.length; i++) {
        byteArray[i] = binaryData.charCodeAt(i);
    }
    const mimeType = base64Data.match(/^data:(.*?);base64/)?.[1] || 'image/png';
    const blob = new Blob([byteArray], { type: mimeType });
    return new File([blob], fileName, { type: mimeType });
}