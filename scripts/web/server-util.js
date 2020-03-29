'use strict';
// libraries
const http = require('http');
const https = require('https');
const cors = require('cors');
const express = require('express');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

// modules
const dateUtil = require('../util/date-util.js');

// constants

// variables
let config;
let loggingUtil;
let instance;
let closeProgramFn;

// functions
const init = async (_config, _loggingUtil) => {
  if (_config === undefined) {
    throw new Error('config is required.');
  }
  if (_loggingUtil === undefined) {
    throw new Error('loggingUtil is required.');
  }
  config = _config;
  loggingUtil = _loggingUtil;

  await initWebServer();
};

const deactivate = async () => {
  config = undefined;
  loggingUtil = undefined;
  closeProgramFn = undefined;
  instance.close();
};

const initWebServer = async () => {
  const app = express();

  app.engine('.hbs', exphbs({extname: '.hbs',
    defaultLayout: 'main'}));
  app.set('view engine', '.hbs');

  app.use(express.static('static-html'));
  app.use(express.urlencoded({
    limit: '50mb',
    extended: true,
  }));
  app.use(bodyParser.json({
    limit: '50mb',
    extended: true,
  }));
  app.use((err, req, res, next) => {
    if (err) {
      loggingUtil.log(dateUtil.getDate(), 'error', err.message, err.body);
      res.send('');
    } else {
      next();
    }
  });

  app.use(cookieParser(config.cookieSecret));

  app.get('/', async (req, res) => {
    res.redirect(302, '/soccer');
  });

  app.post('/', async (req, res) => {
    res.redirect(302, '/');
  });

  app.get('/soccer', async (req, res) => {
    const data = {};
    res.render('soccer', data);
  });

  app.get('/favicon.ico', async (req, res) => {
    res.redirect(302, '/favicon-16x16.png');
  });

  app.post('/favicon.ico', async (req, res) => {
    res.redirect(302, '/favicon.ico');
  });

  app.options('/api', cors());

  app.post('/api', cors(), async (req, res) => {
    // loggingUtil.log(dateUtil.getDate(), 'api STARTED', req.body);
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 30000,
    };
    const url = config.bananodeApiUrl;
    const proxyReq = https.request(url, options, (proxyRes) => {
      proxyRes.on('data', (response) => {
        // loggingUtil.log(dateUtil.getDate(), 'api SUCCESS', req.body);
        res.send(response);
      });
    });

    proxyReq.on('error', (error) => {
      loggingUtil.log(dateUtil.getDate(), 'api FAILURE', req.body, error);
    });

    proxyReq.write(JSON.stringify(req.body));
    proxyReq.end();
  });

  app.get('/recording', async (req, res) => {
    const data = await getSessionData(req);
    const language = getLanguageCookie(req);
    data.recaptcha = recaptchaUtil.getCaptchaData('recording');
    data.languages = localizationUtil.getLanguageList(language);
    data.lang = localizationUtil.getLanguageData(language);
    if (config.defaultRecordingTypePublic) {
      data.defaultRecordingType = 'public';
    } else {
      data.defaultRecordingType = 'private';
    }
    res.render('recording', data);
  });


  app.get('/recording.json', async (req, res) => {
    res.redirect(302, '/recording.json');
  });

  app.post('/recording.json', async (req, res) => {
    const queryObject = req.body;
    // loggingUtil.log('/recording.json queryObject', queryObject);
    const data = await getSessionData(req);
    const userFilePath = hashUtil.getHash(data.sessionKey);

    const recordingKey = [userFilePath];
    if (queryObject.action) {
      data.messageType = queryObject.action;
      if (queryObject.action == 'submit_recording') {
        if (data.hasSessionKey) {
          const recordingData = {};
          recordingData.recording = queryObject.recording;
          // loggingUtil.log('/recording.json setRecording', recordingKey, recordingData);
          await filesystemUtil.setRecording(recordingKey, recordingData);
          data.messageType = 'success';
          data.message = `${queryObject.action}`;
        } else {
          data.messageType = 'failure';
          data.message = `failure:${queryObject.action} no session key`;
        }
      } else {
        data.messageType = 'action_error';
        data.message = `unknown action:${queryObject.action}`;
      }
    }

    data.recording = await filesystemUtil.getRecording(recordingKey);
    if (config.defaultRecordingType = 'public') {
      data.recordings = await filesystemUtil.getRecordings();
    } else {
      data.recordings = [data.recording];
    }
    // loggingUtil.log('/recording.json recordings', data.recordings.length);

    res.send( data);
  });


  app.use((req, res, next) => {
    res.status(404);
    res.type('text/plain;charset=UTF-8').send('');
  });

  const server = http.createServer(app);

  instance = server.listen(config.web.port, (err) => {
    if (err) {
      loggingUtil.error(dateUtil.getDate(), 'banano-story-drawing ERROR', err);
    }
    loggingUtil.log(dateUtil.getDate(), 'banano-story-drawing listening on PORT', config.web.port);
  });


  const io = require('socket.io')(server);
  io.on('connection', (socket) => {
    socket.on('npmStop', () => {
      socket.emit('npmStopAck');
      socket.disconnect(true);
      closeProgramFn();
    });
  });
};

