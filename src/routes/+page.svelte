<script>
  // IMPORTS
  import Dropzone from "svelte-file-dropzone";
  import Convert from "$lib/helper.js";
  let xmlString = "";
  /**
   * Handle file input
   * @param e
   */
  function handleFilesSelect(e) {
    /**
     * Selected file
     */
    const file = e.detail.acceptedFiles[0];
    var reader = new FileReader();
    reader.onload = function () {
      const xmlStr = reader.result;
      /**
       * Create Convert class based on parsed xml string
       */
      const convert = new Convert(xmlStr);
      xmlString = convert.file();
      /**
       * Creates a blob with the converted string
       */
      const bb = new Blob([xmlString], { type: ".xml" });
      download(window.URL.createObjectURL(bb));
    };
    /**
     * This reads the accepted file
    */
    reader.readAsText(file);
  };
  /**
   * This function prompts a download based on the formulated blob
   * @param url
   */
  function download(url) {
    const a = document.createElement("a");
    a.href = url;
    a.download = "file.xml";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }
</script>

<Dropzone on:drop={handleFilesSelect} multiple={false} />
