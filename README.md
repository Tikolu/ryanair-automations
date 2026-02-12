# Ryanair Check-in data import extension
Ryanair's check-in forms are available at `ryanair.com/trip/flights/checkin`. This browser extension automatically fills in passenger details on these forms using data from a CSV or TSV file.

Download the Chrome extension [here](https://chromewebstore.google.com/detail/lpagepfnedoodhcjfoipkbaibimhbcad).

### Use a CSV or TSV file containing 7 columns in the following order:
- Passenger name (must match check-in form exactly)
- Nationality (2 letter country code, e.g. PL for Poland)
- Date of birth (in YYYY-MM-DD format)
- Document type (passport / id card)
- Document number
- Document country of issue (2 letter country code)
- Document expiry date (in YYYY-MM-DD format)

### Example data structure
| Name             | Nationality | Date of birth | Document type | Document number | Document country | Document expiry |
|------------------|-------------|---------------|---------------|-----------------|------------------|-----------------|
| Jan Kowalski     | PL          | 2001-12-05    | Passport      | JT0001234       | PL               | 2030-03-01      |
| Anna Nowak       | PL          | 1998-06-18    | ID Card       | PX0001234       | IE               | 2025-12-21      |
| Connor O'Connor  | IE          | 2011-09-09    | Passport Card | PC0001234       | IE               | 2032-06-30      |
| Katarzyna Wójcik | PL          | 2003-08-26    | Passport      | EY0001234       | IE               | 2027-07-08      |


---

# Automating group booking name input
For group bookings, Ryanair requires all passenger names to be entered on a form at `onlineform.ryanair.com/submit-names/<case-no>`. This script automatically fills in this form from CSV or TSV data.

### Example data structure
| Title | First Name | Last Name  | Type         |
|-------|------------|------------|--------------|
| Mr    | Jan        | Kowalski   | Adult        |
| Ms    | Anna       | Nowak      | Teen         |
| Mr    | Piotr      | Wiśniewski | Child        |
| Ms    | Katarzyna  | Wójcik     | Adult        |
| Mr    | Tomasz     | Kamiński   | Teen         |
| Ms    | Zofia      | Dąbrowska  | Child        |
| Mr    | Marek      | Zieliński  | Adult        |
| Ms    | Magdalena  | Szymańska  | Teen         |

### Running the script
1. Navigate to the "Add passenger names" form
   
   <img src=https://github.com/user-attachments/assets/7480d3a1-2a97-4fc4-9805-d452ceacddd6 height=250px>

2. Clear your browser's URL bar, and type in `javascript:` - (the word "javascript" followed by a colon)
3. Paste in the following code just after the colon, and press enter:
   ```js
   function importData(){let t=prompt("Paste CSV passenger data below, without header.\n\nFormat:\nTitle, First name, Last name, Type");if(!t)return;let e=[],n=t.split("\n"),l="";if(n[0].includes(","))l=",";else if(n[0].includes("\t"))l="\t";else throw"Couldn't determine CSV delimeter. Ensure data is comma or tab separated";for(let o in n){let a=n[o],i=a.split(l).map(t=>t.trim()).filter(t=>t);if(4!=i.length)throw`Invalid CSV row ${Number(o)+1}: ${a}`;e.push(i)}let r=document.querySelectorAll(".datatable-container formly-group"),s=0;for(let c in r){let u=r[c];if(!(u instanceof HTMLElement))continue;let p=e[c];if(!p)break;let d=u.querySelectorAll("input, select");d[1].value=p[1],d[1].dispatchEvent(new Event("input")),d[2].value=p[2],d[2].dispatchEvent(new Event("input"));let f=p[3].toUpperCase(),b=!1;for(let m of d[3].options)if(f==m.value||m.text.toUpperCase().includes(f)){if(m.disabled||d[3].disabled&&m.value!=d[3].value)throw u.scrollIntoView(),`Type "${f}" is not available for slot ${Number(c)+1}`;m.selected=!0,b=!0;break}if(!b)throw u.scrollIntoView(),`Unknown type "${f}" for slot ${Number(c)+1}`;d[3].dispatchEvent(new Event("change"));let w=p[0].toUpperCase(),h=!1;for(let v of d[0].options)if(w==v.value||w==v.text.toUpperCase()){if(v.disabled)throw u.scrollIntoView(),`Title "${w}" is not available for slot ${Number(c)+1}`;v.selected=!0,h=!0;break}if(!h)throw u.scrollIntoView(),`Unknown title "${w}" for slot ${Number(c)+1}`;d[0].dispatchEvent(new Event("change")),s+=1}alert(`Successfully imported ${s} of ${e.length} entries`)}const datatableContainer=document.querySelector(".datatable-container"),button=document.createElement("button");button.innerText="Import data",button.setAttribute("style","font-size:1em;margin:2em 0"),button.onclick=()=>{try{importData()}catch(t){alert(t)}},button.onclick(),datatableContainer.insertAdjacentElement("afterbegin",button);
   ```
4. After a few seconds, an "Import data" button should appear at the top of the form - press it
5. Paste your data into the dialog box and press enter
