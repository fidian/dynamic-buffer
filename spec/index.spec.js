"use strict";

var DynamicBuffer;

DynamicBuffer = require("..");


/**
 * Convert a DynamicBuffer into a string of hex bytes for easy comparison.
 *
 * @param {DynamicBuffer} dynamicBuffer
 * @return {string}
 */
function getByteString(dynamicBuffer) {
    return dynamicBuffer.getBuffer().toString("hex").replace(/(..)/g, "$1 ").trim();
}

describe("DynamicBuffer", () => {
    var dynamic;

    beforeEach(() => {
        dynamic = new DynamicBuffer();
    });
    describe("construction", () => {
        it("creates a new, empty buffer", () => {
            expect(dynamic.length).toBe(0);
            expect(dynamic.buffer.length).toBe(1024);
            expect(dynamic.getBuffer().length).toBe(0);
        });
        it("resizes when full", () => {
            dynamic.append("abc");
            dynamic.resizeUnderlyingBuffer();
            expect(dynamic.buffer.length).toBe(3);
            expect(dynamic.length).toBe(3);
            dynamic.append("d");
            expect(dynamic.buffer.length).toBe(1028);
            expect(dynamic.length).toBe(4);
            expect(getByteString(dynamic)).toEqual("61 62 63 64");
        });
    });
    describe("append", () => {
        it("appends a string with no encoding", () => {
            dynamic.append("a string");
            expect(getByteString(dynamic)).toEqual("61 20 73 74 72 69 6e 67");
        });
        it("appends a string with encoding", () => {
            dynamic.append("dead", "base64");
            dynamic.append("00ff", "hex");
            expect(getByteString(dynamic)).toEqual("75 e6 9d 00 ff");
        });
        it("appends a partial string", () => {
            dynamic.append("abcdefg", 3);
            expect(getByteString(dynamic)).toEqual("61 62 63");
        });
        it("appends a partial string with encoding", () => {
            dynamic.append("deadbeef", 2, "hex");
            expect(getByteString(dynamic)).toEqual("de ad");
        });
    });
    describe("clone", () => {
        it("makes an independent copy", () => {
            var clone;

            dynamic.append("abc", "utf8");
            clone = dynamic.clone();
            dynamic.write(0);
            clone.write(1);
            expect(getByteString(dynamic)).toEqual("61 62 63 00");
            expect(getByteString(clone)).toEqual("61 62 63 01");
        });
    });
    describe("concat", () => {
        it("adds a buffer with content", () => {
            dynamic.concat(Buffer.from("abc", "utf8"));
            expect(getByteString(dynamic)).toEqual("61 62 63");
        });
        it("adds empty buffers", () => {
            dynamic.concat(Buffer.from("", "utf8"));
            expect(getByteString(dynamic)).toEqual("");
        });
        it("keeps adding buffers", () => {
            dynamic.concat(Buffer.from("ab", "utf8"));
            dynamic.concat(Buffer.from("cd", "utf8"));
            expect(getByteString(dynamic)).toEqual("61 62 63 64");
        });
    });
    describe("resizeUnderlyingBuffer", () => {
        it("resizes to match the size", () => {
            dynamic.append("abc", "utf8");
            expect(dynamic.buffer.length).toEqual(1024);
            dynamic.resizeUnderlyingBuffer();
            expect(dynamic.buffer.length).toEqual(3);
            expect(getByteString(dynamic)).toEqual("61 62 63");
        });
        it("can make it smaller", () => {
            dynamic.append("abc", "utf8");
            expect(dynamic.buffer.length).toEqual(1024);
            dynamic.resizeUnderlyingBuffer(1);
            expect(dynamic.buffer.length).toEqual(1);
            expect(getByteString(dynamic)).toEqual("61");
        });
    });
    describe("write", () => {
        it("adds a single byte", () => {
            dynamic.write(1);
            expect(getByteString(dynamic)).toEqual("01");
        });
        it("adds 'abc' the hard way", () => {
            dynamic.write("a".charCodeAt(0));
            dynamic.write("b".charCodeAt(0));
            dynamic.write("c".charCodeAt(0));
            expect(getByteString(dynamic)).toEqual("61 62 63");
        });
    });
});
