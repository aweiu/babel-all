/**
 * Created by aweiu on 16/9/16.
 */
var babel = require('babel-core')
var babelPlugin = require('babel-plugin-transform-es2015-modules-simple-commonjs')
var es2015 = require('babel-preset-es2015')
var stage2 = require('babel-preset-stage-2')
var path = require('path')
var fs = require('fs')
var exec = require('child_process').exec
var config = eval(fs.readFileSync('./babel-all.js', 'utf8'))
var ignore = config.ignore
var others = config.others
function translate (ff, ignore) {
  ignore = ignore || []
  if (ignore.indexOf(ff) !== -1) return
  var files = fs.readdirSync(ff)
  for (var fn in files) {
    var fPath = ff + path.sep + files[fn]
    if (ignore.indexOf(fPath) !== -1) continue
    var stat = fs.lstatSync(fPath)
    if (stat.isDirectory()) translate(fPath, ignore)
    else if (files[fn].substring(files[fn].length - 3) === '.js') {
      var dir = './dist/' + fPath
      if (config.es2015) var presets = [es2015, stage2]
      if (mkdirsSync(dir)) fs.writeFileSync(dir, babel.transformFileSync(fPath, {babelrc: false, plugins: [babelPlugin], presets: presets}).code)
    }
  }
}
function mkdirsSync (dirpath, mode) {
  if (!fs.existsSync(dirpath)) {
    try {
      var pathtmp
      dirpath = dirpath.split(path.sep)
      for (var i = 0, l = dirpath.length - 1; i < l; i++) {
        pathtmp = pathtmp ? path.join(pathtmp, dirpath[i]) : dirpath[i]
        if (!fs.existsSync(pathtmp)) fs.mkdirSync(pathtmp, mode)
      }
    } catch (e) {
      return false
    }
  }
  return true
}
function addOtherFile (options) {
  for (var fPath in options) {
    var str = fs.readFileSync(fPath, 'utf8')
    var strFun = options[fPath]
    var dir = './dist/' + fPath
    if (mkdirsSync(dir)) fs.writeFileSync(dir, typeof strFun === 'function' ? strFun(str) : str)
  }
}
module.exports = function () {
  console.log('start babel-all...')
  exec('rm -rf dist', function () {
    translate('.', ignore)
    addOtherFile(others)
    console.log('babel-all completed')
  })
}

