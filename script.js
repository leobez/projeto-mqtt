const BUTTON_gerar = document.querySelector(".gerar")

BUTTON_gerar.addEventListener("click", ()=>{
    
    // get data
    var server  = String(document.querySelector("#server").value)
    var port    = Number(document.querySelector("#port").value)
    var topic   = String(document.querySelector("#topic").value)

    const Cliente = {
        servidor: server,
        porta: port, 
        ID: "clienteid" + Math.floor(Math.random() * 10000)
    }

    var cliente = new Paho.MQTT.Client(Cliente.servidor, Cliente.porta, Cliente.ID)
    console.log("CLIENTE GERADO!")

    const DIV_extrainfo = document.querySelector(".extra-info")
    const P_cliente = document.createElement("p")
    P_cliente.innerText = `CLIENTE GERADO: ${Cliente.servidor} - ${Cliente.porta} - ${Cliente.ID} - ${topic}`
    DIV_extrainfo.append(P_cliente)

    const BUTTON_conectar = document.createElement("button")
    BUTTON_conectar.setAttribute("class", "conectar")
    BUTTON_conectar.innerText = "conectar"
    BUTTON_conectar.addEventListener("click", ()=> {
        console.log("Conectando...")
        cliente.connect({
            // Caso consiga:
            onSuccess:function(){
                console.log("Conectado!")
                cliente.subscribe(topic)

                // Altera a div de verificação de conexão para cor verde
                const DIV_ver = document.querySelector(".verificar")
                DIV_ver.style.backgroundColor = "green"    
                DIV_ver.innerText = `CONECTADO: ${Cliente.ID}`
                
                // Cria o elemento que receberá as informaçõe
                const DIV_caixa = document.createElement("div")
                DIV_caixa.setAttribute("class", "caixa")
                
                const P_titulocaixa = document.createElement("p")
                P_titulocaixa.setAttribute("class", "titulocaixa")
                P_titulocaixa.innerText = `Conteudo do topico: ${topic}`
        
                const DIV_caixacontent = document.createElement("div")
                DIV_caixacontent.setAttribute("class", "caixacontent")

                DIV_caixa.append(P_titulocaixa, DIV_caixacontent)

                const DIV_main = document.querySelector("main")
                DIV_main.append(DIV_caixa)
            }, 

            // Caso falhe:
            onFailure:function(responseObject){
                console.log("Falhou... " + responseObject.errorMessage)
            }
        })    
    })

    const BUTTON_desconectar = document.createElement("button")
    BUTTON_desconectar.setAttribute("class", "desconectar")
    BUTTON_desconectar.innerText = "desconectar"
    BUTTON_desconectar.addEventListener("click", ()=> {
        console.log("Desconectando...")
        // Remove os botoes de conectar e desconectar. Adiciona o botão de gerar cliente
        DIV_buttonarea.removeChild(BUTTON_conectar)
        DIV_buttonarea.removeChild(BUTTON_desconectar)
        DIV_buttonarea.append(BUTTON_gerar)
        DIV_extrainfo.innerHTML = ""
        cliente.disconnect()
        console.log("Desconectado!")
    })

    const DIV_buttonarea = document.querySelector(".button-area")
    DIV_buttonarea.removeChild(BUTTON_gerar)
    DIV_buttonarea.append(BUTTON_conectar, BUTTON_desconectar)

    // Chamado quando o cliente perde a conexão
    cliente.onConnectionLost = function(responseObject) {

        if (responseObject.errorCode !== 0) {
            console.log("onConnectionLost:"+ responseObject.errorMessage);   
        }

        // Altera a div de verificação de conexão para vermelho
        const DIV_ver = document.querySelector(".verificar")
        DIV_ver.style.backgroundColor = "red"    
        DIV_ver.innerText = "DESCONECTADO"

        // Remove a caixa que exibe as mensagens enviadas ao broker
        const DIV_main = document.querySelector("main")
        DIV_main.removeChild(DIV_main.lastChild)
    }

    // Chamado quando uma mensagem é recebida do tópico inscrito
    cliente.onMessageArrived = function(message) {
        console.log("onMessageArrived: " + message.payloadString);

        // Cria um paragrafo com a mensagem recebida e o insere na div de exibição
        const P_mensagem = document.createElement("p")
        P_mensagem.innerText = `Mensagem: ${message.payloadString}`
        const DIV_caixacontent = document.querySelector(".caixacontent")
        DIV_caixacontent.append(P_mensagem)
    }     


})
