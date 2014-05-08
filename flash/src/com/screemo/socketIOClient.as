/**
 * Created with IntelliJ IDEA.
 * User: nitzo
 * Date: 28/04/14
 * Time: 17:27
 * To change this template use File | Settings | File Templates.
 */
package com.screemo {
import flash.display.MovieClip;
import flash.text.TextField;

import io.socket.flash.ISocketIOTransport;
import io.socket.flash.ISocketIOTransportFactory;
import io.socket.flash.SocketIOErrorEvent;
import io.socket.flash.SocketIOEvent;
import io.socket.flash.SocketIOTransportFactory;
import io.socket.flash.WebsocketTransport;
import io.socket.flash.XhrPollingTransport;


public class socketIOClient extends MovieClip {
    public var txtData:TextField;
    public var textArea:TextField;
    private var _socketIOTransportFactory:ISocketIOTransportFactory = new SocketIOTransportFactory();
    private var _ioSocket:ISocketIOTransport;


    public function socketIOClient() {
        trace('AAAA');
        txtData.text = 'THIS IS A TEST';
        connectToSocket();
    }


    public function connectToSocket(){
        _ioSocket = _socketIOTransportFactory.createSocketIOTransport(WebsocketTransport.TRANSPORT_TYPE, "localhost:3000/socket.io", this);
        _ioSocket.addEventListener(SocketIOEvent.CONNECT, onSocketConnected);
        _ioSocket.addEventListener(SocketIOEvent.DISCONNECT, onSocketDisconnected);
        _ioSocket.addEventListener(SocketIOEvent.MESSAGE, onSocketMessage);
        _ioSocket.addEventListener(SocketIOErrorEvent.CONNECTION_FAULT, onSocketConnectionFault);
        _ioSocket.addEventListener(SocketIOErrorEvent.SECURITY_FAULT, onSocketSecurityFault);
        _ioSocket.connect();
    }

    private function onSocketConnectionFault(event:SocketIOErrorEvent):void
    {
        logMessage(event.type + ":" + event.text);
    }
    private function onSocketSecurityFault(event:SocketIOErrorEvent):void
    {
        logMessage(event.type + ":" + event.text);
    }
    private function onDisconnectClick():void
    {
        _ioSocket.disconnect();
    }
    private function onSocketMessage(event:SocketIOEvent):void
    {
        if (event.message is String)
        {
            logMessage(String(event.message));
            setTitle(JSON.stringify(event.message));
        }
        else
        {
            logMessage(JSON.stringify(event.message));
            setTitle(event.message.args[0]);
        }
    }
    private function onSendClick():void
    {
        _ioSocket.send({type: "chatMessage", data: "Привет!!!"});
        _ioSocket.send({type: "chatMessage", data: "Delirium tremens"});
        _ioSocket.send("HELLO!!!");
    }

    private function onSocketConnected(event:SocketIOEvent):void
    {
        if (event){
            logMessage("Connected" + JSON.stringify(event.target));
        }

    }
    private function onSocketDisconnected(event:SocketIOEvent):void
    {
        logMessage("Disconnected" + event.target);
    }
    private function logMessage(message:String):void
    {
        textArea.text = textArea.text + message + "\n";
        textArea.scrollV = textArea.numLines;
    }

    private function setTitle(title:String){
        txtData.text = title;
    }
}
}
