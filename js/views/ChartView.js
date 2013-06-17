"use strict";

function ChartView() { // which is the homepage

  this.previousIOSData = null;
  this.previousAndroidData = null;

  this.showGraphDownMessage = function() {
    $("#chartdiv").html("<br/><em>Sorry, the chartserver was switched off :(<br/>We're firing the one responsible!</em>");
    // auto-refresh the chart
    setTimeout(function() {
      chartView.refreshChartData();
    }, 60000)
  };

  this.initChart = function() {
    $("#graphContainer")
        .html('<div id="charttitle">Recent global build durations (minutes)</div>' +
            '<div id="chartdiv" style="height:130px;width:100%"></div>')
        .show();
    this.refreshChartData();
  };

  this.refreshChartData = function() {
    $.ajax({
      async: true,
      url: 'http://www.thumbrater.com:9100',
//      url: 'http://localhost:9100',
      dataType:"json",
      error: chartView.showGraphDownMessage,
      success: function(data) {
        // if android has no data, don't show the graph (iOS is optional anyway)
        if (data.android.length == 0) {
          chartView.showGraphDownMessage();
        } else {
          // piggybacking this property here
          settingsController.enableIOSInstallButton(data.ios != undefined);
          // prevent rendering when there are no changes
          if (JSON.stringify(data.ios) != JSON.stringify(chartView.previousIOSData) ||
              JSON.stringify(data.android) != JSON.stringify(chartView.previousAndroidData)) {
            chartView.previousIOSData = data.ios;
            chartView.previousAndroidData = data.android;
            // clear the area (prevents ghosting)
            $("#chartdiv").html("");
            // plot the new data
            var plot2 = $.jqplot('chartdiv', [data.ios == undefined ? data.android : data.ios, data.android], {
                title: {
                  show: false
                },
                axes:{
                  xaxis:{
                    renderer:$.jqplot.DateAxisRenderer,
                    showGridline: false,
                    tickOptions: {
                      formatString:'%H:%M' // see http://www.jqplot.com/docs/files/plugins/jqplot-dateAxisRenderer-js.html
                    },
                    numberTicks: 4,
                    rendererOptions: {
                      tickInset: 0
                    }
                  },
                  yaxis: {
                    min: 0
                  }
                },
                grid: {
                  backgroundColor: '#FFF',
                  borderWidth: 0,
                  gridLineWidth: 1,
                  gridLineColor: '#ddd',
                  drawGridlines: true,
                  shadow: false
                },
                seriesDefaults: {
                  lineWidth: 2,
                  markerOptions: {
                    size: (data.android.length == 1 ? 10 : 0) // if there's only one datapoint, you have an empty chart with size 0 ;)
                  },
                  rendererOptions: {
                    smooth: true
                  }
                },
                series: [
                  {
                    color: '#0088cc'
                  },
                  {
                    color: '#c67605'
                  }
                ],
                legend: {
                  show: data.ios != undefined,
                  border: '0',
                  renderer: $.jqplot.EnhancedLegendRenderer,
                  placement: "insideGrid",
                  labels: ["ios", "android"],
                  location: "nw",
                  rowSpacing: "0px",
                  xoffset: 2,
                  yoffset: 1,
                  rendererOptions: {
                    // set to true to replot when toggling series on/off
                    // set to an options object to pass in replot options.
                    seriesToggle: 'normal',
                    seriesToggleReplot: {resetAxes: true}
                  }
                }
            });
          }
        }
        // auto-refresh the chart
        setTimeout(function() {
          chartView.refreshChartData();
        }, 30000)
      }
    });
    googleAnalytics("appsview-loadchart");
  };
}