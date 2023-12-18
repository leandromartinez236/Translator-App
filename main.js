const selectTag = document.querySelectorAll("select"),
  translateBtn = document.querySelector("button"),
  fromText = document.querySelector(".from-text"),
  toText = document.querySelector(".to-text"),
  exchangeIcon = document.querySelector(".exchange"),
  icons = document.querySelectorAll('.row i'),
  copiedMsg = document.querySelector(".copied-translation")



selectTag.forEach((tag, id) => {
  for (const country_code in countries) {
    // Selecting English by default as FROM language and Hindi as TO language
    let selected = ""
    if (id == 0 && country_code == "en-GB") {
      selected = "selected"
    } else if (id == 1 && country_code == "hi-IN") {
      selected = "selected"
    }

    let option = `<option value="${country_code}" ${selected}>${countries[country_code]}</option>`
    tag.insertAdjacentHTML("beforeend", option) // Adding options tag inside select tag
  }
})

exchangeIcon.addEventListener("click", () => {
  // exchanging textarea and select tag values
  let tempText = fromText.value,
    tempLang = selectTag[0].value
  fromText.value = toText.value
  selectTag[0].value = selectTag[1].value
  toText.value = tempText
  selectTag[1].value = tempLang
})


translateBtn.addEventListener("click", () => {
  let text = fromText.value
  translateFrom = selectTag[0].value // getting fromSelect tag value
  translateTo = selectTag[1].value // getting toSelect tag value
  if (!text) return
  toText.setAttribute("placeholder", "Translating...")

  let apiUrl = `https://api.mymemory.translated.net/get?q=${text}&langpair=${translateFrom}|${translateTo}`
  fetch(apiUrl)
    .then(res => res.json())
    .then(data => {
      const { responseData: { translatedText } } = data
      toText.value = translatedText
      toText.setAttribute("placeholder", "Translation")
    })
    .catch(err => console.log(err))
})

icons.forEach(icon => {
  icon.addEventListener("click", ({ target }) => {
    if (target.classList.contains("fa-copy")) {
      if (target.id == "from") {
        navigator.clipboard.writeText(fromText.value)
      } else {
        navigator.clipboard.writeText(toText.value)
      }
    } else {
      let utterance
      if (target.id == "from") {
        utterance = new SpeechSynthesisUtterance(fromText.value)
        utterance.lang = selectTag[0].value
      } else {
        utterance = new SpeechSynthesisUtterance(toText.value)
        utterance.lang = selectTag[1].value
      }
      speechSynthesis.speak(utterance)
    }
  })
})