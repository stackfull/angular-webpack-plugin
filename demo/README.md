To get the demo working, first ensure you have webpack and bower globally installed. In your command line type:

    npm install webpack -g;
    npm install bower -g;

(Webpack may have some issues installing on Windows. If it doesn't work, simply try it again and it usually works the second time.)

Next, in your CLI download your node and bower dependencies (e.g. angular and angular-webpack-plugin).

    npm install;
    bower install;

(If Windows users again experience issues with npm install, try it again and it should work the second time)

You're almost set! All the config is set in webpack.config.js, so we just need to run the simple webpack CLI command:

    webpack;

Now open index.html in your browser (e.g. get it served by a local server or even open it as a file) and you should see everything loaded.
