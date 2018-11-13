<%@ page isELIgnored ="false" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>

<c:if test="${contextPage.currentContentBlock != null}">
	<c:set var="current_nav_item" value="${contextPage.currentContentBlock.name}" scope="page" />
</c:if>

<div class="utility-navigation">
	<div class="container">
		<div class="row">
			<div class="col-sm-12">
				<ul class="list-inline pull-left">
					<c:forEach var="contentBlockNav" items="${contextPage.contentBlockNavList}">
						<li class="<c:if test="${current_nav_item == contentBlockNav.name}">active</c:if>">
							<c:url value="${contentBlockNav.url}" var="contentUrl" />
							<a href="${contentUrl}">${contentBlockNav.name}</a>
						</li>
					</c:forEach>
				</ul>
				
			</div>
		</div>
	</div>
</div>