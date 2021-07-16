function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");
  // console.log(selector);
  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;
    // console.log(sampleNames);
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

// 1. Create the buildCharts function.
function buildCharts(sample) {
  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {
    // 3. Create a variable that holds the samples array. 
    var samples = data.samples
    // console.log(samples);
    // 4. Create a variable that filters the samples for the object with the desired sample number.
    var selectedSample = samples.filter(ident => ident.id == sample);
    // console.log(selectedSample);
    // Gauge: 1. Create a variable that filters the metadata array for the object with the desired sample number.
    var metaData = data.metadata;
    // console.log(metaData);
    var selectedMetaD = metaData.filter(ident => ident.id == sample);
    // console.log(selectedMetaD);
    //  5. Create a variable that holds the first sample in the array.
    var firstSample = selectedSample[0];
    // console.log(firstSample);
    // Gauge: 2. Create a variable that holds the first sample in the metadata array.
    var firstMetaD = selectedMetaD[0];
    // console.log(firstMetaD);
    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.

    var otuIds = firstSample.otu_ids
    var otuLabels = firstSample.otu_labels
    var sampleValues = firstSample.sample_values
    // console.log(sampleValues);
    // Gauge: 3. Create a variable that holds the washing frequency.
    var washFreq = firstMetaD.wfreq
    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 

    var xticks = sampleValues.slice(0,10).reverse();
    var yticks = otuIds.slice(0,10).reverse().map(elem => ('OTU ' + elem));
    var labels = otuLabels.slice(0,10).reverse();
    // console.log(xticks);
    // console.log(yticks);
    // 8. Create the trace for the bar chart. 
    var barData = [{
      x: xticks,
      y: yticks,
      text: labels,
      type: "bar",
      orientation: 'h'
    }
      
    ];
    // 9. Create the layout for the bar chart. 
    var barLayout = {
      title: "Top 10 Bacteria Cultures Found"
    };
    // 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot('bar', barData, barLayout);
    
    // Bubble: 1. Create the trace for the bubble chart.
    
    // The otu_ids as the x-axis values.
    // The sample_values as the y-axis values.
    // The sample_values as the marker size.
    // The otu_ids as the marker colors.
    // The otu_labels as the hover-text values.

    var bubbleData = [{
      x: otuIds,
      y: sampleValues,
      text: otuLabels,
      mode: 'markers',
      marker: {
        color: otuIds,
        size: sampleValues,
        colorscale: 'Earth'
      }
    }
   
    ];

    // Bubble: 2. Create the layout for the bubble chart.
    var bubbleLayout = {
      title: 'Bacteria Cultures by Sample',
      showlegend: false,
      xaxis: {title: "OTU ID"}
    };

    // Bubble: 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot('bubble', bubbleData, bubbleLayout);
    //  Gauge: 4. Create the trace for the gauge chart.
    console.log(washFreq);
    // Assign the variable created in Step 3 to the value property.
    // The type property should be "indicator".
    // The mode property should be "gauge+number".
    // For the title object, assign the title as a string using HTML syntax to the text property.
    // For maximum range for the gauge should be 10.
    // Set the bar color of the gauge to black or a dark color to contrast against the range colors.
    // Assign different colors as string values in increments of 2 for the steps object.  
    var gaugeData = [{
      value: washFreq,
      title: { text: "<b>Belly Button Washing Frequency</b><br>Scrubs Per Week" },
      type: "indicator",
      mode: "gauge+number",
      // delta: { reference: 380 },
      gauge: {
        axis: { range: [null, 10] },
        bar: { color: "darkblue" },
        steps: [
          { range: [0, 2], color: "red" },
          { range: [2, 4], color: "orange" },
          { range: [4, 6], color: "yellow" },
          { range: [6, 8], color: "yellowgreen" },
          { range: [8, 10], color: "green" }
        ],
        // threshold: {
        //   line: { color: "indigo", width: 4 },
        //   thickness: 0.75,
        // //   value: 490
        // }
      }
    }
     
    ];
    
    // Gauge: 5. Create the layout for the gauge chart.
    var gaugeLayout = { 
      width: 500, height: 450, margin: { t: 0, b: 0 },
      
    };

    // Gauge: 6. Use Plotly to plot the gauge data and layout.
    Plotly.newPlot('gauge', gaugeData, gaugeLayout);
  });
}
