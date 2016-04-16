angular.module("ble101")
.directive("fmTest",["$compile","_", "d3", "$interval", function ($compile,_, d3, $interval) {
 return {
  restrict: "A",
      require: '?ngModel', // get a hold of NgModelController
      //transclude: false,
      //template: "<div style='background-color:red' ng-transclude></div>",
      scope: {
        data: "=fmData",
      },
      
      link: function (scope, element, attrs, ngModel) {
        var pageWidth = 50;
        
        var minValue = 1023  // will be adjusted to actual data
        var maxValue = 0;    // will be adjusted to actual data
        
        
        //draw the graph to show periods: previewelement is where to put it, perioddata is the, uh, data
        // Set the dimensions of the canvas / graph
        var margin = {
                top: 1,
                right: 1,
                bottom: 1,
                left: 1
            },
            width = pageWidth - margin.left - margin.right,
            height = 20 - margin.top - margin.bottom;
           
        // Define scales 
        var x = d3.scale.linear()
          .range([0, width]);
        var y = d3.scale.linear()
          .range([height, 0]);
            
        var line = d3.svg.line()
            .x(function(d,i) {
                return x(i);
            })
            .y(function(d) {
                return y(d);
            });  
            
        var svgMainContainer = d3.select(element[0])
            .append("svg")
            .attr("width", width+margin.left+margin.right)
            .attr("height", height+margin.top+margin.bottom)

        var svgContainer = svgMainContainer
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top+ ")");

        // for consistency during th etrasition
        var selection = svgContainer;  
            
        // Add the valueline path.
        svgContainer.append("path")
            .attr("class", "line");

        /* 
        svgContainer.append("g")
          .attr("class", "x axis")
          .attr("transform", "translate(0," + height + ")");


        svgContainer.append("g")
            .attr("class", "y axis");
        */

            
        // set up axes  
        var xAxis = d3.svg.axis().scale(x)
            .orient("bottom").ticks(12);

        var yAxis = d3.svg.axis().scale(y)
            .orient("left").ticks(10);
            
        var resizeSvg = function() {
          width = element.width()-margin.left-margin.right;
          height = width*heightWidthRatio//-margin.top-margin.bottom;
          svgMainContainer.attr("width",element.width())
          svgMainContainer.attr("height",height+margin.top+margin.bottom)
        }
         
            
        /*
        * render
        */
        var render = function(data) {
          
          if (data) {

            var currentMax = d3.max(data, function(d) {return d});
            var currentMin = d3.min(data, function(d) {return d});
            
            maxValue = currentMax > maxValue ? currentMax : maxValue;
            minValue = currentMin < minValue ? currentMin : minValue;
            
            // Define scales domains
            x.domain(d3.extent(data, function(d,i) {
                return i;
            }));
            
            if (minValue < maxValue) {
              y.domain([minValue, maxValue]);
            } else {
              y.domain([0, 0]);
            }
            
            
            svgContainer.select(".line")
            .attr("d", line(data));
            
            // Add the X Axis
            svgContainer.select(".x.axis")
                .call(xAxis);

            // Add the Y Axis
            svgContainer.select(".y.axis")
                .call(yAxis);

          }
        }



        // Check for changes in data and re-render
        scope.$watch("data", function () {
          render(scope.data);
        }, true);   
        
        // Aux function for checking changes in screen dimension
        scope.getElementDimensions = function () {
          return { 'h': element.height(), 'w': element.width() };
        };

        // Check for chaneges in screen dimension, resize SVG and re-render
        scope.$watch(scope.getElementDimensions, function (newValue, oldValue) {
          resizeSvg();
          render(scope.data);
        }, true);
   
  
      }
      
      
    };
  }]);



