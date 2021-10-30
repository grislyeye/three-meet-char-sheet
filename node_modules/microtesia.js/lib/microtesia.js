/* Copyright (c) 2017, 2018 Ricardo Gladwell */

(function(root, factory) {
  'use strict';
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else {
    if(root === undefined && window !== undefined) root = window;
    root.parseMicrodata = factory();
  }
}(this, function() {
  'use strict';

  // TODO ES6: will not work on older browsers
  class MicrodataItem {

    constructor(node) {
      if(node.attributes.itemtype) {
        this._type = node.attributes.itemtype.value.trim();
      }
    }

    addProperty(name, value) {
      var oldProperty = this[name];
      var p = {};

      if(!oldProperty) {
        p[name] = value;
        return Object.assign(this, p);
      } else if(Array.isArray(oldProperty)) {
        p[name] = [value].concat(oldProperty);
        return Object.assign(this, p);
      } else {
        p[name] = [value, oldProperty];
        return Object.assign(this, p);
      }
    }

  }

  Array.prototype.flatten = function() {
    function flattener(a, b) {
      return a.concat(Array.isArray(b) ? b.flatten() : b);
    }

    return this.reduce(flattener, []);
  };

  function toArray(nodelist) {
    if(nodelist) {
      return Array.prototype.slice.call(nodelist);
    } else {
      return [];
    }
  }

  function parseProperty(property) {
    var p = {};
    p.name = property.attributes.itemprop.value.trim();

    // TODO breaks OCP: split into separate functions
    if(property.attributes.itemscope) {
      p.value = parseItem(property);
    } else if(property.attributes.href) {
      p.value = property.attributes.href.value.trim();
    } else if(property.attributes.src) {
      p.value = property.attributes.src.value.trim();
    } else if(property.tagName === "DATA" && property.attributes.value) {
      p.value = property.attributes.value.value.trim();
    } else if(property.tagName === "METER" && property.attributes.value) {
      p.value = property.attributes.value.value.trim();
    } else if(property.tagName === "TIME" && property.attributes.datetime) {
      p.value = property.attributes.datetime.value.trim();
    } else {
      p.value = property.textContent.trim();
    }

    return p;
  }

  function parseProperties(node, properties, item) {
    var is = item || new MicrodataItem(node);

    if(properties.length === 0) {
      return is;
    } else {
      var property = parseProperty(properties.pop());
      var itemWithProperty = is.addProperty(property.name, property.value);
      return parseProperties(undefined, properties, itemWithProperty);
    }
  }

  function findProperties(nodes, properties) {

    function notItems(node) {
      return node.attributes !== undefined && node.attributes.itemscope === undefined;
    }

    function areProperties(node) {
      return node.attributes !== undefined && node.attributes.itemprop !== undefined;
    }

    var ps = properties || [];

    if(nodes.length === 0) {
      return ps;
    } else {

      var children = nodes
                       .map( function(node) { return toArray(node.children); } )
                       .flatten();

      var foundProperties = ps.concat(children.filter(areProperties));

      return findProperties(children.filter(notItems), foundProperties);
    }

  }

  function resolveReferences(node) {
    if(node.attributes && node.attributes.itemref) {
      return node
        .attributes
        .itemref
        .value
        .split(' ')
        .map(function(id) {
          const ref = node.ownerDocument.getElementById(id);

          if(ref === undefined || ref === null) {
            console.error('itemref not found for id "' + id + '"')
          }

          return ref;
        })
        .filter(function(ref) {
          return ref !== undefined && ref !== null;
        });
    } else {
      return [];
    }
  }

  function parseItem(node) {
    var nodes = [node].concat(resolveReferences(node));
    var properties = findProperties(nodes);
    return parseProperties(node, properties);
  }

  function areNotProperties(node) {
    return node.attributes !== undefined && node.attributes.itemprop === undefined;
  }

  function findRootItems(node) {
    var items = toArray(node.querySelectorAll('[itemscope]'));

    if(node.attributes && node.attributes.itemscope) {
      items.push(node);
    }

    return items.filter(areNotProperties);
  }

  function typeFilter(itemtype) {
    return function(node) {
      return node.attributes &&
        node.attributes.itemtype &&
        node.attributes.itemtype.value.trim() === itemtype;
    };
  }

  function parseNodes(nodes, filter) {
    var f = filter || function() { return true; };

    return nodes
      .map( function(n) { return findRootItems(n).filter(f); })
      .flatten()
      .map(parseItem);
  }

  function parseMicrodata(html) {
    if(arguments.length === 1) {

      if(Array.isArray(html)) {
        return parseNodes(html);
      } else {
        return parseNodes([html]);
      }

    } else if(arguments.length === 2) {
      var itemtype = arguments[0];
      var nodes = arguments[1];

      if(Array.isArray(nodes)) {
        return parseNodes(nodes, typeFilter(itemtype));
      } else {
        return parseNodes([nodes], typeFilter(itemtype));
      }
    }
  }

  return parseMicrodata;
}));
