//changing background to match picture 
const theBody = document.getElementsByTagName('body')[0];

function backgroundChanger() {
  let activeImg = document.getElementsByClassName('active')[0];
  if (activeImg.title == "Dodge Charger SRT") {
    theBody.className = "charger";
  }
  if (activeImg.title == "Toyota Supra") {
    theBody.className = "supra";
  }
  if (activeImg.title == "Ford Mustang") {
    theBody.className = "mustang";
  }
  if (activeImg.title == "Dodge Challenger R/T") {
    theBody.className = "challenger";
  }
  if (activeImg.title == "Dodge Charger R/T") {
    theBody.className = "dodge";
  }
  if (activeImg.title == "BMW M3") {
    theBody.className = "bmw";
  }
  if (activeImg.title == "Bentley Continental") {
    theBody.className = "bentley";
  } if (activeImg.title == "Mitsubishi Lancer Evo") {
    theBody.className = "";
  }
}