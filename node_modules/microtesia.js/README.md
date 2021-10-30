# microtesia.js

[![Build Status](https://travis-ci.org/rgladwell/microtesia.js.svg?branch=master)](https://travis-ci.org/rgladwell/microtesia.js)

Small, fast microdata parsing library for browsers.

To install execute:

```sh
$ npm install microtesia.js --save
```

Or with bower:

```sh
$ bower install microtesia.js --save
```

To use import the script into your HTML as follows:

```html
<script src="../microtesia.js/dist/microtesia.js"></script>
```

This makes the `parseMicrodata` function available. This functions takes an [Element](https://developer.mozilla.org/en-US/docs/Web/API/Element) (or array of Elements) as argument and returns an array of microdata as a JSON objects:

```js
var microdata = parseMicrodata(document);
```

So parsing the following HTML:

```html
<article role="article" itemscope itemtype="http://schema.org/Organization">

  <h1><span itemprop="name">Organization Name</span> Directory</h1>

  <section>
    <h2 itemprop="department">Department Name</h2>
    <p>Brief department description</p>

    <div itemprop="employee" itemscope itemtype="http://schema.org/Person">
      <span itemprop="name">Jane Doe</span> <br>
      <span itemprop="jobTitle">Vice President for Such-and-Such</span> <br>
      <a href="//tel:5551112222" itemprop="telephone">(555) 111-2222</a> <br>
      <a href="mailto:name@email.com" itemprop="email">name@email.com</a>
    </div>
  </section>

</article>
```

Would return:

```json
[{
  "_type": "http://schema.org/Organization",
  "employee": {
    "_type": "http://schema.org/Person",
    "email": "mailto:name@email.com",
    "telephone": "//tel:5551112222",
    "jobTitle": "Vice President for Such-and-Such",
    "name": "Jane Doe"
  },
  "department": "Department Name",
  "name": "Organization Name"
}]
```

You can also pass an array of elements to search for microdata:

```js
var microdata = parseMicrodata(document.querySelectorAll('.microdata'));
```

Finally, you can pass a URL as item type to only parse root items you're interested in:


```js
var microdata = parseMicrodata('http://schema.org/Organization', document);
```

## Hacking

To test and build run:

```sh
$ npm run build
```
