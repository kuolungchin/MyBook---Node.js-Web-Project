$(document).ready(function(){
			
			  function renderReplies(data, messageTAG){
			  	$("p[postID=" + data.postID + "][type='reply']").remove();
				
				var arrLength = data.newReplies.length;
								
				data.newReplies.forEach(
					function(reply, index){
					  if(index < arrLength - 2){  
					    messageTAG =  messageTAG + "<p postID='" + data.postID + "' type='reply' isNewReply='false'><small>" + reply.dateString + "</small></p>";					        	 
					    messageTAG =  messageTAG + "<p postID='" + data.postID + "' type='reply' isNewReply='false'><a href='/u/" + reply.username + "'>" + reply.username + "</a> replied: <small>" + reply.message + "</small></p>";
					  }else{
					  	messageTAG =  messageTAG + "<p postID='" + data.postID + "' type='reply' isNewReply='true'><small>" + reply.dateString + "</small></p>";					        	 
					    messageTAG =  messageTAG + "<p postID='" + data.postID + "' type='reply' isNewReply='true'><a href='/u/" + reply.username + "'>" + reply.username + "</a> replied: <small>" + reply.message + "</small></p>";
					  }
				});
					        	 
				if(messageTAG.length > 0){
					$("p[postID=" + data.postID + "][type='comment']").after(messageTAG);									
				}
			  };
			  
			  $('ul.nav > li').click(function(){
				  $('ul.nav > li.active').removeClass('active');
				  $(this).addClass('active');
			  });
			  


			  $(document).on('click', 'a[postID], button[btnReply]', function(){
			  	
			    if($(this).is('a')){
			    	//console.log('a[postID] click')
				    if( $(this).attr('type') == "hide" ){
				    	$("p[postID=" + $(this).attr('postID') + "][type='reply'][isNewReply='false']").hide();
				    	$(this).attr('type', "reply");
				    	$(this).text("See all previous replies"); 
				    }else{
						$.ajax({
						url : "/replies",
						type: "POST",
						data : {
					 			  postID: $(this).attr("postID")			 				  
								},
						success: function( data, ajaxStatus, jqXHR){
						          var messageTAG = "";
								  messageTAG = messageTAG + "<p  postID='" + data.postID + "' type='reply' ><a postID='" + data.postID + "' type='hide' >Only show latest two replies</a></p>";			
						    	  renderReplies(data, messageTAG); 
						    	},
						error: function (jqXHR, textStatus, errorThrown){
						    }
						});			    
				    }			    
			    }
			    if($(this).is('button')){
			    	//console.log('button[btnReply] click')
			 		$.ajax({
				    url : "/reply",
				    type: "POST",
				    data : {				 			
			 				  postID: $(this).attr("postID"),
			 				  message: $( "input[postID=" + $(this).attr('postID') + "]").val()			 				  
							},
				    success: function( data, ajaxStatus, jqXHR){ 
				    			var messageTAG = "";
								if(data.replyLength > 2){
								  messageTAG = messageTAG + "<p  postID='" + data.postID + "' type='reply' ><a postID='" + data.postID + "' type='reply' >See all previous replies</a></p>";			
							    }
				    			renderReplies(data, messageTAG);
				    			 $("input[postid='" + data.postID + "'][type='text']").val('');
				    			 $( ".alert" ).text( data.alertInfo  );
				    		  },
				    error: function (jqXHR, textStatus, errorThrown)
				    {
				    }
				  });
			 	}			  	
			  });

             $("#postNewThings").click(function(){
				$.ajax({
					    url : "/post",
					    type: "POST",
					    data : {				 			
				 				post: $("#newPostText").val()		 				  
							},
					    success: function( data, ajaxStatus, jqXHR){ 
								//console.log(data);
								   $( "#postDivContent" ).replaceWith( $(data).find("div[id='postDivContent']") );
								   $("#newPostText").val('');
								   $( ".alert" ).replaceWith( $(data).find(".alert")  );
								   
							},
					    error: function (jqXHR, textStatus, errorThrown)
					    {
					    }
					});
			 		
			  });

});



		

 var socket = io.connect('http://localhost');
  socket.on('new_reply', function (data) {	
    //console.log(data);
    var socketMsg = JSON.parse(data);
    
    $("div[id='socketRlyMsg']").text(
    	socketMsg.replier + ' replied: ' + socketMsg.newReply 
    	+ " on '" + socketMsg.post + "' by " + socketMsg.poster + ' ' + socketMsg.dateString);
    $('button[postSocket]').fadeIn(3000);
    setTimeout(function(){ $('button[postSocket]').fadeOut(3000) }, 1);
    socket.emit('client_received', { my: 'data' });
    data = '';
  });