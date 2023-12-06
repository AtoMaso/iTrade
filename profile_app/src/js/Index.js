
// Syntax: addEventListener(event, function, useCaption);
// Syntax: removeEventListener(event, function, useCaption)

// someElement.addEventListener(
//   "click",
//   clickArticle,
//   passiveSupported ? { passive: false } : false,
// );
// Syntax:
// someElelment.addEventListener("click", (event) => {
//   console.log(event.target);
// });


const clickArticle = (event) => {
  event.stopPropagation();
  console.log(typeof(event.target) + " " + event.target.id);
  alert(typeof(event.target) + " " + event.target.id);
}


function get_data() {
  fetch("src/data/stuff.json")
      .then((res) => {
      return res.json();
  })
  .then((data) => create_all_profiles(data))
  .then((data) => console.log(data));
}


function create_all_profiles(data) 
{
  let count = 1;
  let workers = data.stuff;
  for(i=0; i < workers.length; i++)
  {
    // get the section elelment
      const sectionElement = document.getElementById("sectionOne");

      // create artical elelment and set all attributes
      const articalElement = document.createElement("article");
      articalElement.id = workers[i].id;
      articalElement.classList="card";
      articalElement.addEventListener("click", clickArticle, false);

      // create figure element
      const figureElement = document.createElement("figure");
      figureElement.id = workers[i].id;

      // create image element and add all attributes
      const imageElement = document.createElement("img");
      imageElement.src= workers[i].image_name;
      imageElement.alt= workers[i].first_name + " "+ workers[i].last_name;
      imageElement.width = "500";
      imageElement.height= "500";
      imageElement.id = workers[i].id;
      imageElement.addEventListener("click", clickArticle, false);
      // append the image element to the figure element parent
      figureElement.appendChild(imageElement);

      // create figure caption element
      const figureCaptionElement = document.createElement("figcaption");
      figureCaptionElement.id = workers[i].id;
      figureCaptionElement.addEventListener("click", clickArticle, false);

      // create span element and all attributes
      const spanElement = document.createElement("span");
      spanElement.classList = "nowrap";
      spanElement.id= workers[i].id;
      spanElement.addEventListener("click", clickArticle, false);
      
      // create span text element 
      const spanTextElement = document.createTextNode(workers[i].first_name + " " + workers[i].last_name);
      spanTextElement.id = workers[i].id;
      spanTextElement.addEventListener("click", clickArticle, false);

      // append the span text element to the span element parent
      spanElement.appendChild(spanTextElement);
      // append the span elelment to the figure caption element parent
      figureCaptionElement.appendChild(spanElement);
      // append the figure caption element to figure element
      figureElement.appendChild(figureCaptionElement);
      // append the figure element to article element
      articalElement.appendChild(figureElement);

      // create p element
      const pElement = document.createElement("p");
      pElement.id = workers[i].id;
      pElement.addEventListener("click", clickArticle, false);
     
      // create q element
      const qElement = document.createElement("q");
      qElement.id = workers[i].id;
      qElement.addEventListener("click", clickArticle, false);

      // create span text element
      const qTextElement = document.createTextNode(workers[i].what_does);
      qTextElement.id = workers[i].id;
      qTextElement.addEventListener("click", clickArticle, false);
      
      //append the span elelment to the q element parent
      qElement.appendChild(qTextElement);
      // append the q element to the p parent
      pElement.appendChild(qElement);
      // append the pElement to the artical element parent
      articalElement.appendChild(pElement);

      // add the article element to section element parent
      sectionElement.append(articalElement);

      count +=1;  
  }
}

get_data();