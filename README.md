Hyperstore Comment Module

Depends on the following scripts to function:

    <script src="http://fb.me/react-0.10.0.js"></script>
    <script src="http://fb.me/JSXTransformer-0.10.0.js"></script>
    <script src="http://code.jquery.com/jquery-latest.min.js"></script>
	<script src="http://momentjs.com/downloads/moment-with-langs.min.js"></script>
    <script src="js/bootstrap.js"></script>
    <script src="js/readmore.min.js"></script>

Once you have that, include the commentbox on your page by targetting an element by its `id` with something like this:

	<body>
		<div id="content"></div>
	</body>
	<script type="text/jsx" src="js/commentBoxModule.js"></script>
	<script type="text/jsx">
		var myComments = new HyperstoreCommentModule("content","http://yourAppName.backwi.re/comments","sampleContentIdentifier");
	</script>

The HyperstoreCommentModule has three parameters:
- The `id` of the html element to display in.
- The `url` of the Backwire collection that will store the comments.
- The `contentID` that determines which comments in the Backwire collection will show up, and to tag new comments with. This associates comments with comment box instances on your site.

The comments are stored in the collection you specify in the url parameter of your Backwi.re application. It fetches the 'provile.avatarLink', 'emails', and 'username' fields of each comment author from the 'users' collection.

Utilizes Jed Foster's lovely ['readmore.js'](http://jedfoster.com/Readmore.js/)