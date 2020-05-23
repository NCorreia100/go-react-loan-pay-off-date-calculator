//importing node-externals so that webpack doesn't compile the node_modules when bundling the server
// var nodeExternals = require('webpack-node-externals');


var path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const InterpolateHtmlPlugin = require('react-dev-utils/InterpolateHtmlPlugin');
const CopyDirectoryPlugin = require('copy-webpack-plugin')
const getCacheIdentifier = require('react-dev-utils/getCacheIdentifier');
// Get environment variables to inject into our app.
const {getEnvVars} = require('./processENV.js');
const envVars = getEnvVars();
// var SRC_DIR = path.join(__dirname, '../src');
// var SERVER_DIR = path.join(__dirname, 'server');
var DIST_DIR = path.join(__dirname, 'build');
const isProd = process.env.NODE_ENV.search('production')>-1;

const styleLoaders = [
   require.resolve('style-loader'), 
  {
    loader: require.resolve('css-loader'),
    options: { importLoaders: 1,  sourceMap: isProd},
  },
  {
    // Options for PostCSS as we reference these options twice   
    loader: require.resolve('postcss-loader'),
    options: {
      // Necessary for external CSS imports to work      
      ident: 'postcss',
      plugins: () => [
        require('postcss-flexbugs-fixes'),
        require('postcss-preset-env')({
          autoprefixer: {
            flexbox: 'no-2009',
          },
          stage: 3,
        }),
      ],
      sourceMap: isProd
    }
  }
];



module.exports = { 
  mode: isProd ? 'production' : 'development',
  devtool: isProd ? 'none' : 'eval',
  target: 'web', 
  entry: {
    'app-bundle':["@babel/polyfill",'whatwg-fetch','babel-plugin-es6-promise',path.resolve(__dirname,'src/index.js')],
    'ion-bundle':["@babel/polyfill",'whatwg-fetch','babel-plugin-es6-promise',path.resolve(__dirname, 'src/casper-ion/app.jsx')],
    'overrideTreg':["@babel/polyfill",'whatwg-fetch','babel-plugin-es6-promise',path.resolve(__dirname,'public/overrideTreg.js')],
    'captureStyles':["@babel/polyfill",'whatwg-fetch','babel-plugin-es6-promise',path.resolve(__dirname,'public/captureStyles.js')]
  },
  output: {
    path: DIST_DIR,
    filename: '[name].js',
    chunkFilename: 'chunks/casper.chunk.[name].js',
    publicPath:'/'
  },
  module: {
    rules: [      
        {
         //match regex and use first match. fallback to file-loader
          oneOf: [           
            { test:/\.svg$/, loader: 'svg-url-loader'},
            { test: /\.(jpe?g|png|gif|svg|ico)$/i, loader: 'url-loader?limit=8192',options: {name: 'static/[name].[hash:8].[ext]' }},              
            {
              test: /\.(js|mjs|jsx|ts|tsx)$/,
              exclude: /node_modules/,
              use: {
                loader: 'babel-loader',
                query: {
                  presets: ['@babel/preset-env','@babel/preset-react'] ,
                  plugins: [   
                    // "babel-plugin-es6-promise", //for older browsers that don't support Promises                 
                    "@babel/transform-runtime", //for async await                                                   
                    "@babel/plugin-syntax-dynamic-import",//for dynamic imports 
                    "@loadable/babel-plugin", //break code into chunks 
                    "@babel/plugin-transform-regenerator", //async imports of modules                        
                    "@babel/plugin-proposal-object-rest-spread", //convert to ES2015 rest spread
                    "@babel/plugin-proposal-class-properties",   //transforms static class properties                 
                    "@babel/plugin-transform-react-constant-elements", //optimizes garbage collection
                    "@babel/plugin-transform-react-inline-elements",  //remove vars from global scope
                    "babel-plugin-transform-react-remove-prop-types", //removed unused react propTypes
                    "babel-plugin-transform-dead-code-elimination" //? eliminates unused code
                 ]                
                }, 
                //options:{               
                //  babelrc: false,
                //  configFile: false,
                //  cacheDirectory: true,
                //  cacheCompression: isProd,
                //  compact: isProd                  
              }             
            },
            // Process any JS outside of the app with Babel.
            {
              test: /\.(js|mjs)$/,
              exclude: /@babel(?:\/|\\{1,2})runtime/,
              loader: require.resolve('babel-loader'),
              options: {
                babelrc: false,
                configFile: false,
                compact: false,
                presets: ['@babel/preset-env','@babel/preset-react'],              
                cacheDirectory: true,
                cacheCompression: isProd,               
                cacheIdentifier: getCacheIdentifier(
                  isProd? 'production' : 'development',
                  [                    
                    '@babel/preset-env',
                    '@babel/preset-react',
                    'react-dev-utils'                   
                  ]
                )               
              },
            },           
            {
              test: /\.css$/,
              exclude: /\.module\.css$/,
              use: styleLoaders,             
              sideEffects: true
            },
            // Adds support for CSS Modules           
            {test: /\.module\.css$/,use: styleLoaders},
            // Opt-in support for SASS (using .scss or .sass extensions).
            
            {
              test: /\.(scss|sass)$/,
              exclude: /\.module\.(scss|sass)$/,
              use: styleLoaders,             
              sideEffects: true
            },
            // Adds support for CSS Modules, but using SASS            
            // {
            //   test: /\.module\.(scss|sass)$/,
            //   use: styleLoaders.push(require.resolve('sass-loader'))                 
            // },                     
            {
              loader: 'file-loader',
              // Exclude `js` files to keep "css" loader working as it injects             
              exclude: [/\.(js|mjs|jsx|ts|tsx)$/, /\.html$/, /\.json$/],
              options: {name: 'static/[name].[hash:8].[ext]' }
            }
          ]
        }      
      ]
    },
      plugins:[       
        // Generate html file
      new HtmlWebpackPlugin(
        Object.assign({},
          {
            inject: false,
            template: path.resolve(__dirname,'public/index.html')
          },
          isProd
            ? {
                minify: {
                  removeComments: true,
                  collapseWhitespace: true,
                  removeRedundantAttributes: true,
                  useShortDoctype: true,
                  removeEmptyAttributes: true,
                  removeStyleLinkTypeAttributes: true,
                  keepClosingSlash: true,
                  minifyJS: true,
                  minifyCSS: true,
                  minifyURLs: true
                },
              }
            : undefined)
      ),   
      //inject env vars into html  
      new InterpolateHtmlPlugin(HtmlWebpackPlugin, envVars.rawVars),  
      // inject env vars into app code   
      new webpack.DefinePlugin(envVars.jsonVars),
      //copy directory
      new CopyDirectoryPlugin([
        {from: path.resolve(__dirname,'public/hdn'), to: path.resolve(__dirname,'build/hdn')},
        {from: path.resolve(__dirname,'public/css'), to: path.resolve(__dirname,'build/css')},
        {from: path.resolve(__dirname,'public/images'), to: path.resolve(__dirname,'build/images')}
      ])
    ]
  
};
