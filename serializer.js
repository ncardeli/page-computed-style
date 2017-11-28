var page = require('webpage').create();
var system = require('system');
var fs = require('fs');

var pageUrl = system.args[1];
var wait = parseInt(system.args[2], 10);
var cssPath = system.args[3];
var verbose = (system.args[4] === "true");
var htmlPath = system.args[5];

function evaluate () {
  page.evaluate(function() {
    function serialize() {
      var output = [],
          result = document.querySelectorAll("*"),
          el,
          buffer,
          computedStyle,
          i,
          j;

      for (j=0, resultLength=result.length; j<resultLength; j++) {
          el = result[j];
          buffer = [];
          computedStyle = window.getComputedStyle(el);

          el.setAttribute("data-computed-style-id", j);

          buffer.push("[data-computed-style-id='" + j + "'] {\r\n")
          for (i=0, len=computedStyle.length; i<len; i++) {
              buffer.push("    " + computedStyle[i] + ": " + computedStyle[computedStyle[i]] + ";\r\n");
          }
          buffer.push("}\r\n\r\n")

          output.push(buffer.join(""));
      }

      return {
        css: output.join(""),
        html: document.documentElement.outerHTML
      };
    };

    window.callPhantom(serialize());
  });
}

function openPage(status) {
  console.log("Fetching " + pageUrl);
  if (status !== 'success') {
    console.log("Unable to fetch the page (" + status + ")");
    phantom.exit();
  } else {
    if (wait) {
      console.log("Waiting " + wait + "ms");

      setTimeout(evaluate, wait)
    }
    else {
      evaluate();
    }
  }
}

function onCallback(result) {
  if (cssPath) {
    console.log("Writing computed style CSS to " + cssPath);
    fs.write(cssPath, result.css, 'w');
  }
  else {
    console.log(result.css);
  }
  if (htmlPath) {
    console.log("Writing HTML to " + htmlPath);
    fs.write(htmlPath, result.html, 'w');
  }
  phantom.exit();
};

function onConsoleMessage(msg) {
  if (verbose) {
    console.info(msg);
  }
}

function onResourceError(resourceError) {
  console.error(resourceError.url + ': ' + resourceError.errorString);
}

function onError(msg, trace) {
    system.stderr.writeLine('= onError()');
    var msgStack = ['  ERROR: ' + msg];
    if (trace) {
        msgStack.push('  TRACE:');
        trace.forEach(function(t) {
            msgStack.push('    -> ' + t.file + ': ' + t.line + (t.function ? ' (in function "' + t.function + '")' : ''));
        });
    }
    system.stderr.writeLine(msgStack.join('\n'));
}

page.onConsoleMessage = onConsoleMessage;
page.onCallback = onCallback;
page.onResourceError = onResourceError;
page.onError = onError;
page.open(pageUrl, openPage);
