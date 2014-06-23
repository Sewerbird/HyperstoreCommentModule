/**
* @jsx React.DOM
*/

function HyperstoreCommentModule(domTargetID, hyperstoreURL, content_id, options){
	var module = this;
	options = options?options:{hideCommentsWhenEmptyAndSignedOut: true};
	this.store = new Backwire.Hyperstore(hyperstoreURL);
	this.defaultAvatar = options.defaultUserAvatar?options.defaultUserAvatar:"http://www.gravatar.com/avatar/00000000000000000000000000000000?d=mm";
	this.stringToColour = function(str) { 
		//User override
		if(options.userColor) return options.userColor;
	    // str to hash
	    for (var i = 0, hash = 0; i < str.length; hash = str.charCodeAt(i++) + ((hash << 5) - hash));

	    // int/hash to hex
	    for (var i = 0, colour = "#"; i < 3; colour += ("00" + ((hash >> i++ * 8) & 0xE0).toString(16)).slice(-2));

	    return colour;
	}
	var CommentBox = React.createClass({displayName: 'CommentBox',
		getInitialState: function(){
			var self = this;	
			module.store.getUser(function(user){
				self.forceUpdate();
			})
			module.store.find({content_id: content_id},{sort:{createdAt:-1}},function(res,err,ver){
				if(res && !err)
				{
					self.setState({data:res})
					$('.expandcomment').readmore();
				}
				else if(err)
					console.error("Error with comment box reactive find: "+err);
				else
					console.warn("No results form commentbox reactive find");
			})
			return {data: []};
		},
		handleCommentSubmit: function(comment){
			module.store.insert(comment, function(res,err,ver){
				if(err)
					console.error("Error submitting comment: "+err);
			});
		},
		render: function(){
			var heading = React.DOM.div( {className:"panel-heading"}, 
						React.DOM.h3(null, "Comments")
					);
			if(options.hideCommentsHeader) heading = React.DOM.div();
			var hide = {}
			if(options.hideCommentsWhenEmptyAndSignedOut && !module.store.user) hide = {display:"none"}
			return (
				React.DOM.div( {className:"commentBox panel panel-default", style:hide}, 
					heading
					,
					React.DOM.div( {className:"panel-body"}, 
						CommentList( {data:this.state.data}),
						module.store.user?CommentForm( {onCommentSubmit:this.handleCommentSubmit}):""
					)
				)
			);
		}
	});

	var CommentList = React.createClass({displayName: 'CommentList',
		render: function(){
			var commentNodes = _.sortBy(this.props.data, function(v,k){return -k}).map(function (comment){
				return Comment( {color:module.stringToColour(comment.author), author:comment.author, date:moment(comment.createdAt).format("ll")}, comment.text)
			});
			if(_.size(commentNodes) == 0) return React.DOM.span();
			return (
				React.DOM.ul( {className:"commentList list-group", 'overflow-y':"auto", height:300}, 
					commentNodes
				)
			);
		}
	});

	var CommentForm = React.createClass({displayName: 'CommentForm',
		handleSubmit: function(e){
			e.preventDefault();
			if(module.store.user)
			{
				var avatar = module.defaultAvatar;
				var profile = null;
				if(module.store.user.profile) 
					{
						avatar = module.store.user.profile.avatarLink?module.store.user.profile.avatarLink:module.defaultAvatar;
						profile = module.store.user.profile.profileLink?module.store.user.profile.profileLink:null;
					}
				var author = {_id:module.store.user._id,username:module.store.user.username,avatar:avatar,profile:profile};
				var text = this.refs.text.getDOMNode().value.trim();
				this.refs.text.getDOMNode().value = '';
				if(text)
					this.props.onCommentSubmit({author: author, text:text, content_id: content_id});
			}
			return false;
		},
		render: function(){
			return (
				React.DOM.form( {className:"commentForm input-group", onSubmit:this.handleSubmit},
					React.DOM.input( {className:"form-control", type:"text", ref:"text", placeholder:"Your comment"} ),
					React.DOM.span(  {className:"input-group-addon"},
						React.DOM.input( {classname:"btn btn-default", type:"submit", value:"Post"}))
				)
			);
		}
	});

	var Comment = React.createClass({displayName: 'Comment',

		render: function(){
				return(
					React.DOM.li( {className:"comment list-group-item"}, 
						React.DOM.span({},
							React.DOM.img({width:"32px",src:this.props.author.avatar,className:"img-circle",alt:"rounded avatar"}),
							" ",
							React.DOM.div({style:{display:"inline-block"}},
								//Decide whether to link to a profile
								(this.props.author.profile?
									React.DOM.a({href:this.props.author.profile,style:{color:this.props.color}},this.props.author.username):
									React.DOM.span({style:{color:this.props.color}},this.props.author.username)),
								" - ",
								React.DOM.span({style:{color:"#AAA"}},this.props.date)
							)
						),
						" : ", 
						React.DOM.p({className:"expandcomment"},this.props.children)	
					)
				);
		}
	});
	if(document.getElementById(domTargetID) !== null)
	{
		React.renderComponent(
			CommentBox(null ),
			document.getElementById(domTargetID)
		);	
	}
	else
	{
		console.error("Document doesn't have an element with id = "+domTargetID+". Here's the 'document':");
		console.info(document)
	}
}