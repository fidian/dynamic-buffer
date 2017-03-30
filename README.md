@fidian/DynamicBuffer
=====================

> A wrapper around node.js `Buffer` class.

This is a fork of Oliver Herdin's [DynamicBuffer](https://github.com/DDjarod/DynamicBuffer) module, altered to work with newer versions of Node. This one also includes some tests.

The `Buffer` class of node.js by default cannot be used as buffer to concatenate strings, like [`StringBuilder`](http://docs.oracle.com/javase/7/docs/api/java/lang/StringBuilder.html) does for Java. This module contains a wrapper around node.js `Buffer` to concatenate strings, bytes and `Buffer`s onto a `Buffer`. It automatically creates larger `Buffer` objects in the background when more space is needed.

    var buff, clonedDynamic, dynamic, DynamicBuffer;

    DynamicBuffer = require("@fidian/dynamic-buffer");

    // Make a new dynamic buffer.
    dynamic = new DynamicBuffer();

    // Append a string with an optional encoding. You may also specify an
    // optional length.
    dynamic.append("a string");
    dynamic.append("a string", "utf8");
    dynamic.append("1234 <- just the numbers", 4);
    dynamic.append("deadbeef", 2, "hex"); // Only DE AD

    // Write an 8-bit byte.
    dynamnic.write(127);

    // Add another buffer or a DynamicBuffer
    dynamic.concat(Buffer.from("abcd"));

    // Get a copy of the DynamicBuffer. This allocates a new DynamicBuffer.
    clonedDynamic = dynamic.clone();

    // Shrink the DynamicBuffer to the minimum size needed for the current
    // Buffer, or specify the size yourself.
    dynamic.resizeUnderlyingBuffer();
    dynamic.resizeUnderlyingBuffer(dynamic.length - 2); // Remove 2 bytes

    // Returns a view of the underlying buffer. Changing the view will change
    // the dynamic buffer as well.
    buff = dynamic.getBuffer();


Development
-----------

Make sure all changes have tests. Please follow our [contributor guide](CONTRIBUTING.md). This software falls under an [MIT License](LICENSE.md).
