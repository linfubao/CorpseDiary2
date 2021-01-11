let moduleMap = {
'assets/internal/index.js' () { return require('assets/internal/index.js') },
'src/scripts/game/index.js' () { return require('src/scripts/game/index.js') },
'src/scripts/home/index.js' () { return require('src/scripts/home/index.js') },
'src/scripts/music/index.js' () { return require('src/scripts/music/index.js') },
'assets/start-scene/index.js' () { return require('assets/start-scene/index.js') },
'src/scripts/main/index.js' () { return require('src/scripts/main/index.js') },
// tail
};

window.__cocos_require__ = function (moduleName) {
    let func = moduleMap[moduleName];
    if (!func) {
        throw new Error(`cannot find module ${moduleName}`);
    }
    return func();
};