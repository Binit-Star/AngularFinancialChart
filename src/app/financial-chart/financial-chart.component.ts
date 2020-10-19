import { Component, OnInit } from '@angular/core';
import { Chart } from 'chart.js';
import * as moment from 'moment';

@Component({
  selector: 'app-financial-chart',
  templateUrl: './financial-chart.component.html',
  styleUrls: ['./financial-chart.component.css']
})
export class FinancialChartComponent implements OnInit {
  Linechart = [];
  constructor() { }

  ngOnInit() {
    function generateData() {
			let unit: moment.unitOfTime.DurationConstructor  = 'minute';

			function unitLessThanDay() {
				return unit === 'second' || unit === 'minute' || unit === 'hour';
			}

			function beforeNineThirty(date) {
				return date.hour() < 9 || (date.hour() === 9 && date.minute() < 30);
			}

			// Returns true if outside 9:30am-4pm on a weekday
			function outsideMarketHours(date) {
				if (date.isoWeekday() > 5) {
					return true;
				}
				if (unitLessThanDay() && (beforeNineThirty(date) || date.hour() > 16)) {
					return true;
				}
				return false;
			}

			function randomNumber(min, max) {
				return Math.random() * (max - min) + min;
			}

			function randomBar(date, lastClose) {
				var open = randomNumber(lastClose * 0.95, lastClose * 1.05).toFixed(2);
				var close = randomNumber(open * 0.95, open * 1.05).toFixed(2);
				return {
					t: date.valueOf(),
					y: close
				};
			}

			var date = moment('Oct 9 2020', 'MMM DD YYYY');
			var now = moment();
			var data = [];
			var lessThanDay = unitLessThanDay();
			for (; data.length < 600 && date.isBefore(now); date = date.clone().add(1, unit).startOf(unit)) {
				if (outsideMarketHours(date)) {
					if (!lessThanDay || !beforeNineThirty(date)) {
						date = date.clone().add(date.isoWeekday() >= 5 ? 8 - date.isoWeekday() : 1, 'day');
					}
					if (lessThanDay) {
						date = date.hour(9).minute(30).second(0);
					}
				}
				data.push(randomBar(date, data.length > 0 ? data[data.length - 1].y : 30));
			}

			return data;
    }
    
    var cfg = {
			data: {
				datasets: [{
					label: 'CHRT - Chart.js Corporation',
					backgroundColor: "#0000FF",
					borderColor: "red",
					data: generateData(),
					type: 'line',
					pointRadius: 0,
					fill: false,
					lineTension: 0,
					borderWidth: 2
				}]
			},
			options: {
				animation: {
					duration: 0
				},
				scales: {
					xAxes: [{
						type: 'time',
						distribution: 'series',
						offset: true,
						ticks: {
							major: {
								enabled: true,
								fontStyle: 'bold'
							},
							source: 'data',
							autoSkip: true,
							autoSkipPadding: 75,
							maxRotation: 0,
							sampleSize: 100
						},
						afterBuildTicks: function(scale, ticks) {
							var majorUnit = scale._majorUnit;
							var firstTick = ticks[0];
							var i, ilen, val, tick, currMajor, lastMajor;

							val = moment(ticks[0].value);
							if ((majorUnit === 'minute' && val.second() === 0)
									|| (majorUnit === 'hour' && val.minute() === 0)
									|| (majorUnit === 'day' && val.hour() === 9)
									|| (majorUnit === 'month' && val.date() <= 3 && val.isoWeekday() === 1)
									|| (majorUnit === 'year' && val.month() === 0)) {
								firstTick.major = true;
							} else {
								firstTick.major = false;
							}
							lastMajor = val.get(majorUnit);

							for (i = 1, ilen = ticks.length; i < ilen; i++) {
								tick = ticks[i];
								val = moment(tick.value);
								currMajor = val.get(majorUnit);
								tick.major = currMajor !== lastMajor;
								lastMajor = currMajor;
							}
							return ticks;
						}
					}],
					yAxes: [{
						gridLines: {
							drawBorder: false
						},
						scaleLabel: {
							display: true,
							labelString: 'Closing price ($)'
						}
					}]
				},
				tooltips: {
					intersect: false,
					mode: 'index',
					callbacks: {
						label: function(tooltipItem, myData) {
							var label = myData.datasets[tooltipItem.datasetIndex].label || '';
							if (label) {
								label += ': ';
							}
							label += parseFloat(tooltipItem.value).toFixed(2);
							return label;
						}
					}
				}
			}
    };
    
this.Linechart = new Chart('canvas',cfg);

  }

}
