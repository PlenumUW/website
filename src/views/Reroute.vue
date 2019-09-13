<template>
  <div></div>
</template>
<script>
import Cookies from "js-cookie";

export default {
  name: "reroute",
  data: function() {
    return {
      doc: undefined
    };
  },
  watch: {
    doc: function(newVal) {
      this.rerouteToPreview();
    }
  },
  methods: {
    rerouteToPreview() {
      const { type, uid } = this.doc;
      switch (type) {
        case "page":
          this.$router.replace("/" + uid);
          break;
        default:
          throw new Error("Document type not accounted for...");
      }
    }
  },
  created: async function() {
    const previewRef = Cookies.get(this.$api.api.previewCookie);
    const masterRef = this.$api.api.refs.find(ref => {
      return ref.isMasterRef === true;
    });
    const ref = previewRef || masterRef.ref;

    this.doc = await this.$api.getDocumentById(this.$route.query.documentId, {
      ref
    });
  }
};
</script>
