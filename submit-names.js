// Automatically imports data for group bookings at https://onlineform.ryanair.com/submit-names

function importData() {
    const csv = prompt("Paste CSV passenger data below, without header.\n\nFormat:\nTitle, First name, Last name, Type")
    if(!csv) return
        
    // Parse CSV
    const passengerData = []
    const csvRows = csv.split("\n")
    for(const rowIndex in csvRows) {
        const csvRow = csvRows[rowIndex]
        const csvData = csvRow.split(",").map(d => d.trim()).filter(d => d)
        if(csvData.length != 4) throw `Invalid CSV row ${Number(rowIndex) + 1}: ${csvRow}`
        passengerData.push(csvData)
    }
    
    // Loop through all rows
    const formRows = document.querySelectorAll(".datatable-container formly-group")
    let importCount = 0
    for(const rowIndex in formRows) {
        const row = formRows[rowIndex]
        if(!(row instanceof HTMLElement)) continue
    
        // Get passenger data
        const passenger = passengerData[rowIndex]
        if(!passenger) break
    
        // Get all input fields from row
        const rowFields = row.querySelectorAll("input, select")
    
        // First name
        rowFields[1].value = passenger[1]
    
        // Last name
        rowFields[2].value = passenger[2]
    
        // Type
        const passengerType = passenger[3].toUpperCase()
        let typeSet = false
        for(const option of rowFields[3].options) {
            if(passengerType == option.value || option.text.toUpperCase().includes(passengerType)) {
                if(option.disabled || rowFields[3].disabled && option.value != rowFields[3].value) {
                    row.scrollIntoView()
                    throw `Type "${passengerType}" is not available for slot ${Number(rowIndex) + 1}`
                }
                option.selected = true
                typeSet = true
                break
            }
        }
        if(!typeSet) {
            row.scrollIntoView()
            throw `Unknown type "${passengerType}" for slot ${Number(rowIndex) + 1}`
        }
    
        // Title
        const passengerTitle = passenger[0].toUpperCase()
        let titleSet = false
        for(const option of rowFields[0].options) {
            if(passengerTitle == option.value || passengerTitle == option.text.toUpperCase()) {
                if(option.disabled) {
                    row.scrollIntoView()
                    throw `Title "${passengerTitle}" is not available for slot ${Number(rowIndex) + 1}`
                }
                option.selected = true
                titleSet = true
                break
            }
        }
        if(!titleSet) {
            row.scrollIntoView()
            throw `Unknown title "${passengerTitle}" for slot ${Number(rowIndex) + 1}`
        }
        
        importCount += 1
    }
    alert(`Successfully imported ${importCount} of ${passengerData.length} entries`)
}
