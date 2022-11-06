//getDate Module
//exports name of function ,can be used with obj.getDate()
exports.getDate = function() {
  const today = new Date();
  const currentDay = today.getDay();

  const options = {
    weekday: "long",
    day: "numeric",
    month: "long"
  };

  return today.toLocaleDateString("en-US", options);
};

//exports name of function ,can be used with obj.getDay()
exports.getDay = function () {
  const today = new Date();
  const currentDay = today.getDay();

  const options = {
    weekday: "long",
  };

  return today.toLocaleDateString("en-US", options);
};
