require('dotenv').config()
const express = require('express')
const app = express()
const hoverDns = require('./hoverDns')(process.env.HOVER_USER, process.env.HOVER_PASS);

const update = function(){
  hoverDns.updateDns(process.env.DDNS_HOST, process.env.HOVER_DOMAIN, process.env.HOVER_SUBDOMAIN);
};

app.listen((process.env.PORT || 3000), function () {  
  setInterval(function(){
    update();
  }, 4*60*60*1000); //run every four hours;
  
  app.get('/', function(req, res){
    update().then(function(){
      res.send('Update request sent.')
    })
  })
  
})