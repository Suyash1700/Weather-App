const states = [
    'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 
    'Connecticut', 'Delaware', 'District Of Columbia', 'Florida', 'Georgia', 
    'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 
    'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 
    'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 
    'New Hampshire', 'New Jersey', 'New Mexico', 'New York', 'North Carolina', 
    'North Dakota', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 
    'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 
    'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 
    'Wyoming'];

const stateAbbreviations = [
    'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 
    'DC', 'FL', 'GA', 'HI', 'ID', 'IL', 'IN', 'IA', 
    'KS', 'KY', 'LA', 'ME', 'MD', 'MA', 'MI', 'MN', 
    'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ', 'NM', 
    'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 
    'SC', 'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 
    'WV', 'WI', 'WY'];

 const weatherCodes = {
    "4201": ["Heavy Rain", "rain_heavy.svg"],
    "4001": ["Rain", "rain.svg"],
    "4200": ["Light Rain", "rain_light.svg"],
    "6201": ["Heavy Freezing Rain", "freezing_rain_heavy.svg"],
    "6001": ["Freezing Rain", "freezing_rain.svg"],
    "6200": ["Light Freezing Rain", "freezing_rain_light.svg"],
    "6000": ["Freezing Drizzle", "freezing_drizzle.svg"],
    "4000": ["Drizzle", "drizzle.svg"],
    "7101": ["Heavy Ice Pellets", "ice_pellets_heavy.svg"],
    "7000": ["Ice Pellets", "ice_pellets.svg"],
    "7102": ["Light Ice Pellets", "ice_pellets_light.svg"],
    "5101": ["Heavy Snow", "snow_heavy.svg"],
    "5000": ["Snow", "snow.svg"],
    "5100": ["Light Snow", "snow_light.svg"],
    "5001": ["Flurries", "flurries.svg"],
    "8000": ["Thunderstorm", "tstorm.svg"],
    "2100": ["Light Fog", "fog_light.svg"],
    "2000": ["Fog", "fog.svg"],
    "1001": ["Cloudy", "cloudy.svg"],
    "1102": ["Mostly Cloudy", "mostly_cloudy.svg"],
    "1101": ["Partly Cloudy", "partly_cloudy_day.svg"],
    "1100": ["Mostly Clear", "mostly_clear_day.svg"],
    "1000": ["Clear", "clear_day.svg"]
};

const precipitationMap = {
    '0': 'N/A',
    '1': 'Rain',
    '2': 'Snow',
    '3': 'Freezing Rain',
    '4': 'Ice Pellets'
};

let weatherApiData = null;
let globalLat = null;
let globalLong = null;

const stateInput = document.getElementById('state-input');

states.forEach((state, index) => {
    const option = document.createElement('option');
    option.textContent = state;
    option.value = stateAbbreviations[index];
    stateInput.appendChild(option);
});


const checkbox = document.getElementById('location-checkbox');
const streetInput = document.getElementById('street-input');
const cityInput = document.getElementById('city-input');

const submitBtn = document.querySelector('.submit-btn');
const clearInput = document.querySelector('.clear-btn');

const noRecords = document.querySelector('.no-records');

const weatherCard = document.querySelector('.weather-card');
const tableEncloser = document.querySelector('.dummy-table-encloser');
const daySpecificCont = document.querySelector('.day-specific-container');
const chartContainer = document.querySelector('.charts-container');

const downButton = document.querySelector('.down-button-div');
const upButton = document.querySelector('.up-button-div');

function locationCheckBox()
{
	if(checkbox.checked)
	{
		streetInput.value = '';
		cityInput.value = '';
		stateInput.value = '';

		streetInput.disabled = true;
		cityInput.disabled = true;
		stateInput.disabled = true;
	}
	else
	{
		streetInput.disabled = false;
		cityInput.disabled = false;
		stateInput.disabled = false;
	}
}

checkbox.addEventListener('change', locationCheckBox);

function clearButtonActions()
{
    streetInput.value = '';
    cityInput.value = '';
    stateInput.value = '';
    noRecords.style.display = 'none';

    if(checkbox.checked)
    {
        checkbox.checked = false;
        locationCheckBox();
    }

	weatherCard.style.display = 'none';
    tableEncloser.style.display = 'none';
    daySpecificCont.style.display = 'none';
    chartContainer.style.display = 'none';
}
clearInput.addEventListener('click', clearButtonActions);

