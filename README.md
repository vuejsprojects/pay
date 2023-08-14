# play

This README was written way after this repo was created (2020) because I couldn't remember how things worked!  
There is a READEME inpublic but in now (2023) obsolte.  

## What is Play
This app is a pure javascript. It is a game  which is similar to Pac Man.  
The JS scripts were written as module which means the JS needs to be packed in order to be run.  

## How to build it

I believe at the time I wrote in VueJS (but I could be wrong) and therefore it was built automatically with WebPack.

### Manual build without WebPack ad Deployment
 
 #### Install WebPack
 In the root folder
 
 ```
sudo apt install npm
npm install webpack webpack-cli --save-dev
```

### build

 ```
npx webpack --config webpack.config.js
```
This creates a main.js in the dist folder.  

**main.js** must now be called from **index.html**. Move it to the **index.html** folder.
Edit **index.html** and replace <script type="module" src="./src/index.js"></script>  with <script  src="./main.js"></script>


### Delpoy
Copy both **index.html and main.js** to your web hosing company site in the same folder 

## Where is it deployed
In 20202 it was hosted on @000webhost.com but it appears I can no longer gain access to it.  

I installed a build **Infinityfree.com** in 2023 only to evaluate **Infinityfree.com*  
The URL is http://theoffice.great-site.net



