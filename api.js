window.addEventListener('load', () => {
    const contenedor_loader = document.querySelector('.contenedor_loader')
    contenedor_loader.style.opacity = 0
    contenedor_loader.style.visibility = 'hidden'
})



function getFileData(e) {
    console.log('HTML Table: ', e);
    //alert("Please select a file");
}

function getTableData() {
    var input = document.getElementById("inputFile");
    readXlsxFile(input.files[0]).then(function (data) {
        var index = 0;
        // console.log(data);
        const indexEP = data.findIndex(numIndexEP => numIndexEP[1] === 'ENERGIA PORTEADA');
        // console.log(indexEP);
        var newData = []
        for (let x = indexEP; x < data.length; x++) {
            const element = data[x];
            newData.push(element)
            // console.log(element);          
        }
        newData.reverse();
        // console.log(newData);
        const indexEN = newData.findIndex(numIndexEN => numIndexEN[1] === 'ENERGIA NORMAL POR FALTANTE');
        // console.log(indexEN);
        var lastData = []
        for (let i = indexEN + 1; i < newData.length; i++) {
            const element = newData[i];
            // console.log(element); 
            lastData.push(element)
        }
        lastData.reverse()
        // console.log(lastData);


        /*Create Table HEAD*/
        data.map((row, index) => {
            /* Elimina del arreglo todos los valores igualados a null*/
            var newRow = row.filter(function (e) { return e !== null })
            // console.log(newRow);            
            //  console.log(newRow);

            if (index == 0) {
                row.map((elemnt) => {
                    if (elemnt !== null) {
                        var table = document.getElementById("tbl-data");
                        generateHeadTable(table, elemnt);
                    }
                });
            }
        });

        /*Create Table ROWS*/
        lastData.map((row, index) => {
            var newRow = row.filter(function (e) { return e !== null })
            // console.log(newRow);
            var onlyCol = [] // Arreglo para separar las columnas
            var finalData = [] //Arreglo para hacer push de cada columna agregada

            var sedeNum

            /*Selecciona solo los numero del nombre de la sede ----- DN_147080405686_Sanborns Hermanos, S.A = 147080405686 y los inserta al arreglo*/
            for (let k = 1; k < 2; k++) {
                const element = row[k];
                // console.log(element);
                sedeNum = element.split('_')
                // console.log(sedeNum[1]);
                onlyCol.push(sedeNum[1])
            }
            for (let x = 2; x <= 13; x++) {
                const element = row[x];
                onlyCol.push(element)
            }
            for (let i = 0; i < 4; i++) {
                const element = onlyCol[i];
                // console.log(element);
                finalData.push(element)
            }
            for (let e = 5; e < 9; e++) {
                const element = onlyCol[e];
                finalData.push(element)
            }

            let date = new Date();
            let output = String(date.getDate()).padStart(2, '0') + '/' + String(date.getMonth() + 1).padStart(2, '0') + '/' + date.getFullYear();
            var dateComp = output.split('/')

            for (let j = 12; j < 13; j++) { //Inserta al arreglo final la fecha
                const element = onlyCol[j];
                var fecha, division, mesprev, mes, anio, comparacion
                if (element !== null) {
                    fecha = new Date(element).toLocaleDateString()
                    division = fecha.split('/')
                    mesprev = division[0]
                    comparacion = parseInt(mesprev)
                    if (comparacion <= dateComp[1]) {
                        mes = division[0]
                    }
                    if (comparacion > dateComp[1]) {
                        {
                            mes = division[1]
                        }
                    }
                    anio = division[2]
                }
                finalData.push(mes)
                finalData.push(anio)
            }
            if (index > 0) {
                var table = document.getElementById("tbl-data");
                // console.log('rows: ', table.rows.length);
                sendTableRow(table, finalData);
            }
            index++;
        })
        setTimeout(() => {
            alert('Se ingresaron los registros')
            location.reload()
        }, 500);
        // setTimeout(function () { location.reload() }, 2000);
    });

}

function sendTableRow(table, data) {
    postSite(data);
    

}


async function postSite(data) {
    console.log('dataPost:', data);
    try {
        const response = await axios.post('https://global-hitss-app-backend-srv.cfapps.us10.hana.ondemand.com/temp-fact-ceg/TempFactCEG', {
            cl_rpu: data[0],
            anio_fac: data[9],
            mes_fac: data[8],
            cons_1p_CEG: data[3],
            cons_2p_CEG: data[2],
            cons_3p_CEG: data[1],
            cons_CEG: data[4],
            dem_1p_CEG: data[7],
            dem_2p_CEG: data[6],
            dem_3p_CEG: data[5],
        }
        );
        // alert(response.statusText + " " + response.status);
        //console.log(response);

    } catch (error) {
        console.error(error);
        alert(error.response.data.error);
    }
}

//getFileData();

