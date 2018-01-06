# page-computed-style

A CLI to output the computed style of all the elements of a page.

The resulting CSS will have a rule for each element of the page. Each rule will have an attribute selector, to be able to match the rule with its corresponding element:

```
[data-computed-style-id='0'] {
  ...
}

[data-computed-style-id='1'] {
  ...
}
...
```

## Prerequisites

Node 6.10.0 or higher, together with NPM 3 or higher.

## Installing

```
npm install -g ncardeli/page-computed-style
```

## Usage

To get the computed style of a page in the standard output, type:
```
page-computed-style -p http://path/to/page
```

To write the computed style of a page to a CSS file, type:
```
page-computed-style -p http://path/to/page -o path/to/file.css
```

To also write the HTML of the page to a file, type:
```
page-computed-style -p http://path/to/page -o path/to/file.css -t path/to/file.html
```
The resulting HTML will be modified to add an attribute to each element of the page, to match it with its corresponding CSS rule.

For help and more options, type:

```
page-computed-style -h
```

## Installing & Using Locally

If you would rather installing the package locally, omit `-g` parameter and the usage will be directly from `node_modules/page-computed-style/index.js`:

```
node ./node_modules/page-computed-style/index.js -p http://path/to/page
```

Other options also apply for local installation.

## Built With

* [PhantomJS](http://phantomjs.org/)

## License

MIT
