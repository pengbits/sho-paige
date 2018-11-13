<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="form" uri="http://www.springframework.org/tags/form"%>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>

<c:set var="page" value="home" scope="request" />
<jsp:include page="../layout/header.jsp"/>

<div class="container container-tool">
    <div class="row">
        <div class="col-md-12">
            <h4>This series does not have a series site configuration. Click here to create one.</h4>
            <form:form action="${create.url}" method="POST">
                <button type="submit" class="btn btn-primary">Create</button>
            </form:form>
        </div>
    </div>
</div>