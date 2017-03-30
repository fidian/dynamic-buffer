"use strict";

/**
 * Make sure the underlying buffer is large enough to accept the additional
 * information.  If not, resize it.
 *
 * @param {DynamicBuffer} dynamicBuffer
 * @param {number} additionalBytes
 */
function ensureSize(dynamicBuffer, additionalBytes) {
    var needed;

    needed = dynamicBuffer.length + additionalBytes;

    if (dynamicBuffer.buffer.length < needed) {
        // Add a margin with a minimum of 1024 and a maximum of 5%,
        // cast to an integer.
        needed += Math.max(1024, Math.floor(needed * 0.05));
        dynamicBuffer.resizeUnderlyingBuffer(needed);
    }
}


/**
 * The DynamicBuffer object, which allows one to keep appending data to
 * a Buffer.
 */
class DynamicBuffer {
    /**
     * Creates the initial buffer.
     */
    constructor() {
        this.length = 0;
        this.buffer = new Buffer(1024);
    }


    /**
     * Append a string to the buffer.
     *
     * @param {string} str
     * @param {number} [length]
     * @param {string} [encoding]
     * @return {this}
     */
    append(str, length, encoding) {
        if (typeof length === "string") {
            encoding = length;
            length = null;
        }

        if (!encoding) {
            encoding = "utf8";
        }

        if (typeof length !== "number") {
            length = Buffer.byteLength(str, encoding);
        }

        ensureSize(this, length);
        this.buffer.write(str, this.length, length, encoding);
        this.length += length;

        return this;
    }


    /**
     * Get a copy of this DynamicBuffer.
     *
     * @return {DynamicBuffer} Cloned object
     */
    clone() {
        var dynamicClone;

        dynamicClone = new DynamicBuffer();

        return dynamicClone.concat(this);
    }


    /**
     * Append a Buffer or DynamicBuffer to this one.
     *
     * @param {(Buffer|DynamicBuffer)} otherBuffer
     * @return {this}
     */
    concat(otherBuffer) {
        var len;

        len = otherBuffer.length;
        ensureSize(this, len);

        // Make otherBuffer always point to the Buffer
        if (otherBuffer instanceof DynamicBuffer) {
            otherBuffer = otherBuffer.buffer;
        }

        otherBuffer.copy(this.buffer, this.length, 0, len);
        this.length += len;

        return this;
    }


    /**
     * Return a view of the underlying buffer that only contains the written
     * space.  Changing that view will change this buffer, too.
     *
     * @return {Buffer}
     */
    getBuffer() {
        return this.buffer.slice(0, this.length);
    }


    /**
     * Shrinks this buffer either to the given size, or the length of the
     * current buffer.  This method is mainly used to squeeze out the last
     * bytes of memory, or increase the size for large chunks of data to come
     *
     * @param {number} [size=this.length]
     * @return {this}
     */
    resizeUnderlyingBuffer(size) {
        var newBuffer;

        newBuffer = Buffer.alloc(size || this.length);
        this.buffer.copy(newBuffer);
        this.buffer = newBuffer;

        return this;
    }


    /**
     * Append an unsigned byte to the buffer.
     *
     * @param {number} byteInt
     * @return {this}
     */
    write(byteInt) {
        ensureSize(this, 1);
        this.buffer.writeUInt8(byteInt, this.length);
        this.length += 1;

        return this;
    }
}


module.exports = DynamicBuffer;
