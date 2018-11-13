<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>

<c:choose>
    <c:when test="${not empty contextPage.series.title}">
		<header class="jumbotron tool-header">
			<div class="container">
				<ul class="list-inline list-header">
					<li>${contextPage.series.title}</li>
				</ul>
				<ul class="list-inline list-definition">
					<li><span class="label">SHO</span>${contextPage.series.id}</li>
					<c:if test="${not empty contextPage.series.tmsId}"><li><span class="label">TMS</span> ${contextPage.series.tmsId}</li></c:if>
					<c:if test="${not empty contextPage.series.eidrId}"><li><span class="label">EIDR</span> ${contextPage.series.eidrId}</li></c:if>		
				</ul>
			</div>
		</header>
	</c:when>  
	<c:otherwise>
		<header class="jumbotron tool-header">
			<div class="container">
				<h1>${contextPage.contextName}</h1>
			</div>
		</header>
    </c:otherwise>
</c:choose>