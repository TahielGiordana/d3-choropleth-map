let educationData;
let countyData;

fetch(
  "https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json"
)
  .then((res) => res.json())
  .then((res) => {
    countyData = topojson.feature(res, res.objects.counties).features;
    console.log(countyData);
    educationData = fetch(
      "https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json"
    )
      .then((res) => res.json())
      .then((educationData) => choroplethMap(countyData, educationData));
  });

function choroplethMap(countyData, educationData) {
  //Add the title
  d3.select("body")
    .append("h1")
    .attr("id", "title")
    .text("United States Educational Attainment");

  //Add the subtitle
  d3.select("body")
    .append("h2")
    .attr("id", "description")
    .text(
      "Percentage of adults age 25 and older with a bachelor's degree or higher (2010-2014)"
    );

  let width = 1000;
  let height = 600;
  let padding = 20;
  const colors = [
    "rgb(210, 226, 245)",
    "rgb(157, 186, 223)",
    "rgb(119, 158, 209)",
    "rgb(89, 135, 196)",
    "rgb(55, 107, 175)",
    "rgb(31, 89, 165)",
    "rgb(12, 65, 134)",
  ];

  //Draw the canvas
  const svg = d3
    .select("body")
    .append("svg")
    .attr("class", "choroplethMap")
    .attr("width", width)
    .attr("height", height);

  //Add a tooltip
  const tooltip = d3
    .select("body")
    .append("div")
    .attr("id", "tooltip")
    .style("visibility", "hidden");

  //Add the counties
  svg
    .selectAll("path")
    .data(countyData)
    .enter()
    .append("path")
    .attr("class", "county")
    .attr("d", d3.geoPath())
    .attr("data-fips", (data) => data.id)
    .attr(
      "data-education",
      (data) => educationData.find((d) => d.fips === data.id).bachelorsOrHigher
    )
    .attr("fill", (data, index) => {
      let county = educationData.find((d) => d.fips === data.id);
      if (county.bachelorsOrHigher < 12) {
        return colors[0];
      } else if (county.bachelorsOrHigher < 21) {
        return colors[1];
      } else if (county.bachelorsOrHigher < 30) {
        return colors[2];
      } else if (county.bachelorsOrHigher < 39) {
        return colors[3];
      } else if (county.bachelorsOrHigher < 48) {
        return colors[4];
      } else if (county.bachelorsOrHigher < 57) {
        return colors[5];
      } else {
        return colors[6];
      }
    })
    .on("mouseover", (e) => {
      let id = e.target["__data__"]["id"];
      let county = educationData.find((d) => d.fips === id);
      tooltip.html(
        `<p>${county.area_name + ", " + county.state}: ${
          county.bachelorsOrHigher
        }%</p>`
      );
      tooltip.style("visibility", "visible");
      tooltip.style("top", e.y + "px");
      tooltip.style("left", e.x + "px");
      tooltip.attr("data-education", county.bachelorsOrHigher);
    })
    .on("mouseout", (e) => {
      tooltip.html("");
      tooltip.style("visibility", "hidden");
      tooltip.attr("data-education", "");
    });

  //Add a legend
  const legendScale = d3.scaleLinear();
  legendScale.domain([3, 66]);
  legendScale.range([padding, padding + 40 * colors.length]);

  const legendAxis = d3.axisBottom(legendScale);
  legendAxis.ticks(9);
  legendAxis.tickValues([3, 12, 21, 30, 39, 48, 57, 66]);

  d3.select("body")
    .append("svg")
    .attr("id", "legend")
    .attr("width", padding * 2 + colors.length * 40)
    .attr("height", 60)
    .selectAll("rect")
    .data(colors)
    .enter()
    .append("rect")
    .attr("width", 40)
    .attr("height", 10)
    .attr("x", (color, index) => padding + 40 * index)
    .attr("y", padding)
    .attr("fill", (color, index) => colors[index]);

  d3.select("#legend")
    .append("g")
    .call(legendAxis)
    .attr("transform", "translate(0," + 30 + ")");
}
