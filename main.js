

            const chartLabels = []
            const chartData = []

            const leastPopularChartLabels = []
            const leastPopularChartData = []

            const averageChartLabels = []
            const averageChartData = []

            const bubbleData = []
            const bubbleLabel = []
            const bubbleSize = []

            let display = 'none'
            let altDisplay = 'none'


            // document.addEventListener('DOMContentLoaded', () => {
            //     document
            //         .getElementById('barChartPopularity')
            //         .addEventListener('input', handleSelect)
            // })

            // function handleSelect(event) {
            //     let popularity = event.target
            //     console.log(typeof popularity.value)
            // }

            // Create HTML elements to render upon chart load



            // Parse CSV - Convert to JSON Object

            const uploadconfirm = document.getElementById('uploadconfirm').addEventListener('click', () => {
                display = 'flex'
                Papa.parse(document.getElementById('uploadfile').files[0], 
                {
                    download: true,
                    header: true,
                    skipEmptyLines: true,
                    complete: function(results){

                        let allData = results.data
                        

                        // 0 Search Hits Data Filtering

                        // Filter allData object to only include search queries with 0 hits
                        const noHits = allData.filter(noHit => noHit.hits === '0')

                        // Remove uneccesary information from object
                        noHits.forEach(i => {delete i.id; delete i.time; delete i.user_id; delete i.ip})


                        // Consolidate search queries, and count search quanity
                        const zeroHits = {}

                        for (let row of noHits){
                            if (!zeroHits[row.query]){
                                zeroHits[row.query] = 1
                            } else {
                                zeroHits[row.query] ++
                            }
                        }

                        // Add keys to values
                        const finalZeroHitsObj = Object.entries(zeroHits).map(([key, value]) => ({key, value}))


                        // Greater than 0 Search Hits Data Filtering

                        // Filter allData object to only include search queries with > 0 hits
                        const hits = allData.filter(hit => hit.hits !== '0')


                        
                        // DATA FOR BUBBLECHART

                        const convertString = obj => {
                            const res = []
                            for (const key in obj){
                                res[key] = {}
                                for(const prop in obj[key]){
                                    const parsed = parseInt(obj[key][prop], 10)
                                    res[key][prop] = isNaN(parsed) ? obj[key][prop] : parsed
                                }
                            }
                            return res
                        }

                        let result = convertString(hits)

                        let newResult = [...result]

                        newResult.forEach(i => {delete i.id; delete i.time; delete i.user_id; delete i.ip})

                        class QueryHits {

                            constructor(query, hits) {

                            this.query = query
                            this.entries = 1
                            this.hits = hits
                            }

                        }

                        const holder = {}

                        for(const query of newResult){
                            const queryName = query.query, queryHits = query.hits
                            if(!holder[queryName]){
                                holder[queryName] = new QueryHits(queryName, queryHits)
                            } else {
                                holder[queryName].entries++
                                holder[queryName]. hits += queryHits
                            }
                        }

                        const finalSearchTally = Object.entries(holder).map(value => value[1])



                        for(let row of finalSearchTally){
                            bubbleData.push(row.entries)
                            bubbleLabel.push(row.query)
                            bubbleSize.push(row.hits)
                        }


                        // Consolidate search queries, and count search quanity
                        const mergeHits = {}

                        for (let row of hits) {
                            if(!mergeHits[row.query]){
                                mergeHits[row.query] = 1
                                
                                // mergeHits[row.hits] = mergeHits[row.hits]
                            } else {
                                mergeHits[row.query] ++
                            }
                        }

                        // Add keys to values
                        const newMerge = Object.entries(mergeHits).map(([key, value]) => ({key, value}))


                        // Filter data sent to Chart.js
                        let chartFilterPopular = newMerge.filter(single => single.value > 20)

                        let chartFilterLeast = newMerge.filter(single => single.value < 10)

                        let chartFilterAverage = newMerge.filter(single => single.value > 10 && single.value < 20)


                        for(i=0; i<chartFilterPopular.length; i++){
                            chartLabels.push(chartFilterPopular[i].key)
                            chartData.push(chartFilterPopular[i].value)
                        }

                        for(i=0; i<chartFilterLeast.length; i++){
                            leastPopularChartLabels.push(chartFilterLeast[i].key)
                            leastPopularChartData.push(chartFilterLeast[i].value)
                        }

                        for(i=0; i<chartFilterAverage.length; i++){
                            averageChartLabels.push(chartFilterLeast[i].key)
                            averageChartData.push(chartFilterLeast[i].value)
                        }


                        // Create 'no hits' table

                        // Change display property to render table upon data load
                        document.getElementById('chartContainer').style.display = display

                        // Table Label
                        document.getElementById('noHitsTableLabel').innerHTML = "Searches Resulting in 0 Hits"


                        let tbl = document.createElement('table')
                        document.getElementById('zeroHitsTable').appendChild(tbl)
                        tbl.classList.add("table-style");

                        let table = document.querySelector('table')
                        let headerRow = document.createElement('tr')
                        let info = Object.keys(finalZeroHitsObj[0])
                        let headers = ['Search Query', 'Search Quanity']

                        function generateTable(table, info){
                            headers.forEach(headerText => {
                                let header = document.createElement('th')
                                let textNode = document.createTextNode(headerText)
                                header.appendChild(textNode)
                                headerRow.appendChild(header)
                            })


                            table.appendChild(headerRow)
                            for(let element of info) {
                                let row = table.insertRow()
                                for(key in element){
                                    let cell = row.insertCell()
                                    let text = document.createTextNode(element[key])
                                    cell.appendChild(text)
                                }
                            }
                        }
                        generateTable(table, finalZeroHitsObj)
                        

                        // Charts

                        // Change display property to render div upon data load
                        document.getElementById('chartContainer').style.display = display
                        document.getElementById('break').style.display = display
                        document.getElementById('zeroHitsTable').style.display = display
                        document.getElementById('nextChartContainer').style.display = display
                        // document.getElementById('uploadForm').style.display = altDisplay



                        // Chart Header Labels
                        const chartLabel = document.createElement('H3')
                        chartLabel.setAttribute('id', 'barChartLabel')
                        const hr = document.getElementById('break')
                        hr.after(chartLabel)

                        const scroll = document.getElementById('scrollTo')
                        scroll.scrollIntoView()

                        // const chartContainer = document.createElement('div')
                        // chartContainer.setAttribute('class', 'chart-container')
                        // const h4 = document.getElementById(barChartLabelSubHead)
                        // h4.after(chartContainer)


                        document.getElementById('barChartLabel').innerHTML = "Search Queries"
                        document.getElementById('barChartLabelSubHead').innerHTML = "View search terms and number of times those keywords were entered. Use drop down menu to sort search terms by popularity."
                        document.getElementById('dateLabel').innerHTML = "Search Queries by Date"


                        // Bar Chart Setup Block
                        const data = {
                            labels: chartLabels,
                                datasets: [{
                                    label: '# of Searches',
                                    data: chartData,
                                    backgroundColor: [
                                        'rgba(255, 99, 132, 0.2)',
                                        'rgba(54, 162, 235, 0.2)',
                                        'rgba(255, 206, 86, 0.2)',
                                        'rgba(75, 192, 192, 0.2)',
                                        'rgba(153, 102, 255, 0.2)',
                                        'rgba(255, 159, 64, 0.2)'
                                    ],
                                    borderColor: [
                                        'rgba(255, 99, 132, 1)',
                                        'rgba(54, 162, 235, 1)',
                                        'rgba(255, 206, 86, 1)',
                                        'rgba(75, 192, 192, 1)',
                                        'rgba(153, 102, 255, 1)',
                                        'rgba(255, 159, 64, 1)'
                                    ],
                                    borderWidth: 1,
                                }]
                        }

                        // Bar Chart Config Block
                        const config = {
                            type: 'bar',
                            data,
                            responsive: true,
                            maintainAspectRation: false,
                            options: {
                                scales: {
                                    y: {
                                        beginAtZero: true
                                    }
                                }
                            }
                        }

                        // Bar Chart Render Block
                        const barChart = new Chart(
                            document.getElementById('barChart'),
                            config
                        )

                        // const avgButton = document.getElementById('avg')
                        // avgButton.addEventListener('click', () => {
                        //     barChart.data.datasets[0].data = averageChartData
                        //     barChart.data.labels = averageChartLabels
                        // })


                        // Pie Chart Setup Block
                        const dataPie = {
                            labels: chartLabels,
                                datasets: [{
                                    label: 'Search Data',
                                    data: chartData,
                                    backgroundColor: [
                                        'rgba(255, 99, 132, 0.2)',
                                        'rgba(54, 162, 235, 0.2)',
                                        'rgba(255, 206, 86, 0.2)',
                                        'rgba(75, 192, 192, 0.2)',
                                        'rgba(153, 102, 255, 0.2)',
                                        'rgba(255, 159, 64, 0.2)'
                                    ],
                                    borderColor: [
                                        'rgba(255, 99, 132, 1)',
                                        'rgba(54, 162, 235, 1)',
                                        'rgba(255, 206, 86, 1)',
                                        'rgba(75, 192, 192, 1)',
                                        'rgba(153, 102, 255, 1)',
                                        'rgba(255, 159, 64, 1)'
                                    ],
                                    borderWidth: 1
                                }]
                        }

                        // Pie Chart Config Block
                        const configPie = {
                            type: 'doughnut',
                            data: dataPie,
                            maintainAspectRation: false,
                            options: {}
                        }

                        // Pie Chart Render Block
                        const pieChart = new Chart (
                            document.getElementById('pieChart'),
                            configPie
                        )

                        
                        // Bar Date Chart Date Setup Block
                        const barDateChartdata = {
                            labels: chartLabels,
                                datasets: [{
                                    label: '# of Searches',
                                    data: chartData,
                                    backgroundColor: [
                                        'rgba(255, 99, 132, 0.2)',
                                        'rgba(54, 162, 235, 0.2)',
                                        'rgba(255, 206, 86, 0.2)',
                                        'rgba(75, 192, 192, 0.2)',
                                        'rgba(153, 102, 255, 0.2)',
                                        'rgba(255, 159, 64, 0.2)'
                                    ],
                                    borderColor: [
                                        'rgba(255, 99, 132, 1)',
                                        'rgba(54, 162, 235, 1)',
                                        'rgba(255, 206, 86, 1)',
                                        'rgba(75, 192, 192, 1)',
                                        'rgba(153, 102, 255, 1)',
                                        'rgba(255, 159, 64, 1)'
                                    ],
                                    borderWidth: 1,
                                }]
                        }

                        // Bar Date Chart Config Block
                        const configBarDateChart = {
                            type: 'bar',
                            data: barDateChartdata,
                            responsive: true,
                            maintainAspectRation: false,
                            options: {
                                scales: {
                                    y: {
                                        beginAtZero: true
                                    }
                                }
                            }
                        }

                        // Bar Chart Render Block
                        const barDateChart = new Chart(
                            document.getElementById('barDateChart'),
                            configBarDateChart
                        )



                        
                    }
                })
            })
