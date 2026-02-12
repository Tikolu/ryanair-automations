// Automatically fills in Ryanair check-in forms at https://ryanair.com/trip/flights/checkin

const helpText = `Use a CSV or TSV file containing 7 columns in the following order:
- Passenger name (must match check-in form exactly)
- Nationality (2 letter country code, e.g. PL for Poland)
- Date of birth (in YYYY-MM-DD format)
- Document type (passport / id card)
- Document number
- Document country of issue (2 letter country code)
- Document expiry date (in YYYY-MM-DD format)`

function importData(csv) {
	// Parse CSV
	const passengerData = []
	const csvRows = csv.split("\n")
	let splitChar = ""
	if(csvRows[0].includes(",")) splitChar = ","
	else if(csvRows[0].includes("\t")) splitChar = "\t"
	else throw "Couldn't determine CSV delimeter. Ensure data is comma or tab separated"
	for(const rowIndex in csvRows) {
		const csvRow = csvRows[rowIndex]
		const csvData = csvRow.split(splitChar).map(d => d.trim()).filter(d => d)
		if(csvData.length != 7) throw `Invalid CSV row ${Number(rowIndex) + 1}: ${csvRow}`
		passengerData.push(csvData)
	}

	const checkInForm = document.querySelector(".paxs-form__main-content")

	function parseDate(date) {
		const parsed = /^(\d{4})-(\d{2})-(\d{2})$/.exec(date)?.slice(1)
		if(parsed?.length != 3) throw `Date ${date} is invalid. Ensure date is in YYYY-MM-DD format`
		return parsed
	}

	function setDate(dateInputGroup, date) {
		const inputs = dateInputGroup.querySelectorAll("input")
		const dateInputs = [
			inputs[2], // Year
			inputs[1], // Month
			inputs[0] // Day
		]
		for(const index in dateInputs) {
			const input = dateInputs[index]
			input.value = date[index]
			input.eventListeners()[2]()
		}
	}

	// Loop through all passengers
	const forms = [...checkInForm.children].filter(form => form.querySelector("input:not([type=checkbox]):not(:disabled)"))
	const finishedForms = []
	for(const passenger of passengerData) {
		// Find passenger form
		let passengerForm
		const searchName = passenger[0].toLowerCase()
		for(const form of forms) {
			// Skip already filled forms
			if(finishedForms.includes(form)) continue
			const passengerName = form.querySelector(".pax-info__name")
			if(passengerName.innerText.toLowerCase() == searchName) {
				passengerForm = form
				break
			}
		}
		if(!passengerForm) continue
		console.log(`Filling in form for "${passenger[0]}"`)

		// Nationality
		const nationality = passenger[1].toUpperCase()
		if(nationality.length != 2) throw `Invalid country code "${nationality}"`
		const nationalityInput = passengerForm.querySelector(".pax-info__nationality-wrapper input")
		if(!nationalityInput) throw `Unable to find nationality input for "${passenger[0]}"`
		nationalityInput.eventListeners()[3]()
		const nationalityOption = passengerForm.querySelector(`._autocomplete_menu__item[data-ref=${nationality}]`)
		if(!nationalityOption) throw `Unable to find nationality "${nationality}"`
		nationalityOption.eventListeners()[0]()
		nationalityInput.eventListeners()[1]()

		// Date of birth
		const dateOfBirth = parseDate(passenger[2])
		const dateOfBirthInputs = passengerForm.querySelector(".pax-info__dob-wrapper")
		if(!dateOfBirthInputs) throw `Unable to find date of birth inputs for "${passenger[0]}"`
		setDate(dateOfBirthInputs, dateOfBirth)

		// Document type
		const documentType = passenger[3].toUpperCase()
		const documentTypeSelect = passengerForm.querySelector(".pax-info__document-type ry-dropdown")
		if(!documentTypeSelect) throw `Unable to find document type input for "${passenger[0]}"`
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
		const documentNumber = passenger[4]
		const documentNumberInput = passengerForm.querySelector(".pax-info__document-number input")
		if(!documentNumberInput) throw `Unable to find document number input for "${passenger[0]}"`
		documentNumberInput.value = documentNumber
		documentNumberInput.eventListeners()[3]()

		// Document country
		const documentCountry = passenger[5].toUpperCase()
		if(documentCountry.length != 2) throw `Invalid country code "${documentCountry}"`
		const documentCountryInput = passengerForm.querySelector(".pax-info__country-issue input")
		if(!documentCountryInput) throw `Unable to find document country input for "${passenger[0]}"`
		documentCountryInput.eventListeners()[3]()
		const documentCountryOption = passengerForm.querySelector(`._autocomplete_menu__item[data-ref=${documentCountry}]`)
		if(!documentCountryOption) throw `Unable to find document country "${documentCountry}"`
		documentCountryOption.eventListeners()[0]()
		documentCountryInput.eventListeners()[1]()

		// Document expiry date
		const expiryDate = parseDate(passenger[6])
		const expiryDateInputs = passengerForm.querySelector(".pax-info__document-expiryDate")
		if(!expiryDateInputs) throw `Unable to find document expiry date inputs for "${passenger[0]}"`
		setDate(expiryDateInputs, expiryDate)

		finishedForms.push(passengerForm)
	}

	if(finishedForms.length == 0) throw "Unable to find any passengers"

	let message = `Imported ${finishedForms.length} out of ${forms.length} check-in forms`
	if(finishedForms.length < forms.length) {
		message += "\n\nThe following passengers were not found in the import data:"
		for(const form of forms) {
			if(finishedForms.includes(form)) continue
			message += `\n- ${form.querySelector(".pax-info__name")?.innerText}`
		}
	}
	alert(message)
}

function addImportButton(form) {
	// Create import button
	const button = document.createElement("button")
	button.innerText = "Import data from CSV file"

	// Style button
	button.classList.add("ry-button--anchor-blue")
	button.style.marginLeft = "1em"
	button.style.fontSize = "0.875em"
	button.style.cursor = "pointer"

	// Create help button
	const helpButton = document.createElement("button")
	helpButton.innerText = "?"
	helpButton.style.backgroundColor = "#166bc8"
	helpButton.style.color = "white"
	helpButton.style.border = "none"
	helpButton.style.borderRadius = "0.25em"
	helpButton.style.cursor = "pointer"

	helpButton.onclick = () => alert(helpText)

	// Insert buttons before check-in form
	form.insertAdjacentElement("beforebegin", button)
	form.insertAdjacentElement("beforebegin", helpButton)

	// Create file input
	const fileInput = document.createElement("input")
	fileInput.type = "file"
	fileInput.accept = ".csv,.tsv"
	fileInput.onchange = () => {
		// Read file
		const file = fileInput.files[0]
		const reader = new FileReader()
		reader.onload = () => {
			button.disabled = true
			try {
				importData(reader.result)
			} catch(error) {
				console.error(error)
				alert(error)
			}
			button.disabled = false
		}
		reader.readAsText(file)
	}

	button.onclick = () => {
		fileInput.value = null
		fileInput.showPicker()
	}
}

function setupImport() {
	let checkInForm = document.querySelector(".paxs-form__main-content")

	// Add button immediately
	if(checkInForm) {
		addImportButton(checkInForm)

	// Wait for check-in form to appear
	} else {
		const interval = setInterval(() => {
			checkInForm = document.querySelector(".paxs-form__main-content")
			if(checkInForm) {
				addImportButton(checkInForm)
				clearInterval(interval)
			}
		}, 500)
	}
}

// Run setup on page load
window.addEventListener("load", setupImport)