"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const net = require("net");
var Bouyomi;
(function (Bouyomi) {
    class Client {
        constructor(host = "127.0.0.1", port = 50001) {
            this.host = host;
            this.port = port;
        }
        talk(text, code = "utf-8", speed = -1, interval = -1, volume = -1, voice = 0) {
            if (!(volume === -1 || 0 <= volume && volume <= 100)) {
                throw new Error("volume must be -1 or 0~100");
            }
            if (!(interval === -1 || 50 <= interval && interval <= 200)) {
                throw new Error("interval must be -1 or 50~300");
            }
            if (!(speed === -1 || 50 <= speed && speed <= 300)) {
                throw new Error("speed must be -1 or 50~300");
            }
            if (!(0 <= voice && voice <= 8 || 10001 <= voice)) {
                throw new Error("voice must be 0~8 or 10001~");
            }
            const c = this.getCode(code);
            if (c === -1) {
                throw new Error("code must be utf-8,unicode or shift-jis");
            }
            const length = this.getTextLength(text, code);
            const inst = new Buffer(15 + length);
            inst.writeInt16LE(1, 0);
            inst.writeInt16LE(speed, 2);
            inst.writeInt16LE(interval, 4);
            inst.writeInt16LE(volume, 6);
            inst.writeInt16LE(voice, 8);
            inst.writeInt8(c, 10);
            inst.writeInt32LE(length, 11);
            inst.write(text, 15);
            this.send(inst);
        }
        pause() {
            this.send(new Buffer([0x00, 0x10]));
        }
        resume() {
            this.send(new Buffer([0x00, 0x20]));
        }
        skip() {
            this.send(new Buffer([0x00, 0x30]));
        }
        clear() {
            this.send(new Buffer([0x00, 0x40]));
        }
        getCode(code) {
            return code === "utf-8" ? 0 : code === "unicode" ? 1 : code === "shift-jis" ? 2 : -1;
        }
        getTextLength(text, code) {
            return new Buffer(text, code).length;
        }
        send(inst) {
            const client = new net.Socket();
            client.connect(this.port, this.host, () => {
                console.log("Connect");
                console.log(inst);
                client.write(inst);
            });
        }
    }
    Bouyomi.Client = Client;
})(Bouyomi = exports.Bouyomi || (exports.Bouyomi = {}));
//# sourceMappingURL=bouyomiTCP.js.map