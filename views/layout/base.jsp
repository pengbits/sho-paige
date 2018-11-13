<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="tiles" uri="http://tiles.apache.org/tags-tiles"%>

<c:set var="nav_hide_search" value="true" scope="request" />
<jsp:include page="/tools/paige/layout/menu.jsp" />

<tiles:insertAttribute name="tool-body" />