function set_card_details(location_str)
{
	const weatherCardTitle = document.querySelector('.card-location-title');
	const weatherIcon = document.querySelector('.weather-icon-day');
	const weatherDesc = document.querySelector('.weather-card-l2');
	const tempVal = document.querySelector('.temp-val-text');

	weatherCard.style.display = "block";
    tableEncloser.style.display = "block";

	weatherCardTitle.textContent = location_str;

	let card_data = weatherApiData[0].values;
	let weather_code = card_data.weatherCode.toString();
	let desc = weatherCodes[weather_code][0];
	let img_src = weatherCodes[weather_code][1];
	let img_prefix = 'static/images/weather_symbols_charts/';
	weatherIcon.src = img_prefix+img_src;
	weatherDesc.textContent = desc;
	let temp_deg = card_data.temperature;
	tempVal.textContent = temp_deg;

	let humidityValue = document.getElementById('humidity-value');
	let pressureValue = document.getElementById('pressure-value');
	let windSpeedValue = document.getElementById('wind-speed-value');
	let visibilityValue = document.getElementById('visibility-value');
	let cloudCoverValue = document.getElementById('cloud-cover-value');
	let uvLevelValue = document.getElementById('uv-level-value');

	humidityValue.textContent = card_data.humidity.toString()+'%';
	pressureValue.textContent = card_data.pressureSeaLevel.toString()+'inHg';
	windSpeedValue.textContent = card_data.windSpeed.toString()+'mph';
	visibilityValue.textContent = card_data.visibility.toString()+'mi';
	cloudCoverValue.textContent = card_data.cloudCover.toString()+'%';
	uvLevelValue.textContent = card_data.uvIndex.toString();

}

async function get_ip_info()
{
    const ip_info_token = '06c2760eaea528';
	let url = `https://ipinfo.io/?token=${ip_info_token}`;
	try
	{
        let response = await fetch(url, { method: "GET" });
        if(response===undefined || response===null || response.length===0 || response.status>=400)
        {
            data = null;
            return data;
        }
        let data = await response.json();
		return data;
    }
	catch(error)
	{
        console.error('IP data fetch error:', error);
    }
}

async function get_geocoding_info(street_val, city_val, state_val)
{
    const geocoding_api_key = 'AIzaSyAeqQ8vpfsXYxVixIgIhHmwARL7wp09ERU';
    let url = `https://maps.googleapis.com/maps/api/geocode/json?address=${street_val}, ${city_val}, ${state_val}&key=${geocoding_api_key}`;
    try
	{
        let response = await fetch(url, { method: "GET" });
        let data = await response.json();
		return data;
    }
	catch(error)
	{
        console.error('Geocoding data fetch error:', error);
    }
}

function parseDate(dateString)
{
    const dateObj = new Date(dateString);
    const weekday = new Intl.DateTimeFormat('en-US', { weekday: 'long' }).format(dateObj);
    const day = new Intl.DateTimeFormat('en-US', { day: 'numeric' }).format(dateObj);
    const month = new Intl.DateTimeFormat('en-US', { month: 'short' }).format(dateObj);
    const year = new Intl.DateTimeFormat('en-US', { year: 'numeric' }).format(dateObj);
    let res = `${weekday}, ${day} ${month} ${year}`;
    return res;
}

function convertTo12Hour(timeString) {
    const options = { timeZone: 'America/Los_Angeles', hour12: true, hour: 'numeric', minute: 'numeric' };
    const losAngelesTime = new Date(timeString).toLocaleString('en-US', options);
    return losAngelesTime;
}

