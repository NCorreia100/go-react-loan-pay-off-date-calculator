
'use strict';

//node modules
const fs = require('fs');
const path = require('path');

const isProd = process.env.NODE_ENV.search('production')>-1;

const envVarsFile = path.resolve(__dirname,'.env');

//load env vars into client environment
if (fs.existsSync(envVarsFile)) {
    require('dotenv-expand')(
      require('dotenv').config({
        path: envVarsFile,
      })
    );
  }



  //build env var object
  let rawVars ={};  
  Object.keys(process.env)
      .filter(key=>key.search('REACT_APP')>-1)
      .forEach(key => rawVars[key] = process.env[key]);
      
  rawVars.NODE_ENV = isProd? 'production' :'development';
  rawVars.PUBLIC_URL = path.resolve(__dirname,'build');

    //build  stringified env var object
    let jsonVars ={'process.env':{}}; 
    Object.keys(rawVars).forEach(key=> jsonVars['process.env'][key]=JSON.stringify(rawVars[key]));

module.exports.getEnvVars=function(){
    console.log('env vars raw',rawVars);
    // console.log('env vars json',jsonVars);
    return {rawVars,jsonVars};
}



