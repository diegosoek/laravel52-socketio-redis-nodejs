@extends('layouts.app')

@section('content')
<script src="//code.jquery.com/jquery-1.11.2.min.js"></script>
<script src="//code.jquery.com/jquery-migrate-1.2.1.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/socket.io/2.0.3/socket.io.js"></script>

<style type="text/css">
    #messages{
        border: 1px solid black;
        height: 300px;
        margin-bottom: 8px;
        overflow: scroll;
        padding: 5px;
    }
</style>

<div class="container spark-screen">
    <div class="row">
        <div class="col-md-10 col-md-offset-1">
            <div class="panel panel-default">
                <div class="panel-heading">Chat Message Module</div>

                <div class="panel-body">
 
                <div class="row">
                    <div class="col-lg-8" >
                      <div id="messages" ></div>
                    </div>
                    <div class="col-lg-8" >
                            <form action="sendmessage" method="POST">
                                <input type="hidden" name="_token" value="{{ csrf_token() }}" >
                                <input type="hidden" name="user" value="{{ Auth::user()->name }}" >
                                <textarea class="form-control msg"></textarea>
                                <br/>
                                <input type="button" value="Send" class="btn btn-success send-msg">
                            </form>
                    </div>
                </div>

                </div>
            </div>
        </div>
    </div>
</div>

<script>
/*
    var socket = io();
    $('form').submit(function(){
        var msg = $(".msg").val();
        socket.emit('myevent', msg);
        $('#m').val('');
        return false;
    });
    socket.on('myevent', function(msg){
        $('#messages').append($('<li>').text(msg));
        window.scrollTo(0, document.body.scrollHeight);
    });
    */
    var socket = io();

    socket.on('welcome', function(data) {
        addMessage(data.message);

        // Respond with a message including this clients' id sent from the server
        socket.emit('i am client', {data: 'foo!', id: data.id});
    });
    socket.on('time', function(data) {
        addMessage(data.time);
    });
    socket.on('error', console.error.bind(console));
    socket.on('message', console.log.bind(console));

    function addMessage(message) {
        var text = document.createTextNode(message),
            el = document.createElement('li'),
            messages = document.getElementById('messages');

        el.appendChild(text);
        messages.appendChild(el);
    }
    /*
    var socket = io.connect('http://104.154.160.255:8890');

    socket.on('message', function (data) {
        data = jQuery.parseJSON(data);
        console.log(data.user);
        $( "#messages" ).append( "<strong>"+data.user+":</strong><p>"+data.message+"</p>" );
      });

    $(".send-msg").click(function(e){
        e.preventDefault();
        var token = $("input[name='_token']").val();
        var user = $("input[name='user']").val();
        var msg = $(".msg").val();

        if(msg != ''){
            $.ajax({
                type: "POST",
                url: '{!! URL::to("sendmessage") !!}',
                dataType: "json",
                data: {'_token':token,'message':msg,'user':user},
                success:function(data){
                    console.log(data);
                    $(".msg").val('');
                }
            });
        }else{
            alert("Please Add Message.");
        }
    })
    */
</script>
@endsection
