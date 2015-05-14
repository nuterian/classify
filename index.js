
/**
 * Splits a given data set into randomly selected training and test data.
 * @param  {Array} data
 * @param  {Number} ratio
 */
function splitData(data, ratio) {
	var trainSize = Math.round(data.length * ratio);
	trainSet = [];
	var testSet = data.slice(0);
	while(trainSet.length < trainSize) {
		var index = Math.random() * testSet.length;
		trainSet.push(testSet.splice(index, 1));
	}
	return [trainSet, testSet];
}

function generateClassMap(data){
	var map = {};
	data.forEach(function(row){
		var label = row[row.length - 1];
		if(!(label in map)) {
			map[label] = [];
		}
		map[label].push(row);
	});
	return map;
}

function summarize(data){
	var summary = [], i;
	for(i = 0; i < data[0].length - 1; i++){
		summary.push([]);
	}

	data.forEach(function(row) {
		for(i = 0; i < row.length - 1; i++) {
			summary[i].push(row[i]);
		}
	});

	for(i = 0; i < summary.length; i++) {
		var avg = average(summary[i]);
		summary[i] = [avg.mean, avg.deviation];
	}
	return summary;
}

function summarizeByClass(data) {
	var map = generateClassMap(data);
	var summaries = {};
	for(var label in map) {
		summaries[label] = summarize(map[label]);
	}
	return summaries;
}

function calculateProbability(x, mean, std) {
	var exponent = Math.exp( -(Math.pow(x - mean, 2) / (2 * Math.pow(std, 2) )) );
	return (1 / (Math.sqrt(2 * Math.PI) * std)) * exponent;
}

function calculateClassProbabilities(summaries, input) {
	var prob = {};
	for(var label in summaries) {
		prob[label] = 1;
		for(var i = 0; i < summaries[label].length; i++){
			prob[label] *= calculateProbability(input[i], summaries[label][i][0], summaries[label][i][1]);
		}
	}
	return prob;
}

function predict(summaries, input) {
	var probs = calculateClassProbabilities(summaries, input);
	var bestLabel, maxProb = 0;
	for(var label in probs) {
		if(probs[label] > maxProb){
			maxProb = probs[label];
			bestLabel = label;
		}
	}
	return bestLabel;
}

function average(a) {
  var r = {mean: 0, variance: 0, deviation: 0}, t = a.length;
  for(var m, s = 0, l = t; l--; s += a[l]);
  for(m = r.mean = s / t, l = t, s = 0; l--; s += Math.pow(a[l] - m, 2));
  return r.deviation = Math.sqrt(r.variance = s / (t - 1)), r;
}

module.exports = {
	splitData: splitData,
	generateClassMap: generateClassMap,
	summarize: summarize,
	summarizeByClass: summarizeByClass,
	calculateProbability: calculateProbability,
	calculateClassProbabilities: calculateClassProbabilities,
	average: average
};