<%@ page isELIgnored ="false" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions"%>

<%-- let"s go ahead and define the dropdowns for ctaLink - this would need different jsps for diff contexts --%>
<script type="text/javascript">
window.paige = window.paige || {}
window.paige.configs = window.paige.configs || {}
window.paige.configs.CTA_TYPE_DROPDOWNS = [
  "about video",
  "bts video",
  "ep guide link",
  "EST link",
  "free full episode video",
  "merch link",
  "next on video",
  "order link",
  "other external link",
  "other internal link",
  "other video",
  "photo gallery link",
  "preview scene video",
  "series promo video",
  "series site link",
  "sports event page link",
  "sports video",
  "stream link",
  "title page link",
  "trailer video"
]; 

// store fotm defaults for the content-block under the content-block"s name in lowercase
window.paige.configs.FORM_DEFAULTS = {
  CONTENT_BLOCKS: {
    "recaps" : {
      "ctaLabel": {
        "input": "title", 
        "template": "READ MORE AT {title}"
      },
      "ctaType": {
        "value": "other external link"
      }
    }
  }
}
</script>
