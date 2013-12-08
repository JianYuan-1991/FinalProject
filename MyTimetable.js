function showTab(id) {
	if (id == 'add') {
		document.getElementById("add").style.display = 'inline';
		document.getElementById("list").style.display = 'none';
		document.getElementById("bar").setCaption("Add Timetable");
		
		
	} else if (id == 'list') {
		document.getElementById('list').style.display = 'inline';
		document.getElementById('add').style.display = 'none';
		document.getElementById("bar").setCaption("List");
		
	}  
}



function createDB() {
    var db = dbNamespace.db;
    db.transaction(function(tx) {
		
       
	tx.executeSql("CREATE TABLE IF NOT EXISTS Timetable (Id INTEGER PRIMARY KEY ASC)", 
        [], 
        function(trans) {
			
			
		
		    
            alert("Database timetable created!");
			
			
        				}, 
        function(trans, error) {
            // handle the error
            alert("Database timetable creation error: " + error);
        						}
    )});
}


	

function onSaveSuccess(contact) {
 console.log("Contact with id=" + contact.id + " is saved!");
 alert(contact.id);
 ContactId = contact.id;
 
 
	
    var db = dbNamespace.db;
	var des=document.getElementsByName("des")[0].value;
	alert("bbbbb"+  ContactId);
    db.transaction(function(tx) {
        tx.executeSql("INSERT INTO Contacts (id,des) VALUES(?,?)",
            [ContactId,des],
            function(trans, result) {
                // handle the success
				alert("inserted" + ContactId);
				ContactsAdded(des);
				
                
            }, 
            function(trans, error) {
                 
                 alert(error);
            }
     )});
 
 
 
}
function onSaveError(error) {
 console.log("Error saving contact: " + error.code);
}


function Save() {
 var contacts = blackberry.pim.contacts,
 ContactField = contacts.ContactField,
 name = {},
 mobilePhone = { type: ContactField.HOME, value: document.getElementById("mp").value },
 workPhone = { type: ContactField.WORK, value: document.getElementById("wp").value },
 workEmail = { type: ContactField.WORK, value: document.getElementById("we").value },
 homeEmail = { type: ContactField.HOME, value: document.getElementById("he").value },
 
 
 
 contact;
 name.familyName = document.getElementById("ln").value;
 name.givenName = document.getElementById("fn").value;
 contact = contacts.create({
 "displayName":document.getElementById("ln").value + " " + document.getElementById("fn").value,
 "name": name,
 "phoneNumbers": [workPhone,mobilePhone],
 "emails": [workEmail, homeEmail]
 });
 contact.save(onSaveSuccess, onSaveError);
	
	
}


function ContactsAdded(ct){
	var bbcontacts
	Fields = ["id", "name", "emails","phonenumbers"];
	FindSucess = function(contacts){
		bbcontacts=contacts;
		
	 var db = dbNamespace.db;
	 db.transaction(function(tx) {
		 tx.executeSql('SELECT * FROM Contacts', [], 
		 
		 	function(trans, result) {
            var rowOutput ="";
			var items = [], 
		    item;
			var index=-1000;
	
            for(var i=0; i < result.rows.length; i++) {
				
				var found = false;
				var bbcid = result.rows.item(i).id;
				for(var j=0; j<bbcontacts.length;j++){
			
					if ( parseInt( result.rows.item(i).id ) ==  parseInt( bbcontacts[j].id )  )
					{	
						found= true;
						index=j;
						break;
						
					}
													  }
					
					
						 if (found){
							
							item = document.createElement('div');
							item.setAttribute('data-bb-type','item');
							item.setAttribute('data-bb-title', bbcontacts[index].name.givenName );
							item.setAttribute('data-img',result.rows.item(i).img);
							
							item.setAttribute('data-id', result.rows.item(i).id );
							item.setAttribute('data-desc', result.rows.item(i).des );
							alert("3");
							
							item.onclick = function() {
								alert('clicked');
							var chosen = document.getElementById("contactlist").selected;
							getActiveContact(chosen.getAttribute('data-id'), chosen.getAttribute('data-desc'));
							
														};
							
									items.push(item);
									
							}
				   
			}
			document.getElementById("contactlist").refresh(items);
				
				
            }, 
            function(trans, error) { 
			
			alert ("in error" + error); 
			}
                
				 
                 
	 );
	 });
		
		
	}
	
	FindError = function(error){
		
		
		}
		
	findOptions = new blackberry.pim.contacts.ContactFindOptions();
	
	blackberry.pim.contacts.find(Fields, findOptions,FindSucess,FindError);
	
	
	
}

function Delete(id){
	var db = dbNamespace.db;

	
	 db.transaction(function(tx) {
        tx.executeSql("DELETE FROM Contacts WHERE id = " + id,
            [ContactId,des],
            function(trans, result) {
                // handle the success
				alert("DElete" + ContactId);
				
				
                
            }, 
            function(trans, error) {
                 // handle the error
                 alert(error);
            }
     )});
	
	
	}

   function invokeCamera(){
		var model = blackberry.invoke.card.CAMERA_MODE_PHOTO;
	blackberry.invoke.card.invokeCamera(model,
	
	function(image){
		alert()
		document.getElementById("img").src = "file://" + img;
		updateimg(img);
		},
	function(cuz){
		
		alert(cuz);
		
		},
	function(msg){
		
		alert(msg);
		
		}
   );
     
   }
   
 function updateimg(img){
	 
	 var db = dbNamespace.db;
	db.transaction(	
			function(tx) {
				tx.executeSql(
					"UPDATE Contacts SET img = ? WHERE id = ?",[img,currentId]
					,
					function(trans, result) {
						// handle the success
						alert("Update img: " + currentId);
					}, 
					function(trans, error) {
						 // handle the error
						 alert("Error updating " + currentId + ": " + error);
					})
			});

	 
	 
	 
	 }

 function getActiveContact(id,desc){
	 
	 var contacts = blackberry.pim.contacts;
	 var contact = contacts.getContact(id);
	
	 
	 alert("1111"+ contact.name.givenName);
	  //bb.pushScreen("detail.html", "detail");
	bb.pushScreen("detail.html", "detail", {'fname':contact.name.givenName,  'lname':contact.name.familyName,'workphone':contact.phoneNumbers[0].value,
	 'HomePhone':contact.phoneNumbers[1].value,
	 'HomeEmail':contact.emails[0].value,
	 'WorkEmail':contact.emails[1].value,
	 'desc':desc
	 
	 });
	 
	 
	 }// JavaScript Document
