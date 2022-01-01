
            const searchID = []
            const searchQueries = []
            const searchHits = []
            const searchTime = []
            const userID = []

            const chartLabels = []
            const chartData = []

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

                        console.log(hits)

                        // Consolidate search queries, and count search quanity
                        const mergeHits = {}

                        for (let row of hits) {
                            if(!mergeHits[row.query]){
                                mergeHits[row.query] = 1
                                console.log(parseInt(mergeHits[row.hits]) + 10)
                                
                                // mergeHits[row.hits] = mergeHits[row.hits]
                            } else {
                                mergeHits[row.query] ++
                            }
                        }

                        console.log(mergeHits)

                        // Add keys to values
                        const newMerge = Object.entries(mergeHits).map(([key, value]) => ({key, value}))


                        // Filter data sent to Chart.js
                        const noSingle = newMerge.filter(single => single.value > 20)

                        // Create unique arrays of object values for Chart JS X and Y axis
                        for(i=0; i<newMerge.length; i++){
                            searchQueries.push(newMerge[i].key)
                            searchHits.push(newMerge[i].value)
                        }

                        for(i=0; i<noSingle.length; i++){
                            chartLabels.push(noSingle[i].key)
                            chartData.push(noSingle[i].value)
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
