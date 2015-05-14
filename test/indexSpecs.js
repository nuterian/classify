var assert = require("assert");
var expect = require("chai").expect;

var index = require("../index.js");

describe('index', function(){
    describe('splitData', function(){
        it('data is split into correct lengths based on ratio', function(){
            var splits = index.splitData([[1],[2],[3],[4],[5],[6]], 0.5);
            assert.equal(3, splits[0].length);
            assert.equal(3, splits[1].length);
        })

        it('data is split correctly when ratio is zero', function(){
            var splits = index.splitData([[1],[2],[3],[4],[5],[6]], 0);
            assert.equal(0, splits[0].length);
            assert.equal(6, splits[1].length);
        })
    })

    describe('generateClassMap', function(){
        it('generates a map with the correct labels', function(){
            var map = index.generateClassMap([[1, 20, 1], [2, 21, 0], [3, 22, 1]]);
            expect(map).to.have.property('0');
            expect(map).to.have.property('1');
        })

        it('generates a map with the correct number of rows assigned to each label', function(){
            var map = index.generateClassMap([[1, 20, 1], [2, 21, 0], [3, 22, 1]]);
            assert.equal(1, map['0'].length);
            assert.equal(2, map['1'].length);
        })
    })

    describe('summarize', function(){
        it('generates the correct number of attribute summaries', function(){
            var summary = index.summarize([[1,20,0], [2,21,1], [3,22,0]]);
            assert.equal(2, summary.length);
        })

        it('generates the correct values for each attribute', function(){
            var summary = index.summarize([[1,20,0], [2,21,1], [3,22,0]]);
            assert.equal(2, summary[0][0]);
            assert.equal(1, summary[0][1]);
            assert.equal(21, summary[1][0]);
            assert.equal(1, summary[1][1]);
        })
    })

    describe('summarizeByClass', function(){
        it('generates the correct number of attribute summaries by class label', function(){
            var summary = index.summarizeByClass([[1,20,1], [2,21,0], [3,22,1], [4,22,0]]);
            assert.equal(2, summary['0'].length);
            assert.equal(2, summary['1'].length);
        })

        it('generates the correct values for each attribute by class label', function(){
            var summary = index.summarizeByClass([[1,20,1], [2,21,0], [3,22,1], [4,22,0]]);
            assert.equal(3,                     summary['0'][0][0]);
            assert.equal(1.4142135623730951,    summary['0'][0][1]);
            assert.equal(21.5,                  summary['0'][1][0]);
            assert.equal(0.7071067811865476,    summary['0'][1][1]);

            assert.equal(2,                     summary['1'][0][0]);
            assert.equal(1.4142135623730951,    summary['1'][0][1]);
            assert.equal(21,                    summary['1'][1][0]);
            assert.equal(1.4142135623730951,    summary['1'][1][1]);
        })
    })

    describe('calculateProbability', function(){
        it('generates the correct probability value', function(){
            var prob = index.calculateProbability(71.5, 73, 6.2);
            assert.equal(0.06248965759370005, prob);
        })
    })

    describe('calculateClassProbabilities', function(){
        it('generates the correct probability values', function(){
            var prob = index.calculateClassProbabilities({0:[[1, 0.5]], 1:[[20, 5.0]]}, [1.1, '?']);
            assert.equal(0.7820853879509119,        prob['0']);
            assert.equal(0.0000629873625815044,     prob['1']);
        })
    })
})