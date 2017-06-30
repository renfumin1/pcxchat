﻿/** * Created by Randy on 2017/6/14. */"use strict";var express = require('express');var app = express();var path = require('path');app.use(express.static(__dirname));app.get('/',function(req,res){    res.sendFile(path.join(__dirname,'index.html'))})app.get('/about',function(req,res){    res.sendFile(path.join(__dirname,'about.html'))})var server = require('http').createServer(app);var io = require('socket.io')(server)var clients = {};io.on('connection',function(socket){var username;    socket.send({user:'系统消息',content:'请输入用户名'})    socket.on('message',function(message){        var result = message.match(/^@(.+)\s(.+)$/)        if(result){            var toUser = result[1];            if(clients[toUser]){                socket.send({user:username,content:'[私聊]'+message})                clients[toUser].send({user:username,content:'[私聊]'+message})            }else{                socket.send({user:'系统提示',content:'用户不存在或已离线'})            }        }else{            if(username){                for(var s in clients){                    clients[s].send({user:username,content:message})                }            }else{                username = message;                if(clients[username]){                    socket.send({user:'系统消息',content:'当前用户名已存在'})                    username = "";                }else{                    //clients的key是用户名 value是socket对象                    clients[username] = socket;                    socket.send({user:'系统消息',content:'欢迎您，'+username})                }            }        }    })})server.listen(3033);