<%@ page isELIgnored ="false" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions"%>

<c:if test="${contextPage.currentContentBlock != null}">
  <c:set var="content_block_id" value="${contextPage.currentContentBlock.id}" scope="page" />
  <c:set var="content_block_name" value="${contextPage.currentContentBlock.name}" scope="page" />
  <c:set var="context_id" value="${contextPage.currentContentBlock.contextId}" scope="page" />
  <c:set var="content_block_key" value="${contextPage.currentContentBlock.contentBlockKey}" scope="page" />
</c:if>
<c:if test="${query != null}">
  <c:set var="search_query" value="${query}" scope="page" />
</c:if>
<div 
  data-page="paige-content-manager" 
  data-content-block-id="${content_block_id}"
  data-content-block-name="${content_block_name}"
  data-content-block-key="${content_block_key}"
  data-context-id="${context_id}"
  data-search-query="${search_query}"
>