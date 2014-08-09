htX - Hypertext Xfer
A simple XmlHttpRequest wrapper
===============================
(Documentation is stil WIP!)

Use
---
`htx({
  url:'php/proxy.php',
  success:function(data) {
    console.log('Success!');
    console.log(data);
}`

At a minimum, a string with the URL to contact and a callback function on success must be specified.

Settings object
---------------
`async (boolean, default: true)`
Specifies that the request is asynchronous or synchronous. Note that synchronous requests may cause blocking. The responseType property is not compatible with synchronous requests in modern browsers and will throw an exception.

`data (object, default: null)`
Data to send to the server

`error (function, default: function to rethrow error)`


`method (string, default:'GET')`

`ontimeout (function, default: null)`

`overrideMimeType (string, default: null)`


`password (string, default: null)`

`reqHeaders (object, default: null)`


`responseType (string, default: null)`


`success (function, default: null, required)`

`timeout (number, default: null)`

`url (string, default: null, required)`

`user (string, default: null)`

