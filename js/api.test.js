const API_URL = `${window.location.href}/`;
const API_LIST = [
  {path: "puzzle?difficulty=[0]&type=[1]", method: "GET"},
  {path: "solve", method: "POST"},
  {path: "validate", method: "POST"},
  {path: "grade", method: "POST"}
];

String.prototype.format = function(...args) {
  return this.replace(/\[(\d+)\]/g, (m, n) => typeof args[n] != 'undefined' ? args[n] : m);
}

$(document).ready(() => {
  let api = 0;
  let board = [];
  let difficulty = "random";
  let type = "rows";

  let url = "";
  let method = "";

  function update() {
    api = $("#api-select").val();
    difficulty = $("#difficulty-select").val();
    type = $("#type-select").val();
    updateURL();
  }

  function updateBoard(b) {
    board = b;
    $("#board").val(JSON.stringify(b));
  }

  function updateURL() {
    url = (API_URL + API_LIST[api].path).format(difficulty, type);
    method = API_LIST[api].method;
    $("#url").val(url);
  }

  function updateOutput(res) {
    let block = $("#api-out").find("pre").find("code")[0];
    $(block).html(JSON.stringify(res, null, 2));
    if (method == "GET") {
      updateBoard(res.board);
    }
    hljs.highlightBlock(block);

    $(".api-disable").prop("disabled", false);
  }

  $("#api-select").change(update);
  $("#difficulty-select").change(update);
  $("#type-select").change(update);

  $("#api-form").submit(function(e) {
    e.preventDefault();
    $(".api-disable").prop("disabled", true);
    let data = {
      method: method
    };
    if (data.method == "POST") {
      data.body = JSON.stringify({
        type: type,
        board: board
      });
      data.headers = {"Content-Type": "application/json"};
    }
    fetch(url, data).then(res => res.json()).then(updateOutput);
  });

  update();
});
