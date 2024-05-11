function prepareButtons() {
    const sidebar = document.querySelector(".sidebar");
    const closeBtn = document.querySelector("#btn");
    const searchBtn = document.querySelector(".bx-search");
    
    const menuBtnChange = () => {
        if (sidebar.classList.contains("open")) {
            closeBtn.classList.replace("bx-menu", "bx-menu-alt-right");
        } else {
            closeBtn.classList.replace("bx-menu-alt-right", "bx-menu");
        }
    };

    closeBtn.addEventListener("click",() => {
        sidebar.classList.toggle("open");
        menuBtnChange(); // chama a função (opicional)
    });

    searchBtn.addEventListener("click", () => {
        //sidebar abre quando clica no icone de pesquisar
        sidebar.classList.toggle("open");
        menuBtnChange(); 
        // chamando a função opcional
    });
    
    // document.querySelector('#btn').addEventListener('click', () => {
    //     document.querySelector('#sidebar').classList.toggle('open');
    // });
    //Retirar o código comentado para funcionar normalmente.
}