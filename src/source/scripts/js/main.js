document.addEventListener("DOMContentLoaded", () => {
  setTimeout(() => {
    let
      langFrom = document.getElementById("lang-from"),
      langTo = document.getElementById("lang-to"),
      langTextInput = document.getElementById("lang-text-input"),
      langTextResult = document.getElementById("lang-text-result"),
      langTranslateBtn = document.getElementById("lang-translate-btn"),
      stageStart = document.getElementById("stage-start"),
      stageMenu = document.getElementById("stage-menu");

    stageStart.style.display = "none";
    stageMenu.style.display = "block";

    langTranslateBtn.addEventListener("click", () => {
      if (langFrom.value == langTo.value)
        langTextResult.value = langTextInput.value;
      else if (langTextInput.value != "") {
        langTextResult.value = "Подождите...";

        window.api.invoke('text-translate', { langFrom: langFrom.value, langTo: langTo.value, text: langTextInput.value}).then((result) => langTextResult.value = result);
      }
    });
  }, 1500);
});
