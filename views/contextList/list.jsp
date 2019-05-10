<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>

<header class="jumbotron tool-header">
    <div class="container">
        <h1>${contextListPage.title}</h1>
    </div>
</header>

<c:if test="${contextListPage.isSearchEnabled eq true}">
<div class="utility-navigation">
  <div class="container">
    <ul class="list-inline list-inputs pull-left">
      <li>
        <input type="search" id="series-filter" data-component="table-filter" class="form-control input-sm" autofocus placeholder="Filter by series ID or name ..." />
      </li>
    </ul>
    <ul class="list-inline pull-right">
      <li><a class="btn btn-default btn-xs" href="<c:out value='${get.url}'/>"><c:out value="${seriesListTitle}"/></a></li>
    </ul>
  </div>
</div>
</c:if>

<div class="container container-tool">
  <div class="row">
    <div class="col-md-12">
      <table class="table table-striped table-tools">
        <thead>
          <tr>
            <th>ID</th>
            <th>Title</th>
            <th>&nbsp;</th>
          </tr>
        </thead>
        <tbody>
          <c:forEach var="item" items="${contextListPage.contextItemList}">
            <c:if test="${not empty item.title}">
            <c:set var="highlightInactiveSeries" value = "${item.isSeriesEnabled ? '' : 'style = color:#F08080'}" />
              <tr data-filter-name="<c:out value="${item.id}" /><c:out value="${item.title}" />">
                <td ${highlightInactiveSeries}><c:out value="${item.id}" /></td>
                <td ${highlightInactiveSeries}><c:out value="${item.title}" /></td>
                <td class="align-right" ${highlightInactiveSeries}>
                  <c:url var="baseUrl" value="${item.baseUrl}"></c:url>
                  <c:choose>
                    <c:when test="${update.permitted}">
                      <a class="btn btn-success" href="<c:out value='${baseUrl}'/>">
                        <span class="fa fa-pencil"></span>
                      </a>
                    </c:when>
                    <c:otherwise>
                      <a class="btn btn-primary" href="<c:out value='${baseUrl}'/>">
                        <span class="fa fa-eye"></span>
                      </a>
                    </c:otherwise>
                  </c:choose>
                </td>
              </tr>
            </c:if>
          </c:forEach>
        </tbody>
      </table>
    </div>
  </div>
</div>
<c:if test="${contextListPage.isSearchEnabled eq true}">
<div class="utility-footer-navigation">
  <div class="container">
    <ul class="list-inline pull-right">
      <li><a class="btn btn-default btn-xs" href="<c:out value='${get.url}'/>"><c:out value="${seriesListTitle}"/></a></li>
    </ul>
  </div>
</div>
</c:if>
