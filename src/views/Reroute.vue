<template>
  <div></div>
</template>
<script>
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
      console.log(type, uid, this.doc);
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
    this.doc = await this.$api.getDocumentById(this.$route.query.documentId);
  }
};
</script>
