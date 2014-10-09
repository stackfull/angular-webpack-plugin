# angular-webpack-plugin [![Build Status](https://travis-ci.org/stackfull/angular-webpack-plugin.png?branch=master)](https://travis-ci.org/stackfull/angular-webpack-plugin)
[![Gitter](https://badges.gitter.im/Join Chat.svg)](https://gitter.im/stackfull/angular-webpack-plugin?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

Makes webpack aware of AngularJS modules.

## Getting Started
This project is just getting off the ground.

It is at the stage now where you can use it to get angular apps webpacked without needing `require()` in your code, but it does it by trying to map between angular module names and file names. The conventions for doing this are various, so it will not fit all cases. Please submit an issue on github if it isn't working for your modules and I'll try to iron out the wrinkles over time.

To see it in action, I've [forked the angular-seed project](https://github.com/stackfull/angular-seed)


## Release History

#### 0.0.1 - 22 Apr 2014
First release

#### 0.0.2 - 28 July 2014
Working well enough to build the angular-seed project.


## License
Copyright (c) 2014 Paul Thomas. Licensed under the MIT license.
