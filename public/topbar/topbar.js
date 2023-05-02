const topbar = document.getElementById("topbar");

async function main() {
    let response = await fetch("/topbar/topbar.html");
    if (!response.ok) {
        console.error("Errore durante il caricamento della topbar");
        return;
    }

    let topbar = await response.text();
    
    document.getElementById("topbar").innerHTML = topbar;
}

main();
