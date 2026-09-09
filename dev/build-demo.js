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
        // раскрыть блок "Счета", чтобы был виден список чекбоксов и кнопки быстрого выбора
        document.querySelectorAll("details.fieldset-details > summary").forEach(function (s) {
          if (s.textContent.indexOf("Счета") !== -1) s.parentElement.open = true;
        });
      } else if (act === "4") {
        // только выбранные: один проект (#Ремонт)
        document.querySelector('input[name="mode"][value="include"]').click();
        var cbIncl = document.querySelector('#projectChecks input[data-id="proj-remont"]');
        if (cbIncl) cbIncl.click();
      } else if (act === "5") {
        // кроме выбранных: отмечены все существующие проекты — по сути исключены все "#проекты"
        document.querySelector('input[name="mode"][value="exclude"]').click();
        var cbEx1 = document.querySelector('#projectChecks input[data-id="proj-remont"]');
        var cbEx2 = document.querySelector('#projectChecks input[data-id="proj-rabota"]');
        if (cbEx1) cbEx1.click();
        if (cbEx2) cbEx2.click();
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
