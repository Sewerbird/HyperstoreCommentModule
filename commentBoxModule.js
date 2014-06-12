/**
* @jsx React.DOM
*/

function HyperstoreCommentModule(domTargetID, hyperstoreURL, contentID){
	var module = this;
	this.store = new Backwire.Hyperstore(hyperstoreURL);
	this.defaultAvatar = "http://www.gravatar.com/avatar/00000000000000000000000000000000?d=mm";
	this.stringToColour = function(str) {
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
			//TODO: make this find listen only to certain subset of comments
			module.store.find({contentID: contentID},{sort:{createdAt:-1}},function(res,err,ver){
				if(res && !err)
				{
					self.setState({data:res})
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
			return (
				React.DOM.div( {className:"commentBox panel panel-default"}, 
					React.DOM.div( {className:"panel-heading"}, 
						React.DOM.h3(null, "Comments")
					),
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
			var commentNodes = this.props.data.map(function (comment){
				return Comment( {color:module.stringToColour(comment.author), author:comment.author, avatar:comment.avatar?comment.avatar:module.defaultAvatar}, comment.text)
			});
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
			var author = 'public'
			var avatar = module.defaultAvatar;
			if(module.store.user)
			{
				author = module.store.user.username?module.store.user.username:module.store.user.emails[0];
				if(module.store.user.profile)
					avatar = module.store.user.profile.avatarLink?module.store.user.profile.avatarLink:module.defaultAvatar;
			}
			console.info("XXXXX",avatar);
			var text = this.refs.text.getDOMNode().value.trim();
			this.refs.text.getDOMNode().value = '';
			if(text && author)
			{
				this.props.onCommentSubmit({author: author, text:text, avatar:avatar, contentID: contentID});
				this.refs.text.getDOMNode().value = '';
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
						React.DOM.span({style:{color:this.props.color}},
							React.DOM.img({width:"32px",src:this.props.avatar,className:"img-circle",alt:"rounded avatar"}),
							" ",
							this.props.author),
						": ", 
						this.props.children
					)
				);
		}
	});

	React.renderComponent(
		CommentBox(null ),
		document.getElementById(domTargetID)
	);	
}