function processTableClick(index)
{
    row_data = weatherApiData[index];
    weatherCard.style.display = 'none';
    tableEncloser.style.display = 'none';

    const dateHeader = document.querySelector('.date-specific');
    const statusHeader = document.querySelector('.status-specific');
    const tempHeader = document.querySelector('.temperature-specific');
    const imgHeader = document.querySelector('.weather-icon-specific');
    dateHeader.textContent = parseDate(row_data['startTime']);
    statusHeader.textContent = weatherCodes[row_data['values']['weatherCode'].toString()][0];
    imgHeader.src = 'static/images/weather_symbols_charts/' + weatherCodes[row_data['values']['weatherCode'].toString()][1];
    tempHeader.textContent = row_data['values']['temperatureMax'].toString() + '°F/' + row_data['values']['temperatureMin'].toString() + '°F';

    let precipitation = precipitationMap[row_data['values']['precipitationType'].toString()];
    let chanceRain = row_data['values']['precipitationProbability'].toString() + '%';
    let windSpeed = row_data['values']["windSpeed"].toString() + ' mph';
    let humidity = row_data['values']['humidity'].toString() + ' %';
    let visibility = row_data['values']['visibility'].toString() + ' mi';
    let sunString = convertTo12Hour(row_data['values']["sunriseTime"]) + '/' + convertTo12Hour(row_data['values']["sunsetTime"]);

    const specificDayListDiv = document.querySelector('.details-list-values');
    specificDayListDiv.children[0].textContent = precipitation;
    specificDayListDiv.children[1].textContent = chanceRain;
    specificDayListDiv.children[2].textContent = windSpeed;
    specificDayListDiv.children[3].textContent = humidity;
    specificDayListDiv.children[4].textContent = visibility;
    specificDayListDiv.children[5].textContent = sunString;

    daySpecificCont.style.display = 'flex';
}

function createWeatherRow(rowData, index) {
    const rowDiv = document.createElement('div');
    rowDiv.classList.add('table-data-row');
    rowDiv.setAttribute('data-index', index);
    
    rowDiv.addEventListener('click', function() {
        processTableClick(index);
    });

    const col1 = document.createElement('div');
    col1.classList.add('col-1');
    col1.textContent = rowData[0];
    rowDiv.appendChild(col1);

    const col2 = document.createElement('div');
    col2.classList.add('col-2');
    const img = document.createElement('img');
    img.src = `static/images/weather_symbols_charts/${rowData[1]}`;
    img.alt = rowData[2];
    img.classList.add('table-row-img');
    const span = document.createElement('span');
    span.classList.add('status-text-table');
    span.textContent = rowData[2];
    col2.appendChild(img);
    col2.appendChild(span);
    rowDiv.appendChild(col2);

    const col3 = document.createElement('div');
    col3.classList.add('col-3');
    col3.textContent = rowData[3];
    rowDiv.appendChild(col3);

    const col4 = document.createElement('div');
    col4.classList.add('col-4');
    col4.textContent = rowData[4];
    rowDiv.appendChild(col4);

    const col5 = document.createElement('div');
    col5.classList.add('col-5');
    col5.textContent = rowData[5];
    rowDiv.appendChild(col5);

    return rowDiv;
}

function parseApiRow(data)
{
    const dateString = data['startTime'];
    const formattedDate = parseDate(dateString);

    const weather_code = data['values']['weatherCode'].toString();
    const desc = weatherCodes[weather_code][0];
	const img_src = weatherCodes[weather_code][1];
    const temp_high = data['values']['temperatureMax'].toString();
    const temp_low = data['values']['temperatureMin'].toString();
    const wind_speed = data['values']['windSpeed'].toString();

    return [formattedDate, img_src, desc, temp_high, temp_low, wind_speed];

}

function set_table_details()
{
    const weatherData = []
    for (let i = 0; i < weatherApiData.length; i++)
    {
        let row = weatherApiData[i];
        dataRow = parseApiRow(row);
        weatherData.push(dataRow);
    }

    const parentDiv = document.querySelector('.weather-table-forecast');
    const dummyDiv = document.querySelector('.dummy-table-encloser');
    dummyDiv.style.display = "block";
    weatherData.forEach((row, index) => {
        const rowElement = createWeatherRow(row, index);
        parentDiv.appendChild(rowElement);
    });
}

function removeCharts()
{
    upButton.style.display = 'none';
    chartContainer.style.display = 'none';
    downButton.style.display = 'block';
}

function noRecordsHandler()
{
    noRecords.style.display = 'block';
    daySpecificCont.style.display = 'none';
    weatherCard.style.display = 'none';
    tableEncloser.style.display = 'none';
    removeCharts();
}

