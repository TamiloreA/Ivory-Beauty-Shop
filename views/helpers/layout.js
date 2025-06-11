const fs = require('fs');
const ejs = require('ejs');

module.exports = {
    extend: (layout, data) => {
        return function(content) {
            const layoutContent = fs.readFileSync(`views/${layout}.ejs`, 'utf-8');
            const mergedData = Object.assign({}, data, { body: content });
            return ejs.render(layoutContent, mergedData);
        };
    }
};