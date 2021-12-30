
            const searchID = []
            const searchQueries = []
            const searchHits = []
            const searchTime = []
            const userID = []

            const testLabel = []
            const testData = []

            // Parse CSV - Convert to JSON Object

            const uploadconfirm = document.getElementById('uploadconfirm').addEventListener('click', () => {
                Papa.parse(document.getElementById('uploadfile').files[0], 
                {
                    download: true,
                    header: true,
                    skipEmptyLines: true,
                    complete: function(results){

                        let allData = results.data

                        // Create object of search queries with 0 hits
                        const noHits = allData.filter(noHit => noHit.hits === '0')

                        // Create object of search queries with > 0 hits
                        const hits = allData.filter(hit => hit.hits !== '0')

                        // Consolidate duplicate search queries
                        const mergeHits = {}

                        for (let row of hits) {
                            if(!mergeHits[row.query]){
                                mergeHits[row.query] = 1
                            } else {
                                mergeHits[row.query] ++
                            }
                        }

                        // Add Key/Value to duplicate search query object
                        const newMerge = Object.entries(mergeHits).map(([key, value]) => ({key, value}))

                        const noSingle = newMerge.filter(single => single.value > 4)

                        // Create unique arrays of object values
                        for(i=0; i<newMerge.length; i++){
                            searchQueries.push(newMerge[i].key)
                            searchHits.push(newMerge[i].value)
                        }

                        for(i=0; i<noSingle.length; i++){
                            testLabel.push(noSingle[i].key)
                            testData.push(noSingle[i].value)
                        }
                        

                        console.log(noSingle)
                        
                        // Remove uneccesary information from object
                        noHits.forEach(i => {delete i.id; delete i.time; delete i.user_id; delete i.ip})

                        const zeroHits = {}

                        for (let row of noHits){
                            if (!zeroHits[row.query]){
                                zeroHits[row.query] = 1
                            } else {
                                zeroHits[row.query] ++
                            }
                        }

                        const newObj = Object.entries(zeroHits).map(([key, value]) => ({key, value}))

                        // Create 'no hits' table

                        let table = document.querySelector('table')
                        let headerRow = document.createElement('tr')
                        let info = Object.keys(newObj[0])
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
                        generateTable(table, newObj)
                        

                        // Bar Chart Setup Block
                        const data = {
                            labels: testLabel,
                                datasets: [{
                                    label: '# of Searches',
                                    data: testData,
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
                            labels: testLabel,
                                datasets: [{
                                    label: '# of Votes',
                                    data: testData,
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
                            type: 'pie',
                            data: dataPie,
                            options: {}
                        }

                        // Pie Chart Render Block
                        const pieChart = new Chart (
                            document.getElementById('pieChart'),
                            configPie
                        )

                        // function updateChart(label){
                        //     barChart.data.datasets[0].label = label
                        //     if (label === 'searchID') {
                        //         barChart.data.datasets[0].data = searchID
                        //     }
                        //     if (label === 'searchQueries') {
                        //         barChart.data.datasets[0].data = searchQueries
                        //     }
                        //     if (label === 'searchHits') {
                        //         barChart.data.datasets[0].data = searchHits
                        //     }
                        //     if (label === 'searchTime') {
                        //         barChart.data.datasets[0].data = searchTime
                        //     }
                        //     if (label === 'userID') {
                        //         barChart.data.datasets[0].data = userID
                        //     }
                        //     barChart.update()
                        // }
                    }
                })
            })
