'use strict';
module.exports = function(app) {
  var sensors = require('../controllers/sensorController');


  // sensors Routes
  app.route('/sensors')
    .get(sensors.list_all_sensors)
    .post(sensors.create_a_sensor);


  app.route('/sensors/:sensorId').get(sensors.read_a_sensor)
    .put(sensors.update_a_sensor)
    .delete(sensors.delete_a_sensor);
};
