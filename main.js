            let display = 'none'
            let lineDisplay = 'none'

            // Parse CSV - Convert to JSON Object
            const uploadconfirm = document.getElementById('uploadconfirm').addEventListener('click', () => {
                display = 'flex'
                lineDisplay='block'
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


                        
                        // convert string numbers to int

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


                        // Add result objects to array

                        let newResult = [...result]

                        // Remove uneccesary information

                        newResult.forEach(i => {delete i.id; delete i.time; delete i.user_id; delete i.ip})

                        // Create object that consolidates search queries, counts the duplicates, then adds search hits
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

                        // Add holder objects to array
                        let finalSearchTally = Object.entries(holder).map(value => value[1])

                        // Create 3 new filtered objects based on search query quantity from finalSearchTally object - Least popular obj, Average obj, Most popular obj
                        const popHits = finalSearchTally.filter(popular => popular.entries >= 20)
                        const avgHits = finalSearchTally.filter(avg => avg.entries >= 8 && avg.entries < 20)
                        const leastHits = finalSearchTally.filter(least => least.entries < 8 && least.entries > 2)
                        const oneOff = finalSearchTally.filter(least => least.entries <=2 )

                        // Remove any invalid search terms (ex: thinkapp/index)
                        const noThinkPop = popHits.filter(function(el){
                            return !el.query.includes('index')
                        })

                        const noThinkAvg = avgHits.filter(function(el){
                            return !el.query.includes('index')
                        })
                        const noThinkLeastPop = leastHits

                        const noThinkOneOff = oneOff

                        // Push data from objects into arrays to be displayed by charts
                        const mostPopQueries = []
                        const mostPopHits = []
                        const mostPopEntries = []

                        const avgPopQueries = []
                        const avgPopHits = []
                        const avgPopEntries = []

                        const leastPopQueries = []
                        const leastPopHits = []
                        const leastPopEntries = []

                        const rareQueries = []
                        const rareHits = []
                        const rareEntries = []


                        for(let row of noThinkPop){
                            mostPopEntries.push(row.entries)
                            mostPopQueries.push(row.query)
                            mostPopHits.push(row.hits)
                        }

                        for(let row of noThinkAvg){
                            avgPopEntries.push(row.entries)
                            avgPopQueries.push(row.query)
                            avgPopHits.push(row.hits)
                        }

                        for(let row of noThinkLeastPop){
                            leastPopEntries.push(row.entries)
                            leastPopQueries.push(row.query)
                            leastPopHits.push(row.hits)
                        }

                        for(let row of noThinkOneOff){
                            rareEntries.push(row.entries)
                            rareQueries.push(row.query)
                            rareHits.push(row.hits)
                        }


                        // Charts

                        // Change display property to render div upon data load
                        document.getElementById('chartContainer').style.display = display
                        document.getElementById('avgChartContainer').style.display = display
                        document.getElementById('break').style.display = lineDisplay
                        document.getElementById('break2').style.display = lineDisplay
                        document.getElementById('zeroHitsTable').style.display = display
                        document.getElementById('leastPopChartContainer').style.display = display


                        const scroll = document.getElementById('scrollTo')
                        scroll.scrollIntoView()


                        document.getElementById('barChartLabel').innerHTML = "Most Popular Search Queries"
                        document.getElementById('barChartLabelSubHead').innerHTML = "View most popular search terms and number of times those keywords were entered. Any keyword searched 20 times or more is considered popular."

                        document.getElementById('avgBarChartLabel').innerHTML = "Average Popularity Search Queries"
                        document.getElementById('avgBarChartLabelSubHead').innerHTML = "View average popularity search terms and number of times those keywords were entered. Any keyword searched between 10 and 20 times is considered average."

                        document.getElementById('leastPopChartLabel').innerHTML = "Least Popular Search Queries"
                        document.getElementById('leastPopBarChartLabelSubHead').innerHTML = "View least popular search terms and number of times those keywords were entered. Any keyword searched between 3 and 10 times is considered least popular. Keywords searched fewer than 3 times are available upon request."


                        // All bar chart setup

                        // Most Popular Searches Bar Chart Setup Block
                        const data = {
                            labels: mostPopQueries,
                                datasets: [{
                                    label: '# of Searches Per Keyword',
                                    data: mostPopEntries,
                                    backgroundColor: [
                                        'rgba(255, 99, 132, 0.2)',
                                        'rgba(54, 162, 235, 0.2)',
                                        'rgba(255, 206, 86, 0.2)',
                                        'rgba(75, 192, 192, 0.2)',
                                        'rgba(153, 102, 255, 0.2)',
                                        'rgba(255, 159, 64, 0.2)',
                                        'rgba(12, 100, 100, 0.2)',
                                        'rgba(200, 180, 53, 0.2)',
                                        'rgba(241, 176, 99, 0.2)',
                                        'rgba(112, 207, 180, 0.2)'
                                    ],
                                    borderColor: [
                                        'rgba(255, 99, 132, 1)',
                                        'rgba(54, 162, 235, 1)',
                                        'rgba(255, 206, 86, 1)',
                                        'rgba(75, 192, 192, 1)',
                                        'rgba(153, 102, 255, 1)',
                                        'rgba(255, 159, 64, 1)',
                                        'rgba(12, 100, 100, 1)',
                                        'rgba(200, 180, 53, 1)',
                                        'rgba(241, 176, 99, 1)',
                                        'rgba(112, 207, 180, 1)'
                                    ],
                                    borderWidth: 3,
                                }]
                        }

                        // Most Popular Searches Bar Chart Config Block
                        const config = {
                            type: 'bar',
                            data,
                            responsive: true,
                            maintainAspectRation: false,
                            options: {
                                scales: {
                                    y: {
                                        beginAtZero: true,
                                    }
                                }
                            }
                        }

                        // Most Popular Searches Bar Chart Render Block
                        const barChart = new Chart(
                            document.getElementById('barChart'),
                            config
                        )
                        
                        // Avg Popular Searches Bar Chart Setup Block
                        const avgBarData = {
                            labels: avgPopQueries,
                                datasets: [{
                                    label: '# of Searches Per Keyword',
                                    data: avgPopEntries,
                                    backgroundColor: [
                                        'rgba(255, 99, 132, 0.2)',
                                        'rgba(54, 162, 235, 0.2)',
                                        'rgba(255, 206, 86, 0.2)',
                                        'rgba(75, 192, 192, 0.2)',
                                        'rgba(153, 102, 255, 0.2)',
                                        'rgba(255, 159, 64, 0.2)',
                                        'rgba(12, 100, 100, 0.2)',
                                        'rgba(200, 180, 53, 0.2)',
                                        'rgba(241, 176, 99, 0.2)',
                                        'rgba(112, 207, 180, 0.2)'
                                    ],
                                    borderColor: [
                                        'rgba(255, 99, 132, 1)',
                                        'rgba(54, 162, 235, 1)',
                                        'rgba(255, 206, 86, 1)',
                                        'rgba(75, 192, 192, 1)',
                                        'rgba(153, 102, 255, 1)',
                                        'rgba(255, 159, 64, 1)',
                                        'rgba(12, 100, 100, 1)',
                                        'rgba(200, 180, 53, 1)',
                                        'rgba(241, 176, 99, 1)',
                                        'rgba(112, 207, 180, 1)'
                                    ],
                                    borderWidth: 3,
                                }]
                        }

                        // Avg Popular Searches Bar Chart Config Block
                        const avgBarConfig = {
                            type: 'bar',
                            data: avgBarData,
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

                        // Avg Popular Searches Bar Chart Render Block
                        const avgBarChart = new Chart(
                            document.getElementById('avgBarChart'),
                            avgBarConfig
                        )

                         // Least Popular Searches Bar Chart Setup Block
                        const leastPopData = {
                            labels: leastPopQueries,
                                datasets: [{
                                    label: '# of Searches Per Keyword',
                                    data: leastPopEntries,
                                    backgroundColor: [
                                        'rgba(255, 99, 132, 0.2)',
                                        'rgba(54, 162, 235, 0.2)',
                                        'rgba(255, 206, 86, 0.2)',
                                        'rgba(75, 192, 192, 0.2)',
                                        'rgba(153, 102, 255, 0.2)',
                                        'rgba(255, 159, 64, 0.2)',
                                        'rgba(12, 100, 100, 0.2)',
                                        'rgba(200, 180, 53, 0.2)',
                                        'rgba(241, 176, 99, 0.2)',
                                        'rgba(112, 207, 180, 0.2)'
                                    ],
                                    borderColor: [
                                        'rgba(255, 99, 132, 1)',
                                        'rgba(54, 162, 235, 1)',
                                        'rgba(255, 206, 86, 1)',
                                        'rgba(75, 192, 192, 1)',
                                        'rgba(153, 102, 255, 1)',
                                        'rgba(255, 159, 64, 1)',
                                        'rgba(12, 100, 100, 1)',
                                        'rgba(200, 180, 53, 1)',
                                        'rgba(241, 176, 99, 1)',
                                        'rgba(112, 207, 180, 1)'
                                    ],
                                    borderWidth: 3,
                                }]
                        }

                        // Least Popular Searches Bar Chart Config Block
                        const leastPopConfig = {
                            type: 'bar',
                            data:leastPopData,
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

                        // Least Popular Searches Bar Chart Render Block
                        const leastPopBarChart = new Chart(
                            document.getElementById('leastPopBarChart'),
                            leastPopConfig
                        )
                        

                        // All doughnut chart setup

                        // Most Popular Searches Doughnut Chart Setup Block
                        const dataPie = {
                            labels: mostPopQueries,
                                datasets: [{
                                    label: 'Search Data',
                                    data: mostPopEntries,
                                    backgroundColor: [
                                        'rgba(255, 99, 132, 0.2)',
                                        'rgba(54, 162, 235, 0.2)',
                                        'rgba(255, 206, 86, 0.2)',
                                        'rgba(75, 192, 192, 0.2)',
                                        'rgba(153, 102, 255, 0.2)',
                                        'rgba(255, 159, 64, 0.2)',
                                        'rgba(12, 100, 100, 0.2)',
                                        'rgba(200, 180, 53, 0.2)',
                                        'rgba(241, 176, 99, 0.2)',
                                        'rgba(112, 207, 180, 0.2)'
                                    ],
                                    borderColor: [
                                        'rgba(255, 99, 132, 1)',
                                        'rgba(54, 162, 235, 1)',
                                        'rgba(255, 206, 86, 1)',
                                        'rgba(75, 192, 192, 1)',
                                        'rgba(153, 102, 255, 1)',
                                        'rgba(255, 159, 64, 1)',
                                        'rgba(12, 100, 100, 1)',
                                        'rgba(200, 180, 53, 1)',
                                        'rgba(241, 176, 99, 1)',
                                        'rgba(112, 207, 180, 1)'
                                    ],
                                    borderWidth: 3
                                }]
                        }

                        // Most Popular Searches Doughnut Chart Config Block
                        const configPie = {
                            type: 'doughnut',
                            data: dataPie,
                            maintainAspectRation: false,
                            options: {}
                        }

                        // Most Popular Searches Doughnut Chart Render Block
                        const pieChart = new Chart (
                            document.getElementById('pieChart'),
                            configPie
                        )


                        // Create 'no hits' table

                        // Change display property to render table upon data load
                        document.getElementById('chartContainer').style.display = display

                        // Table Label
                        document.getElementById('noHitsTableLabel').innerHTML = "Searches Resulting in 0 Hits"

                        let tbl = document.createElement('table')
                        document.getElementById('zeroHitsTable').appendChild(tbl)
                        tbl.classList.add("table-style")

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
                    }
                })
            })