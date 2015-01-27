define(['text', 'hogan'], function(text, hogan) {
    var buildCache = {};
    var buildCompileTemplate = 'define("{{pluginName}}!{{moduleName}}", ["hogan"], function(hogan){return new hogan.Template({{{fn}}});});';
    var buildTemplate;

    var hgn = {
        load: function(moduleName, parentRequire, onload, config) {
            var extension = (config.hgn && config.hgn.extension) || 'mustache';

            if (moduleName.lastIndexOf('.') < 0) {
                moduleName += '.' + extension;
            }

            text.get(parentRequire.toUrl(moduleName), function(data) {
                if(config.isBuild) {
                    buildCache[moduleName] = data;
                    onload();
                } else {
                    onload(hogan.compile(data));
                }
            });
        },
        write: function(pluginName, moduleName, write) {
            if(!buildTemplate) {
                buildTemplate = hogan.compile(buildCompileTemplate);
            }

            if(buildCache.hasOwnProperty(moduleName)) {
                write(buildTemplate.render({
                    pluginName: pluginName,
                    moduleName: moduleName,
                    fn: hogan.compile(buildCache[moduleName], {asString: true})
                }));
            }
        }
    };

    return hgn;
});