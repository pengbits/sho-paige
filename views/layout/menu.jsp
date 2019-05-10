<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>

<div class="navbar-tool-wrapper">
	<div class="navbar navbar-default navbar-tool affix-top" role="navigation">
		<div class="container">
			<div class="navbar-header">
				<button type="button" class="navbar-toggle" data-toggle="collapse" data-target="#navbar-collapse">
					<span class="sr-only">Toggle navigation</span> 
					<span class="icon-bar"></span> <span class="icon-bar"></span> 
					<span class="icon-bar"></span>
				</button>
				<c:url value="${paigeHomeNav.link}" var="homeUrl" />
				<a class="navbar-brand" href="<c:out value='${homeUrl}' />">${paigeHomeNav.title}</a>
			</div>

			<div class="collapse navbar-collapse" id="navbar-collapse">
				<c:if test="${ not nav_hide_search}">
					<div class="nav navbar-nav navbar-right navbar-search">
						<c:url value="${paigeSearchNav.link}" var="searchUrl" />
						<form class="navbar-form" role="search" method="get" action="<c:out value='${searchUrl}' />">
							<div class="input-group">
								<input type="text" class="form-control" placeholder="Search" name="q" id="q" required>
								<div class="input-group-btn">
									<button class="btn btn-default" type="submit">
										<i class="glyphicon glyphicon-search"></i>
									</button>
								</div>
							</div>
						</form>
					</div>
				</c:if>
				
				<ul class="nav navbar-nav navbar-right">
					<c:forEach items="${paigeNavigation}" var="navItem">
						<li><c:url value="${navItem.link}" var="navUrl" /> <a
							href="<c:out value='${navUrl}' />"
							title="<c:out value='${navItem.title}' />"> <c:out value='${navItem.label}' />
						</a></li>
					</c:forEach>
				</ul>
			</div>
		</div>
	</div>
</div>