async function submit_handler(event)
{
    let lat = null;
    let long = null;
	let location_str = null;
    weatherApiData = null;

    noRecords.style.display = 'none';
    const table_parent_div = document.querySelector('.weather-table-forecast');
    const childDivs = table_parent_div.querySelectorAll('div');

    while (table_parent_div.children.length > 1) {
        table_parent_div.removeChild(table_parent_div.children[1]);
    }

    if(checkbox.checked)
	{
        console.log('Fetch IP address and fetch lat/long using that');
		ip_data = await get_ip_info();
        if (ip_data === undefined || ip_data===null || ip_data.length==0)
        {
            noRecordsHandler();
            return ;
        }
		ip = ip_data['ip'];
		city = ip_data['city'];
		region = ip_data['region'];
		country = ip_data['country'];
		location_str = city+', '+region+', '+country;
		[lat, long] = ip_data['loc'].split(',').map(Number);
    }
	else
	{
        console.log('Use input fields to find lat/long');
        const city_val = cityInput.value;
        const street_val = streetInput.value;
        const state_val = stateInput.value;

        let geodata = await get_geocoding_info(street_val, city_val, state_val);
        if (geodata === undefined || geodata===null || geodata.length==0 || geodata.status==="ZERO_RESULTS" || geodata.results.length===0)
        {
            noRecordsHandler();
            return ;
        }
        location_str = geodata['results'][0]['formatted_address'];
        lat = Number(geodata['results'][0]['geometry']['location']['lat']);
        long = Number(geodata['results'][0]['geometry']['location']['lng']);
        console.log('Fetched GEO data:',lat,long,location_str);
    }

    globalLat = lat;
    globalLong = long;

    let url = `/get-weather-details?lat=${lat}&long=${long}`;
    try
	{
        let response = await fetch(url, { method: "GET" });
        weatherApiData = await response.json();
    }
	catch(error)
	{
        console.error('Weather details fetch error (flask):', error);
    }
    if (weatherApiData === undefined || weatherApiData===null || weatherApiData.length==0)
    {
        noRecordsHandler();
        return ;
    }
	set_card_details(location_str);
    set_table_details();
    daySpecificCont.style.display = 'none';
    upButton.style.display = 'none';
    chartContainer.style.display = 'none';
    downButton.style.display = 'block';
}

