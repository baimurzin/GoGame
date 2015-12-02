var app = require('./app/config');
var config = require('./app/config/config');
var log = require('./app/libs/log')(module);

app.use('/api', require('./app/routes'));


app.set('port', config.get('port'));

app.listen(app.get('port'), function () {
    log.info("server started on port " + app.get('port'));
});