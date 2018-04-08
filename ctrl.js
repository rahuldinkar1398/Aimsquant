app.controller('ctrl',function ($scope, $http) {

		$scope.stock_details = [["N/A","N/A","N/A","N/A","N/A","N/A"]];
		$scope.highest = "N/A";
		$scope.lowest = "N/A";
		$scope.leastclose = "N/A";
		$scope.graphseries = [];

		today_date = new Date();
		date_before = new Date();
		date_before.setDate(date_before.getDate() - 364);


		$scope.deltefromrecent =function(){
			$( "input[name=recent]:checked" ).parent().parent().remove();
			$("#dltsearch").hide();
		}

		$scope.deltefromwatch =function(){
			$( "input[name=watch]:checked" ).parent().parent().remove();
			$("#dltwatch").hide();
		}

		$scope.searchstock = function(){
			$http({
				method : "GET",
				url : "https://www.quandl.com/api/v3/datasets/NSE/"
						+$scope.searchfor+".json?api_key=MX4zkypoSjUzp8CyotQg&start_date="
						+date_before.getFullYear()+"-"+(date_before.getMonth()+1)+"-"+date_before.getDate()+"&end_date="
						+today_date.getFullYear()+"-"+(today_date.getMonth()+1)+"-"+today_date.getDate()
				}).then(function mySuccess(response) {
					$scope.companysymbol = $scope.searchfor;
					$scope.stock_details = response.data.dataset.data;
					$("#recentsearchtable").after('<tr><td><input type="checkbox" name="recent"> '+ $scope.searchfor +'</td><td>'+ $scope.stock_details[0][4] +'</td></tr>');
					$scope.searchfor = "";

					$scope.highest = $scope.stock_details[0][2];
					$scope.lowest = $scope.stock_details[0][3];
					$scope.leastclose = $scope.stock_details[0][5]
					$scope.graphdata = [];
					len = $scope.stock_details.length;
					
					for(i=len-1 ; i>=0 ; i--){
						$scope.highest = Math.max($scope.highest,$scope.stock_details[i][2]);
						$scope.lowest = Math.min($scope.lowest, $scope.stock_details[i][3]);
						$scope.leastclose = Math.min($scope.leastclose, $scope.stock_details[i][5]);
						$scope.graphdata.push([new Date($scope.stock_details[i][0]).getTime(),$scope.stock_details[i][5]]);
					}
					$scope.graphseries = [{ name : $scope.companysymbol , data : $scope.graphdata }];

					$scope.createchart($scope.graphseries);

				}, function myError(response) {
					$scope.errormsg = response.statusText;
				});
		}

		$scope.comparestockwith = function(){
			$http({
				method : "GET",
				url : "https://www.quandl.com/api/v3/datasets/NSE/"
						+$scope.comparewith+".json?api_key=MX4zkypoSjUzp8CyotQg&start_date="
						+date_before.getFullYear()+"-"+(date_before.getMonth()+1)+"-"+date_before.getDate()+"&end_date="
						+today_date.getFullYear()+"-"+(today_date.getMonth()+1)+"-"+today_date.getDate()
				}).then(function mySuccess(response) {
					$scope.stock_details1 = response.data.dataset.data;
					$("#recentsearchtable").after('<tr><td><input type="checkbox" name="recent"> '+ $scope.comparewith +'</td><td>'+ $scope.stock_details1[0][4] +'</td></tr>');

					$scope.graphdata1 = [];
					len = $scope.stock_details1.length;
					
					for(i=len-1 ; i>=0 ; i--){
						$scope.graphdata1.push([new Date($scope.stock_details1[i][0]).getTime(),$scope.stock_details1[i][5]]);
					}
					$scope.graphseries.push({ name : $scope.comparewith , data : $scope.graphdata1 });
					$scope.comparewith = "";
					$scope.createchart($scope.graphseries);

				}, function myError(response) {
					$scope.errormsg = response.statusText;
				});
		}

		$scope.createchart = function(seriesoption){
			Highcharts.stockChart('graphplot', {

				        rangeSelector: {
				            selected: 4
				        },

				        yAxis: {
				            
				            plotLines: [{
				                value: 0,
				                width: 2,
				                color: 'silver'
				            }]
				        },
				        tooltip: {
				            pointFormat: '<span style="color:{series.color}">{series.name}</span>: <b>{point.y}</b><br/>',
				            valueDecimals: 2,
				            split: true
				        },

				        series: seriesoption
				    });
		}

		$scope.addtowatchlist = function(){
			if ($scope.companysymbol) {
				$("#watchlisttable").after('<tr><td><input type="checkbox" name="watch"> '+ $scope.companysymbol +'</td><td>'+ $scope.stock_details[0][4] +'</td></tr>');
			}
		}

		$http.get('./datasetcodes.csv').then(function (allText){
			var allTextLines = allText.data.split(/\r\n|\n/);
			var lines = [];

			for ( var i = 0; i < allTextLines.length; i++) {
				var data = allTextLines[i].split(',')[0].split("/")[1];
				lines.push(data);
			}
			$scope.symboldata = lines;
		});

	});