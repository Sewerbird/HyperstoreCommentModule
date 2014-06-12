Hyperstore Comment Module

Depends on the following scripts to function:

    <script src="http://fb.me/react-0.10.0.js"></script>
    <script src="http://fb.me/JSXTransformer-0.10.0.js"></script>
    <script src="http://code.jquery.com/jquery-latest.min.js"></script>
    <script src="js/bootstrap.js"></script>

Once you have that, include the commentbox on your page with something like this:
	<body>
		...
		<div id="content"></div>
		...
	</body>
	...
	<script type="text/jsx" src="js/commentBoxModule.js"></script>
	<script type="text/jsx">
		var myComments = new HyperstoreCommentModule("content","http://yourAppName.backwi.re/comments");
	</script>