// const isObject = function(obj) {
//   return (!!obj) && (obj.constructor === Object);
// };

const setLoginMessageCookie = (res, message) => {
  res.cookie('loginMessage', message, {signed: true});
};

const getLoginMessageCookie = (req) => {
  if (req.signedCookies.loginMessage === undefined) {
    return '';
  } else {
    return req.signedCookies.loginMessage;
  }
};

const setLanguageCookie = (res, language) => {
  res.cookie('language', language, {signed: true});
};

const getLanguageCookie = (req) => {
  let language;
  if (req.signedCookies.language === undefined) {
    language = 'en';
  } else {
    language = req.signedCookies.language;
  }
  return language;
};

const setSessionKeyCookie = (res, sessionKey) => {
  res.cookie('sessionKey', sessionKey, {signed: true});
};

const getSessionKeyCookie = (req) => {
  let sessionKey;
  if (req.signedCookies.sessionKey === undefined) {
    sessionKey = '';
  } else {
    sessionKey = req.signedCookies.sessionKey;
  }
  if (sessionKey.length != 66) {
    sessionKey = '';
  }
  return sessionKey;
};

const setCloseProgramFunction = (fn) => {
  closeProgramFn = fn;
};

// const getQueryObject = (req) => {
//   const queryObject = url.parse(req.url, true).query;
//   return queryObject;
// };

const isRecaptchaTokenValid = async (queryObject, ip) => {
  if (!(queryObject.recaptchaToken)) {
    // loggingUtil.log(dateUtil.getDate(), `isRecaptchaTokenValid queryObject.recaptchaToken:'${queryObject.recaptchaToken}'` );
    return false;
  } else {
    // loggingUtil.log(dateUtil.getDate(), 'isRecaptchaTokenValid queryObject', JSON.stringify(queryObject));
    const recaptchaResponseStr = await recaptchaUtil.getCaptchaResponse(queryObject.recaptchaToken, ip);
    if ((recaptchaResponseStr) && (recaptchaResponseStr.startsWith('{'))) {
      const recaptchaResponse = JSON.parse(recaptchaResponseStr);
      // loggingUtil.log(dateUtil.getDate(), 'isRecaptchaTokenValid recaptchaResponse', ip, recaptchaResponse);
      if (recaptchaResponse.success == false) {
        return false;
      } else {
        return true;
      }
    } else {
      return false;
    }
  }
};

// exports
exports.init = init;
exports.deactivate = deactivate;
exports.setCloseProgramFunction = setCloseProgramFunction;
