'use strict';
module.exports = function(app) {
  var sensors = require('../controllers/sensorController');
  var auth = require('../controllers/middleware');

  // sensors Routes
  app.route('/sensors')
    .get(sensors.list_all_sensors)
    .post(sensors.create_a_sensor);


  app.route('/sensors/:sensorId').get(sensors.read_a_sensor)
    .put(sensors.update_a_sensor)
    .delete(sensors.delete_a_sensor);

  app.route('/users')
  	.get(sensors.list_all_users)
  	.post(sensors.create_a_user);

  app.route('/users/:username').get(auth.auth, sensors.read_a_user)
  	.put(auth.auth, sensors.update_a_user)
  	.delete(auth.auth, sensors.delete_a_user);

  app.route('/authenticate')
    .post(sensors.authenticate);
};
