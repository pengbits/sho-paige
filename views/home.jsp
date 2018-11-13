<%@ taglib uri='http://java.sun.com/jsp/jstl/core' prefix='c'%>

<div class="container"><!-- centered-hero" -->
	<div class="row">
		<div class="col-sm-6 col-sm-offset-3">
			<div class="row search-jumbo">
				<div class="col-sm-9">
					<form role="search" method="${search.method}" action="${search.url}">
						<input type="text" class="form-control input-lg" placeholder="What can I help you find?" name="q" id="q" autofocus="autofocus" required>
					</form>
				</div>
				<div class="col-sm-3">
					<img class="img-responsive" src="/shomin/library/images/svg/paige.svg" alt="Paige" width="100%" height="100%" />
				</div>
			</div>
		</div>
	</div>
</div>
