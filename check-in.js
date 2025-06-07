// Automatically fills in Ryanair check-in forms at https://ryanair.com/trip/flights/checkin

function importData() {
    const csv = prompt("Paste CSV passenger data below, without header.\n\nFormat:\nFirst name, Last name, Nationality, Date of birth, Document type, Document number, Document country, Document expiry date")
    if(!csv) return
        
    // Parse CSV
    const passengerData = []
    const csvRows = csv.split("\n")
    for(const rowIndex in csvRows) {
        const csvRow = csvRows[rowIndex]
        const csvData = csvRow.split(",").map(d => d.trim()).filter(d => d)
        if(csvData.length != 8) throw `Invalid CSV row ${Number(rowIndex) + 1}: ${csvRow}`
        passengerData.push(csvData)
    }
    
    const checkInForm = document.querySelector(".paxs-form__main-content")
    
    function parseDate(date) {
        const parsed = /^(\d{4})-(\d{2})-(\d{2})$/.exec(date).slice(1)
        if(parsed.length != 3) throw `Invalid or non YYYY-MM-DD date ${date}`
        return parsed
    }
    
    function setDate(dateInputGroup, date) {
        const dateInputs = [
            dateInputGroup.querySelector("input[placeholder=YYYY]"),
            dateInputGroup.querySelector("input[placeholder=MM]"),
            dateInputGroup.querySelector("input[placeholder=DD]"),
        ]
        for(const index in dateInputs) {
            const input = dateInputs[index]
            input.value = date[index]
            input.eventListeners()[2]()
        }
    }
    
    // Loop through all passengers
    let importCount = 0
    for(const passenger of passengerData) {
        // Find passenger form
        let passengerForm
        for(const form of checkInForm.children) {
            const passengerName = form.querySelector(".pax-info__name")
            if(passengerName.innerText == `${passenger[0]} ${passenger[1]}`) {
                passengerForm = form
                break
            }
        }
        if(!passengerForm) throw `Unable to find "${passenger[0]} ${passenger[1]}" on page`
    
        // Nationality
        const nationality = passenger[2].toUpperCase()
        if(nationality.length != 2) throw `Invalid country code "${nationality}"`
        const nationalityInput = passengerForm.querySelector(".pax-info__nationality-wrapper input")
        nationalityInput.eventListeners()[3]()
        const nationalityOption = passengerForm.querySelector(`._autocomplete_menu__item[data-ref=${nationality}]`)
        if(!nationalityOption) throw `Unable to find nationality "${nationality}"`
        nationalityOption.eventListeners()[0]()
        nationalityInput.eventListeners()[1]()
    
        // Date of birth
        const dateOfBirth = parseDate(passenger[3])
        const dateOfBirthInputs = passengerForm.querySelector(".pax-info__dob-wrapper")
        setDate(dateOfBirthInputs, dateOfBirth)
    
        // Document type
        const documentType = passenger[4].toUpperCase()
        const documentTypeSelect = passengerForm.querySelector(".pax-info__document-type ry-dropdown")
        documentTypeSelect.querySelector("button").click()
        const documentTypeOptions = documentTypeSelect.querySelectorAll("ry-dropdown-item button")
        let documentTypeFound = false
        for(const typeOption of documentTypeOptions) {
            if(typeOption.innerText.toUpperCase().includes(documentType)) {
                documentTypeFound = true
                typeOption.click()
                break
            }
        }
        if(!documentTypeFound) throw `Unable to find document type "${documentType}"`
    
        // Document number
        const documentNumber = passenger[5]
        const documentNumberInput = passengerForm.querySelector(".pax-info__document-number input")
        documentNumberInput.value = documentNumber
        documentNumberInput.eventListeners()[3]()
        
        // Document country
        const documentCountry = passenger[6].toUpperCase()
        if(documentCountry.length != 2) throw `Invalid country code "${documentCountry}"`
        const documentCountryInput = passengerForm.querySelector(".pax-info__country-issue input")
        documentCountryInput.eventListeners()[3]()
        const documentCountryOption = passengerForm.querySelector(`._autocomplete_menu__item[data-ref=${documentCountry}]`)
        if(!documentCountryOption) throw `Unable to find document country "${documentCountry}"`
        documentCountryOption.eventListeners()[0]()
        documentCountryInput.eventListeners()[1]()
    
        // Document expiry date
        const expiryDate = parseDate(passenger[7])
        const expirtyDateInputs = passengerForm.querySelector(".pax-info__document-expiryDate")
        setDate(expirtyDateInputs, expiryDate)
        
        importCount += 1
    }
    alert(`Successfully filled in ${importCount} out of ${checkInForm.childElementCount} check-in forms`)
}

// Add button
{
    const checkInForm = document.querySelector(".paxs-form__main-content")
    const button = document.createElement("button")
    button.innerText = "Import data"
    button.setAttribute("style", "font-size:1em;margin:2em 0;display:block")
    button.onclick = () => {   
        try {
            importData()
        } catch(error) {
            alert(error)
        }   
    }
    checkInForm.insertAdjacentElement("beforebegin", button)
}
