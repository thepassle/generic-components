# generic-tabs

[demo](https://modest-bhaskara-e8742f.netlify.app/generic-tabs/demo/index.html) | [spec](https://www.w3.org/TR/wai-aria-practices/#tabpanel)

<style>
  generic-tabs:not(:defined) {
    display: none;
  }
</style>

<script src="../../generic-tabs.js"></script>

<generic-tabs active-item="1" label="people">
  <button slot="tab">
    Jim
  </button>
  <div slot="panel">
    <p>And my name is Jim. Im not opened by default.</p>
  </div>

  <button slot="tab">
    Jack
  </button>
  <div slot="panel">
    <p>I am Jack. I am opened by default.</p>
  </div>
</generic-tabs>