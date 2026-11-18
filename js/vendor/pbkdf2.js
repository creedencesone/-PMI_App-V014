/* ==========================================================================
   PMI Mind — PBKDF2-HMAC-SHA256 (implementación sincrónica, sin dependencias)
   Versionado y符合要求 con RFC 2898 / RFC 8018.

   Se usa una implementación pura de JS para mantener la API síncrona de
   AuthSystem (register/login/seeded demo users) sin reescribir flujos.
   La semilla es aleatoria (crypto.getRandomValues) y el formato es:
       pbkdf2$<iteraciones>$<saltHex>$<hashHex>
   ========================================================================== */
(function (root) {
    'use strict';

    var K = new Uint32Array([
        0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
        0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
        0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
        0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
        0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
        0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
        0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
        0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2
    ]);

    function rotr(x, n) { return (x >>> n) | (x << (32 - n)); }

    function utf8Bytes(str) {
        if (typeof TextEncoder !== 'undefined') return new TextEncoder().encode(str);
        var out = [], i = 0;
        for (i = 0; i < str.length; i++) {
            var c = str.charCodeAt(i);
            if (c < 0x80) out.push(c);
            else if (c < 0x800) out.push(0xc0 | (c >> 6), 0x80 | (c & 0x3f));
            else if (c >= 0xd800 && c <= 0xdbff && i + 1 < str.length) {
                var c2 = str.charCodeAt(++i);
                var cp = 0x10000 + (((c - 0xd800) << 10) | (c2 - 0xdc00));
                out.push(0xf0 | (cp >> 18), 0x80 | ((cp >> 12) & 0x3f), 0x80 | ((cp >> 6) & 0x3f), 0x80 | (cp & 0x3f));
            } else out.push(0xe0 | (c >> 12), 0x80 | ((c >> 6) & 0x3f), 0x80 | (c & 0x3f));
        }
        return new Uint8Array(out);
    }

    function sha256(bytes) {
        var h0 = 0x6a09e667, h1 = 0xbb67ae85, h2 = 0x3c6ef372, h3 = 0xa54ff53a,
            h4 = 0x510e527f, h5 = 0x9b05688c, h6 = 0x1f83d9ab, h7 = 0x5be0cd19;

        var bitLen = bytes.length * 8;
        var paddedLen = Math.ceil((bytes.length + 9) / 64) * 64;
        var msg = new Uint8Array(paddedLen);
        msg.set(bytes);
        msg[bytes.length] = 0x80;
        var dv = new DataView(msg.buffer);
        dv.setUint32(paddedLen - 8, Math.floor(bitLen / 0x100000000), false);
        dv.setUint32(paddedLen - 4, bitLen >>> 0, false);

        var w = new Uint32Array(64);
        for (var i = 0; i < paddedLen; i += 64) {
            for (var t = 0; t < 16; t++) w[t] = dv.getUint32(i + t * 4, false);
            for (t = 16; t < 64; t++) {
                var x = w[t - 15], y = w[t - 2];
                var s0 = rotr(x, 7) ^ rotr(x, 18) ^ (x >>> 3);
                var s1 = rotr(y, 17) ^ rotr(y, 19) ^ (y >>> 10);
                w[t] = (w[t - 16] + s0 + w[t - 7] + s1) | 0;
            }
            var a = h0, b = h1, c = h2, d = h3, e = h4, f = h5, g = h6, h = h7;
            for (t = 0; t < 64; t++) {
                var S1 = rotr(e, 6) ^ rotr(e, 11) ^ rotr(e, 25);
                var ch = (e & f) ^ (~e & g);
                var t1 = (h + S1 + ch + K[t] + w[t]) | 0;
                var S0 = rotr(a, 2) ^ rotr(a, 13) ^ rotr(a, 22);
                var maj = (a & b) ^ (a & c) ^ (b & c);
                var t2 = (S0 + maj) | 0;
                h = g; g = f; f = e; e = (d + t1) | 0;
                d = c; c = b; b = a; a = (t1 + t2) | 0;
            }
            h0 = (h0 + a) | 0; h1 = (h1 + b) | 0; h2 = (h2 + c) | 0; h3 = (h3 + d) | 0;
            h4 = (h4 + e) | 0; h5 = (h5 + f) | 0; h6 = (h6 + g) | 0; h7 = (h7 + h) | 0;
        }
        var out = new Uint8Array(32), odv = new DataView(out.buffer);
        odv.setUint32(0, h0, false); odv.setUint32(4, h1, false);
        odv.setUint32(8, h2, false); odv.setUint32(12, h3, false);
        odv.setUint32(16, h4, false); odv.setUint32(20, h5, false);
        odv.setUint32(24, h6, false); odv.setUint32(28, h7, false);
        return out;
    }

    function hmacSha256(key, msg) {
        if (key.length > 64) key = sha256(key);
        var ipad = new Uint8Array(64 + msg.length), opad = new Uint8Array(96);
        for (var i = 0; i < 64; i++) {
            var k = i < key.length ? key[i] : 0;
            ipad[i] = k ^ 0x36;
            opad[i] = k ^ 0x5c;
        }
        ipad.set(msg, 64);
        opad.set(sha256(ipad), 64);
        return sha256(opad);
    }

    function pbkdf2Sha256(password, salt, iterations, dkLen) {
        var hLen = 32;
        var blocks = Math.ceil(dkLen / hLen);
        var out = new Uint8Array(blocks * hLen);
        var pw = typeof password === 'string' ? utf8Bytes(password) : password;
        for (var i = 1; i <= blocks; i++) {
            var input = new Uint8Array(salt.length + 4);
            input.set(salt);
            new DataView(input.buffer).setUint32(salt.length, i, false);
            var u = hmacSha256(pw, input);
            var t = new Uint8Array(u);
            for (var c = 1; c < iterations; c++) {
                u = hmacSha256(pw, u);
                for (var j = 0; j < hLen; j++) t[j] ^= u[j];
            }
            out.set(t, (i - 1) * hLen);
        }
        return out.subarray(0, dkLen);
    }

    function bytesToHex(bytes) {
        var s = '';
        for (var i = 0; i < bytes.length; i++) s += ('0' + bytes[i].toString(16)).slice(-2);
        return s;
    }
    function hexToBytes(hex) {
        var out = new Uint8Array(hex.length / 2);
        for (var i = 0; i < out.length; i++) out[i] = parseInt(hex.substr(i * 2, 2), 16);
        return out;
    }
    function randomSalt(len) {
        var salt = new Uint8Array(len);
        if (root.crypto && root.crypto.getRandomValues) root.crypto.getRandomValues(salt);
        else for (var i = 0; i < len; i++) salt[i] = Math.floor(Math.random() * 256);
        return salt;
    }
    function timingSafeEqual(a, b) {
        if (a.length !== b.length) return false;
        var diff = 0;
        for (var i = 0; i < a.length; i++) diff |= a[i] ^ b[i];
        return diff === 0;
    }

    root.PMICrypto = {
        sha256Hex: function (input) {
            return bytesToHex(sha256(typeof input === 'string' ? utf8Bytes(input) : input));
        },
        pbkdf2Hex: function (password, salt, iterations, dkLen) {
            return bytesToHex(pbkdf2Sha256(password, salt, iterations, dkLen));
        },
        pbkdf2Bytes: pbkdf2Sha256,
        randomSaltHex: function (len) { return bytesToHex(randomSalt(len || 16)); },
        hexToBytes: hexToBytes,
        utf8Bytes: utf8Bytes,
        timingSafeEqualHex: function (a, b) {
            if (typeof a !== 'string' || typeof b !== 'string' || a.length !== b.length) return false;
            return timingSafeEqual(hexToBytes(a), hexToBytes(b));
        }
    };
})(typeof window !== 'undefined' ? window : globalThis);
