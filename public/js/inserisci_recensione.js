function risposta() {	//stampa la tabella	
    var xml = new XMLHttpRequest();
   
    let params = new URLSearchParams(window.location.href);
        
    var stelle = document.getElementById('stelle').value;
    var commento = document.getElementById('commento').value;
    //document.write(anno, mese)
    xml.open("POST", '{nome_server}/ristoranti/${ristorante_id}/recensioni', true);
    xml.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xml.send("ristorante_id="+ristorante_id+"&stelle="+stelle+"&commento="+commento);
}