/**
 * microtesia.js
 *
 *    Library test
 */

'use strict'

var chai       = require('chai'),
    expect     = chai.expect,
    microtesia = require('../lib/microtesia.js'),
    jsdom      = require('jsdom'),
    { JSDOM }  = jsdom;

chai.use(require("chai-sorted"));

describe('microtesia.js', function() {

  function html(fragment) {
    var dom = new JSDOM(fragment);
    return dom.window.document;
  }

  it('should not parse non-microdata HTML', function() {
    var h = html('<div><p>My name is Elizabeth.</p></div>');
    expect(microtesia.parseMicrodata(h)).to.be.empty;
  })

  describe('should parse top-level microdata item and', function() {
    function h() {
      return html(`<div itemscope>
                     <p>My name is <span itemprop="name">Elizabeth</span>.</p>
                   </div>`);
    }

    it('return item', function() {
      expect(microtesia.parseMicrodata(h())).to.not.be.empty;
    })

    it('return item name', function() {
      expect(microtesia.parseMicrodata(h())).to.deep.include({ name: 'Elizabeth' });
    })

    it('not return item type', function() {
      expect(microtesia.parseMicrodata(h())[0]._type).to.be.undefined;
    })

  })

  it('should parse multiple microdata items', function() {
    var h = html(`<div>
                    <div itemscope>
                      <p>My name is <span itemprop="name">Elizabeth</span>.</p>
                    </div>

                    <div itemscope>
                      <p>My <em>name</em> is <span itemprop="name">Daniel</span>.</p>
                    </div>
                  </div>`);

    expect(microtesia.parseMicrodata(h).length).to.equal(2);
  })

  it('should ignore non-microdata elements', function() {
    var h = html(`<div itemscope>
                    <p>My name is <span itemprop="name">E<strong>liz</strong>abeth</span>.</p>
                  </div>`);

    expect(microtesia.parseMicrodata(h)).to.deep.include({ name: 'Elizabeth' });
  })

  describe('should parse microdata links', function() {

    it('for image sources', function() {
      var h = html(`<div itemscope>
                      <img itemprop="image" src="google-logo.png" alt="Google">
                    </div>`);
      expect(microtesia.parseMicrodata(h)).to.deep.include({ image: 'google-logo.png' });
    })

    it('for hyperlink references', function() {
      var h = html(`<div itemscope>
                      <a itemprop="url" href="http://google.com">Google</a>
                    </div>`);
      expect(microtesia.parseMicrodata(h)).to.deep.include({ url: 'http://google.com' });
    })

  })

  it('should parse machine-readable formats', function() {
    var h = html(`<h1 itemscope>
                    <data itemprop="product-id" value="9678AOU879">The Instigator 2000</data>
                  </h1>`);

    expect(microtesia.parseMicrodata(h)).to.deep.include({ 'product-id': '9678AOU879' });
  })

  it('parse numeric data', function() {
    var h = html(`<h1 itemscope>
                    <meter itemprop="ratingValue" min=0 value=3.5 max=5>Rated 3.5/5</meter>
                  </h1>`);

    expect(microtesia.parseMicrodata(h)).to.deep.include({ ratingValue: '3.5' });
  })

  it('should parse date- and time-related data', function() {
    var h = html(`<h1 itemscope>
                    I was born on <time itemprop="birthday" datetime="2009-05-10">May 10th 2009</time>.
                  </h1>`);

    var microdata = microtesia.parseMicrodata(h);

    expect(microdata).to.deep.include({ birthday: '2009-05-10' });
  })

  describe('should parse nested microdata item', function() {
    function h() {
      return html(`<div itemscope>
                     <p>Name: <span itemprop="name">Amanda</span></p>
                     <p>Band: <span itemprop="band" itemscope> <span itemprop="name">Jazz Band</span>
                        (<span itemprop="size">12</span> players)</span></p>
                   </div>`);
    }

    it('as one ite', function() {
      var microdata = microtesia.parseMicrodata(h());
      expect(microdata).to.have.lengthOf(1);
    })

    it('as a property', function() {
      var microdata = microtesia.parseMicrodata(h())[0];
      expect(microdata.band).to.not.be.empty;
    })

    it('as an item', function() {
      var microdata = microtesia.parseMicrodata(h())[0];
      expect(microdata.band).to.be.an('object');
    })

    it('with nested properties', function() {
      var microdata = microtesia.parseMicrodata(h())[0];
      expect(microdata.band).to.have.property('name').that.equals('Jazz Band');
    })

    it('without properties from parent item', function() {
      var microdata = microtesia.parseMicrodata(h())[0];
      expect(microdata.band).to.have.property('name').that.not.equals('Amanda');
    })

    it('and ignore properties of child in parent item', function() {
      var microdata = microtesia.parseMicrodata(h())[0];
      expect(microdata).to.have.property('name').that.equals('Amanda');
    })

  })

  describe('should parse multiple properties with same name and', function() {
    function h() { return html(`<div itemscope>
                                  <ul>
                                    <li itemprop="ordered">a</li>
                                    <li itemprop="ordered">b</li>
                                    <li itemprop="ordered">c</li>
                                  </ul>
                                </div>`);}

    it('return as array property', function() {
      var microdata = microtesia.parseMicrodata(h())[0];
      expect(microdata).to.have.property('ordered').that.is.an('array');
    })

    it('return in same order as appears in the HTML', function() {
      var microdata = microtesia.parseMicrodata(h())[0];
      expect(microdata.ordered).to.be.sorted();
    })
  })

  // TODO implement properties with multiple names
  xit('should parse property with multiple names', function() {
    var h = html(`<div itemscope>
                    <span itemprop="favorite-color favorite-fruit">orange</span>
                  </div>`);

    var microdata = microtesia.parseMicrodata(h)[0];
    expect(microdata).to.have.property('favorite-color').and.property('favorite-fruit');
  })

  it('should parse item types', function() {
    var h = html(`<section itemscope itemtype="http://example.org/animals#cat">
                    <h1 itemprop="name">Hedral</h1>
                  </section>`);

    var microdata = microtesia.parseMicrodata(h)[0];
    expect(microdata).to.have.property('_type').that.equals('http://example.org/animals#cat');
  })

  it('should parse nested item types', function() {
    var h = html(`<section itemscope itemtype="http://example.org/animals#cat">
                    <h1 itemprop="owner" itemscope itemtype="http://example.org/animals#person">Hedral</h1>
                  </section>`);

    var microdata = microtesia.parseMicrodata(h)[0];

    expect(microdata.owner).to.have.property('_type').that.equals('http://example.org/animals#person');
  })

  it('should parse multiple elements', function() {
    var h1 = html(`<div></div>`);

    var h2 = html(`<section itemscope itemtype="http://example.org/animals#cat">
                     <h1 itemprop="owner" itemscope itemtype="http://example.org/animals#person">Hedral</h1>
                   </section>`);

    var microdata = microtesia.parseMicrodata([h1, h2]);

    expect(microdata).to.not.be.empty;
  })

  it('should filter items is type is specified', function() {
    var h = html(`<section itemscope itemtype="http://example.org/animals#cat">
                  </section>
                  <section itemscope>
                    <h1 itemprop="name">Hedral</h1>
                  </section>`);

    var microdata = microtesia.parseMicrodata('http://example.org/animals#cat', h);

    expect(microdata).to.have.lengthOf(1)
      .and.deep.include({ _type: 'http://example.org/animals#cat' });
  })

  it('should parse complex microdata', function() {
    var h = html(`<article role="article" itemscope itemtype="http://schema.org/Organization">

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

                </article>`)

    var expected = {
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
    }

    var microdata = microtesia.parseMicrodata(h);

    expect(microdata).to.deep.include(expected);
  })

  it('should add properties from a single itemref', function() {
    var h = html(`<div id="x">
                   <p itemprop="a">1</p>
                  </div>
                  <div itemscope itemref="x">
                   <p itemprop="b">test</p>
                  </div>`);

    var microdata = microtesia.parseMicrodata(h)[0];

    expect(microdata).to.have.property('a').that.equals('1');
  })

  it('should add properties from multiple itemrefs', function() {
    var h = html(`<div id="x">
                   <p itemprop="a">1</p>
                  </div>
                  <div id="y">
                   <p itemprop="c">2</p>
                  </div>
                  <div itemscope itemref="x y">
                   <p itemprop="b">test</p>
                  </div>`);

    var microdata = microtesia.parseMicrodata(h)[0];

    expect(microdata).to.have.property('c').that.equals('2');
  })

  it('should not fail for non-existent itemref', function() {
    var h = html(`<div id="x">
                   <p itemprop="a">1</p>
                  </div>
                  <div itemscope itemref="y">
                   <p itemprop="b">test</p>
                  </div>`);

    var microdata = microtesia.parseMicrodata(h)[0];

    expect(microdata).to.not.have.property('a').that.equals('1');
  })

})
