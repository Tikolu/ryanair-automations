## Automating group booking name input
For group bookings, Ryanair requires all passenger names to be entered on a form at `onlineform.ryanair.com/submit-names/<case-no>`. This script automatically fills in this form from CSV or TSV data.

### Example data structure
| Title | First Name | Last Name  | Type         |
|:-----:|:----------:|:----------:|:------------:|
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
   
   <img src=https://github.com/user-attachments/assets/95c70771-09c6-46ed-9527-a7ea70b14233 height=250px>

2. Clear your browser's URL bar, and type in `javascript:` - (the word "javascript" followed by a colon)
3. Paste in the following code just after the colon, and press enter:
   ```js
   function importData(){let t=prompt("Paste CSV passenger data below, without header.\n\nFormat:\nTitle, First name, Last name, Type");if(!t)return;let e=[],l=t.split("\n"),o="";if(l[0].includes(","))o=",";else if(l[0].includes("	"))o="	";else throw"Couldn't determine CSV delimeter. Ensure data is comma or tab separated";for(let n in l){let a=l[n],i=a.split(o).map(t=>t.trim()).filter(t=>t);if(4!=i.length)throw`Invalid CSV row ${Number(n)+1}: ${a}`;e.push(i)}let r=document.querySelectorAll(".datatable-container formly-group"),s=0;for(let u in r){let c=r[u];if(!(c instanceof HTMLElement))continue;let f=e[u];if(!f)break;let d=c.querySelectorAll("input, select");d[1].value=f[1],d[2].value=f[2];let p=f[3].toUpperCase(),b=!1;for(let m of d[3].options)if(p==m.value||m.text.toUpperCase().includes(p)){if(m.disabled||d[3].disabled&&m.value!=d[3].value)throw c.scrollIntoView(),`Type "${p}" is not available for slot ${Number(u)+1}`;m.selected=!0,b=!0;break}if(!b)throw c.scrollIntoView(),`Unknown type "${p}" for slot ${Number(u)+1}`;let w=f[0].toUpperCase(),h=!1;for(let _ of d[0].options)if(w==_.value||w==_.text.toUpperCase()){if(_.disabled)throw c.scrollIntoView(),`Title "${w}" is not available for slot ${Number(u)+1}`;_.selected=!0,h=!0;break}if(!h)throw c.scrollIntoView(),`Unknown title "${w}" for slot ${Number(u)+1}`;s+=1}alert(`Successfully imported ${s} of ${e.length} entries`)}const datatableContainer=document.querySelector(".datatable-container"),button=document.createElement("button");button.innerText="Import data",button.setAttribute("style","font-size:1em;margin:2em 0"),button.onclick=()=>{try{importData()}catch(t){alert(t)}},button.onclick(),datatableContainer.insertAdjacentElement("afterbegin",button);
   ```
4. After a few seconds, a dialog box should appear, paste in your data in CSV or TSV format. If you need to import again, just click the newly added "Import data" button at the top of the form.
