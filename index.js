const educationData = fetch(
  "https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json"
)
  .then((res) => res.json())
  .then((res) => console.log(res));

const countyData = fetch(
  "https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json"
)
  .then((res) => res.json())
  .then((res) => console.log(res));

function choroplethMap() {
  d3.select("body")
    .append("h1")
    .attr("id", "title")
    .text("United States Educational Attainment");

  d3.select("body")
    .append("h2")
    .attr("id", "description")
    .text(
      "Percentage of adults age 25 and older with a bachelor's degree or higher (2010-2014)"
    );

  const root = d3.select("body").append("div").attr("class", "choroplethMap");
}

choroplethMap();
