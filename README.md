# angular-webpack-plugin [![Build Status](https://travis-ci.org/stackfull/angular-webpack-plugin.png?branch=master)](https://travis-ci.org/stackfull/angular-webpack-plugin)

Makes webpack aware of AngularJS modules.

## Getting Started
This project is just getting off the ground.

It is at the stage now where you can use it to get angular apps webpacked
without needing `require()` in your code, but it does it by trying to map
between angular module names and file names. The conventions for doing this are
various, so it will not fit all cases. Please submit an issue on github if it
isn't working for your modules and I'll try to iron out the wrinkles over time.

To see it in action, I've [forked the angular-seed project](https://github.com/stackfull/angular-seed)

## Development

Given how complex the problem is, regular test frameworks can't help much. I've
developed a small grunt task to run compile scenarios and check the output. It's
less than ideal and a little fragile. To add new scenarios, create a directory
in test/scenarios containing a webpack.conf.js config file, an `in` and an `out`
directory. The `in` directory will be used as the source and the output will
be compared against `out/bundle.js` (ignoring comments etc.).

To run the scenarios::

    grunt webpackScenario

by default, it won't show what the output was when it doesn't match, so use

    grunt --debug webpackScenario

In addition, karma tests in the `verify` directory check that the output makes
a viable executable using the `karma.conf.js` file.

The default grunt task checks everything.

## Release History

#### 0.0.3 - 7 Dec 2014
Webpack 1.4 and fix for modules using window.angular

#### 0.0.2 - 28 July 2014
Working well enough to build the angular-seed project.

#### 0.0.1 - 22 Apr 2014
First release


## License
Copyright (c) 2014 Paul Thomas. Licensed under the MIT license.
