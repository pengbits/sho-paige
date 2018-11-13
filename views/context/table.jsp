<%@ page isELIgnored ="false" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>

<div class="container container-tool">
  <div class="row">
      <div class="col-md-12">
          <table class="table table-striped table-tools">
              <thead>
                  <tr>
                      <th>content_block_id</th>
                      <th>content_block_name</th>
                      <th>content_block_key</th>
                  </tr>
              </thead>
              <tbody>
                  <c:forEach items="${contentBlockList}" var="contentBlock">
                      <tr>
                          <td>
                              <c:out value="${contentBlock.id}" />
                          </td>
                          <td>
                              <c:out value="${contentBlock.name}" />
                          </td>
                          <td>
                              <c:out value="${contentBlock.contentBlockKey}" />
                          </td>
                      </tr>
                  </c:forEach>
              </tbody>
          </table>
      </div>
  </div>
</div>