function chart2Display(intervals)
{
    let humidityData = [];
    let temperatureData = [];
    let pressureData = [];
    let windData = [];

    intervals.forEach(item => {
    const timestamp = new Date(item.startTime).getTime();

    humidityData.push([timestamp, Number(item.values.humidity)]);
    temperatureData.push([timestamp, Number(item.values.temperature)]);
    pressureData.push([timestamp, Number(item.values.pressureSeaLevel)]);
    windData.push({
        x: timestamp,
        value: Number(item.values.windSpeed),
        direction: Number(item.values.windDirection)
    });
    });

    function Meteogram(container) {
        this.symbols = [];
        this.humidity = humidityData;
        this.humidityError = [];
        this.winds = windData;
        this.temperatures = temperatureData;
        this.pressures = pressureData;

        this.container = container;

        this.parseYrData();
    }


    Meteogram.prototype.drawBlocksForWindArrows = function (chart) {
        const xAxis = chart.xAxis[0];

        for (
            let pos = xAxis.min, max = xAxis.max, i = 0;
            pos <= max + 36e5; pos += 36e5,
            i += 1
        ) {

            const isLast = pos === max + 36e5,
                x = Math.round(xAxis.toPixels(pos)) + (isLast ? 0.5 : -0.5);

            const isLong = this.resolution > 36e5 ?
                pos % this.resolution === 0 :
                i % 2 === 0;

            chart.renderer
                .path([
                    'M', x, chart.plotTop + chart.plotHeight + (isLong ? 0 : 28),
                    'L', x, chart.plotTop + chart.plotHeight + 32,
                    'Z'
                ])
                .attr({
                    stroke: chart.options.chart.plotBorderColor,
                    'stroke-width': 1
                })
                .add();
        }

    chart.get('windbarbs').markerGroup.attr({
        translateX: chart.get('windbarbs').markerGroup.translateX + 8
    });

};

    Meteogram.prototype.getChartOptions = function () {
        return {
            chart: {
                renderTo: this.container,
                marginBottom: 70,
                marginRight: 40,
                marginTop: 50,
                plotBorderWidth: 1,
                height: 400,
                alignTicks: false,
                scrollablePlotArea: {
                    minWidth: 720
                }
            },

            title: {
                text: 'Hourly Weather (For Next 5 Days)',
                align: 'center',
                style: {
                    whiteSpace: 'nowrap',
                    textOverflow: 'ellipsis'
                }
            },

            credits: {
                text: 'Forecast',
                position: {
                    x: -40
                }
            },

            tooltip: {
                shared: true,
                useHTML: true,
                headerFormat:
                    '<small>{point.x:%A, %b %e, %H:%M} - ' +
                    '{point.point.to:%H:%M}</small><br>' +
                    '<b>{point.point.symbolName}</b><br>'

            },

            xAxis: [{
                type: 'datetime',
                tickInterval: 2 * 36e5,
                minorTickInterval: 36e5,
                tickLength: 0,
                gridLineWidth: 1,
                gridLineColor: 'rgba(128, 128, 128, 0.1)',
                startOnTick: false,
                endOnTick: false,
                minPadding: 0,
                maxPadding: 0,
                offset: 30,
                showLastLabel: true,
                labels: {
                    format: '{value:%H}'
                },
                crosshair: true
            }, {
                linkedTo: 0,
                type: 'datetime',
                tickInterval: 24 * 3600 * 1000,
                labels: {
                    format: '{value:<span style="font-size: 12px; font-weight: ' +
                        'bold">%a</span> %b %e}',
                    align: 'left',
                    x: 3,
                    y: 8
                },
                opposite: true,
                tickLength: 20,
                gridLineWidth: 1
            }],

            yAxis: [{
                title: {
                    text: null
                },
                labels: {
                    format: '{value}°',
                    style: {
                        fontSize: '10px'
                    },
                    x: -3
                },
                plotLines: [{
                    value: 0,
                    color: '#BBBBBB',
                    width: 1,
                    zIndex: 2
                }],
                maxPadding: 0.3,
                minRange: 8,
                tickInterval: 1,
                gridLineColor: 'rgba(128, 128, 128, 0.1)'

            }, {
                title: {
                    text: null
                },
                labels: {
                    enabled: false
                },
                gridLineWidth: 0,
                tickLength: 0,
                minRange: 10,
                min: 0

            }, {
                allowDecimals: false,
                title: {
                    text: 'inHg',
                    offset: 0,
                    align: 'high',
                    rotation: 0,
                    style: {
                        fontSize: '10px',
                        color: Highcharts.getOptions().colors[2]
                    },
                    textAlign: 'left',
                    x: 3
                },
                labels: {
                    style: {
                        fontSize: '8px',
                        color: Highcharts.getOptions().colors[2]
                    },
                    y: 2,
                    x: 3
                },
                gridLineWidth: 0,
                opposite: true,
                showLastLabel: false
            }],

            legend: {
                enabled: false
            },

            plotOptions: {
                series: {
                    pointPlacement: 'between'
                }
            },


            series: [{
                name: 'Temperature',
                data: this.temperatures,
                type: 'spline',
                marker: {
                    enabled: false,
                    states: {
                        hover: {
                            enabled: true
                        }
                    }
                },
                tooltip: {
                    pointFormat: '<span style="color:{point.color}">\u25CF</span>' +
                        ' ' +
                        '{series.name}: <b>{point.y}°F</b><br/>'
                },
                zIndex: 1,
                color: '#FF3333',
                negativeColor: '#48AFE8'
            }, {
                name: 'Humidity',
                data: this.humidityError,
                type: 'column',
                color: 'url(#humidity-error)',
                yAxis: 1,
                groupPadding: 0,
                pointPadding: 0,
                tooltip: {
                    valueSuffix: ' mm',
                    pointFormat: '<span style="color:{point.color}">\u25CF</span>' +
                        ' ' +
                        '{series.name}: <b>{point.minvalue} mm - ' +
                        '{point.maxvalue} mm</b><br/>'
                },
                grouping: false,
                dataLabels: {
                    enabled: this.hasHumidityError,
                    filter: {
                        operator: '>',
                        property: 'maxValue',
                        value: 0
                    },
                    style: {
                        fontSize: '8px',
                        color: 'gray'
                    }
                }
            }, {
                name: 'Humidity',
                data: this.humidity,
                type: 'column',
                color: '#68CFE8',
                yAxis: 1,
                groupPadding: 0,
                pointPadding: 0,
                grouping: false,
                dataLabels: {
                    enabled: !this.hasHumidityError,
                    filter: {
                        operator: '>',
                        property: 'y',
                        value: 0
                    },
                    style: {
                        fontSize: '8px',
                        color: '#666'
                    }
                },
                tooltip: {
                    valueSuffix: ' %'
                }
            }, {
                name: 'Air pressure',
                color: Highcharts.getOptions().colors[2],
                data: this.pressures,
                marker: {
                    enabled: false
                },
                shadow: false,
                tooltip: {
                    valueSuffix: ' inHg'
                },
                dashStyle: 'shortdot',
                yAxis: 2
            }, {
                name: 'Wind',
                type: 'windbarb',
                id: 'windbarbs',
                color: Highcharts.getOptions().colors[1],
                lineWidth: 1.5,
                data: this.winds,
                vectorLength: 12,
                yOffset: -15,
                tooltip: {
                    valueSuffix: ' mph'
                }
            }]
        };
    };

    Meteogram.prototype.onChartLoad = function (chart) {

        this.drawBlocksForWindArrows(chart);

    };

    Meteogram.prototype.createChart = function () {
        this.chart = new Highcharts.Chart(this.getChartOptions(), chart => {
            this.onChartLoad(chart);
        });
    };

    Meteogram.prototype.error = function () {
        document.getElementById('loading').innerHTML =
            '<i></i> Failed loading data, please try again ' +
            'later';
    };


    Meteogram.prototype.parseYrData = function () {
        this.createChart();
    };

    window.meteogram = new Meteogram('chart-2-container');
}

