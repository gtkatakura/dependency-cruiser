const expect     = require('chai').expect;
const extractES6Deps = require('../../../src/extract/ast-extractors/extract-ES6-deps');
const getASTFromSource  = require('../../../src/extract/parse/toJavascriptAST').getASTFromSource;

const extractES6 =
    (pJavaScriptSource, pDependencies) => extractES6Deps(getASTFromSource(pJavaScriptSource, 'js'), pDependencies);


describe("ast-extractors/extract-ES6-deps", () => {

    it("dynamic imports of strings", () => {
        let lDeps = [];

        extractES6("import('./dynamic').then(pModule => pModule.x);", lDeps);
        expect(
            lDeps
        ).to.deep.equal(
            [
                {
                    moduleName: './dynamic',
                    moduleSystem: 'es6'
                }
            ]
        );
    });

    it("dynamic imports of a template literal doesn't yield an import", () => {
        let lDeps = [];

        extractES6("import(`./dynamic`).then(pModule => pModule.x);", lDeps);
        expect(
            lDeps
        ).to.deep.equal(
            []
        );
    });

    it("yield a dynamic import yields an import", () => {
        let lDeps = [];
        const yieldImport = `function* a() {
            yield import('http');
        }`;

        extractES6(yieldImport, lDeps);
        expect(
            lDeps
        ).to.deep.equal(
            [
                {
                    moduleName: 'http',
                    moduleSystem: 'es6'
                }
            ]
        );
    });

    it("dynamic imports of a number doesn't yield an import", () => {
        let lDeps = [];

        extractES6("import(42).then(pModule => pModule.x);", lDeps);
        expect(
            lDeps
        ).to.deep.equal(
            []
        );
    });

    it("dynamic imports of a function call doesn't yield an import", () => {
        let lDeps = [];

        extractES6(`
            determineWhatToImport = () => 'bla';
            import(determineWhatToImport()).then(pModule => pModule.x);
        `,
        lDeps);
        expect(
            lDeps
        ).to.deep.equal(
            []
        );
    });
});