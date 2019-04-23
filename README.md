# Chart library

## How to use
### 1. npm package
Run  `npm install --save <package name>`
Import `bundle.css` file to your project

### 2. Include in html  
Include `bundle.js` and `bundle.css` directly into html
```
<script src="<path to file>/bundle.js"></script>
<link rel="stylesheet" href="<path to file>/bundle.css"></link>
```
## How to develop
To start develop run `npm run build:watch`

`src/` main folder with source code.
`dist/` folder with build
`index.html` playground (TODO: create convenient layout)


If you like to check it on the fly as npm package: 
 - run `npm link`
- go to your project where you are intended to install package and run `npm link <package name>`

## TODO:
- hide rollup warnings for d3 module "Circular dependency"
- cofigure TypeDoc
- ...