function convertToMidnight(date_str, offset) {
    const date = new Date(date_str);
    date.setUTCDate(date.getUTCDate() + offset);
    date.setUTCHours(0, 0, 0, 0);
    return date.toISOString();
}

async function getChart2Data()
{
    let og_start_time = weatherApiData[0]['startTime'];
    let api_start_time = convertToMidnight(og_start_time,1);

    let url = `/get-weather-chart-details?lat=${globalLat}&long=${globalLong}&startTime=${api_start_time}`;
    try
	{
        let response_chart = await fetch(url, { method: "GET" });
        let intervals = await response_chart.json();
        console.log('Retrieved chart data length:', intervals.length);
        return intervals;
    }
	catch(error)
	{
        console.error('Chart2 data fetch error:', error);
    }
}

async function displayCharts()
{
    downButton.style.display = 'none';
    upButton.style.display = 'block';
    chartContainer.style.display = 'block';

    // Chart 1
    let reqData = weatherApiData.slice(0,6);
    let chartData = [];
    reqData.forEach((row, index) => {
        chartData.push({'datetime': row['startTime'], 'minTemp': row['values']['temperatureMin'], 'maxTemp': row['values']['temperatureMax']});
    });
    
    const formattedData = chartData.map(item => {
        const date = new Date(item.datetime);
        return [Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()), item.minTemp, item.maxTemp];
    });
    
    Highcharts.chart('chart-1-container', {
        chart: {
            type: 'arearange'
        },
        title: {
            text: 'Temperature Ranges (Min, Max)'
        },
        xAxis: {
            type: 'datetime',
            labels: {
                formatter: function() {
                    return Highcharts.dateFormat('%e %b', this.value);
                }
            }
        },
        yAxis: {
            title: {
                text: null
            }
        },
        tooltip: {
            crosshairs: true,
            shared: true,
            valueSuffix: '°F',
            xDateFormat: '%A, %b %e'
        },
        legend: {
            enabled: false
          },
        series: [{
            name: 'Temperatures',
            data: formattedData,
            color: {
                linearGradient: { x1: 0, x2: 0, y1: 0, y2: 1 },
                stops: [
                    [0, 'rgba(255, 165, 0,0.95)'],
                    [1, 'rgba(0,121,199,0.4)']
                ]
            },
            lineColor: '#ff8000',
            lineWidth: 1.5,
            marker: {
                fillColor: '#1E90FF',
                radius: 4
            }
        }]
    });
      
    let intervals = await getChart2Data();

    chart2Display(intervals);
}

document.addEventListener('DOMContentLoaded', clearButtonActions);
