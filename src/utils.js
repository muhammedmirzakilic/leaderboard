const multiplier = 1000000;
function combinePointsAndAverage(points, average) {
  return points * multiplier + average;
}

function splitPointsAndAverage(score) {
  const average = score % multiplier;
  const points = (score - average) / multiplier;
  return { average, points };
}
module.exports = {
  combinePointsAndAverage,
  splitPointsAndAverage,
};
