require('dotenv').config()
const express = require('express')
const app = express()
const hoverDns = require('./hoverdns')(process.env.HOVER_USER, process.env.HOVER_PASS);

const update = function(){
  return hoverDns.updateDns(process.env.DDNS_HOST, process.env.HOVER_DOMAIN, process.env.HOVER_SUBDOMAIN);
};

app.listen((process.env.PORT || 3000), function () {  
  setInterval(function(){
    console.log('Sending DNS update request...')
    update();
  }, 4*60*60*1000); //run every four hours;
  
  app.get('/', function(req, res){
    update()
      .then(function(){
        res.send('Update request successful')
      })
      .catch(function(err){
        res.send(err);
      })
  })
  
})