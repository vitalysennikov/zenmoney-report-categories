// Собирает dev/demo.html из ../index.html: подменяет fetch на фиктивные данные
// (dev/fixture.js) и автоматически "нажимает" загрузку — реальный токен/API не нужны.
// Используется только для генерации скриншотов в screenshots/, в сам index.html не попадает.
"use strict";

const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");
const src = fs.readFileSync(path.join(root, "index.html"), "utf8");
const fixture = require("./fixture.js");

const injected = `
<script>
(function () {
  var FIXTURE = ${JSON.stringify(fixture)};
  var realFetch = window.fetch.bind(window);
  window.fetch = function (url, opts) {
    if (typeof url === "string" && url.indexOf("zenmoney.ru") !== -1) {
      return Promise.resolve({
        ok: true, status: 200,
        json: function () { return Promise.resolve(FIXTURE); },
        text: function () { return Promise.resolve(""); }
      });
    }
    return realFetch(url, opts);
  };

  function ready(fn) {
    if (document.readyState !== "loading") fn();
    else document.addEventListener("DOMContentLoaded", fn);
  }

  ready(function () {
    document.getElementById("token").value = "demo";
    document.getElementById("loadBtn").click();

    var act = new URLSearchParams(location.search).get("act") || "1";
    setTimeout(function () {
      if (act === "1") {
        // ничего не разворачиваем — вид сразу после загрузки
      } else if (act === "2") {
        document.getElementById("toggleCategoriesBtn").click();
        document.getElementById("toggleTxBtn").click();
        var firstTx = document.querySelector("details.tx-item");
        if (firstTx) firstTx.open = true;
      } else if (act === "3") {
        document.querySelectorAll("details.tree-node > summary").forEach(function (s) {
          var t = s.textContent;
          if (t.indexOf("Возвраты") !== -1 || t.indexOf("Переводы вне выборки") !== -1) {
            s.parentElement.open = true;
          }
        });
      }
      document.title = "READY";
    }, 250);
  });
})();
</script>
</body>`;

const out = src.replace("</body>", injected);
fs.writeFileSync(path.join(__dirname, "demo.html"), out, "utf8");
console.log("dev/demo.html собран");
