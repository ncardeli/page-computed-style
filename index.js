#! /usr/bin/env node
const cli = require('cli');
const phantomjs = require('phantomjs-prebuilt');
const path = require('path');
const options = cli.parse({
  "page": ["p", "The page whose computed style CSS file will be generated.", "string", ""],
  "output": ["o", "Path of the output CSS file (optional). If no output file is especified, the result is written to the standard output.", "string", ""],
  "wait": ["w", "Time in miliseconds to wait before starting to serialize the computed style (optional).", "int", 0],
  "verbose": ["v", "Verbose mode (outputs console.log calls of the page)", "boolean", false],
  "htmloutput": ["t", "Path to output the HTML file (optional). Each element of the page will have a data-computed-style-id attribute that maps the generated computed style of the element, to the element.", "string", ""]
});

if (options.page) {
  let serializer_script = path.resolve(__dirname, 'serializer.js');
  let program = phantomjs.exec(serializer_script, options.page, options.wait, options.output, options.verbose, options.htmloutput);

  program.stdout.pipe(process.stdout);
  program.stderr.pipe(process.stderr);
  program.on('exit', code => {
    if (code === 0) {
      cli.output("Done");
    }
    else {
      cli.fatal("Error processing " + options.page);
    }
  });
}
else {
  cli.output("You must provide a page URL");
}
