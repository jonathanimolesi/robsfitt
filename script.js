// Script para funcionalidade do site Robs Fit

document.addEventListener('DOMContentLoaded', function() {
    // Variáveis para controle do pedido
    let pedidoAtual = [];
    const botaoEnviar = document.querySelector('.send-button');
    const botoesAdicionar = document.querySelectorAll('.add-button');
    
    // Adicionar evento de clique aos botões de adicionar
    botoesAdicionar.forEach(botao => {
        botao.addEventListener('click', function() {
            const itemMenu = this.closest('.menu-item');
            const nomeItem = itemMenu.querySelector('h4').textContent;
            const precoItem = itemMenu.querySelector('.price').textContent;
            
            // Adicionar item ao pedido
            pedidoAtual.push({
                nome: nomeItem,
                preco: precoItem
            });
            
            // Atualizar botão de enviar
            atualizarBotaoEnviar();
            
            // Feedback visual
            this.classList.add('added');
            setTimeout(() => {
                this.classList.remove('added');
            }, 300);
        });
    });
    
    // Função para atualizar o botão de enviar
    function atualizarBotaoEnviar() {
        if (pedidoAtual.length > 0) {
            botaoEnviar.classList.add('active');
            botaoEnviar.disabled = false;
        } else {
            botaoEnviar.classList.remove('active');
            botaoEnviar.disabled = true;
        }
    }
    
    // Evento de clique no botão enviar
    botaoEnviar.addEventListener('click', function() {
        if (pedidoAtual.length === 0) return;
        
        // Preparar mensagem para WhatsApp
        let mensagem = "Olá! Gostaria de fazer um pedido:\n\n";
        
        pedidoAtual.forEach((item, index) => {
            mensagem += `${index + 1}. ${item.nome} - ${item.preco}\n`;
        });
        
        // Codificar a mensagem para URL
        const mensagemCodificada = encodeURIComponent(mensagem);
        
        // Abrir WhatsApp com a mensagem
        window.open(`https://wa.me/+5531999999999?text=${mensagemCodificada}`, '_blank');
    });
    
    // Funcionalidade de pesquisa
    const campoPesquisa = document.querySelector('.search-bar input');
    const itensMenu = document.querySelectorAll('.menu-item');
    
    campoPesquisa.addEventListener('input', function() {
        const termoPesquisa = this.value.toLowerCase();
        
        itensMenu.forEach(item => {
            const nomeItem = item.querySelector('h4').textContent.toLowerCase();
            
            if (nomeItem.includes(termoPesquisa)) {
                item.style.display = 'flex';
            } else {
                item.style.display = 'none';
            }
        });
        
        // Mostrar/ocultar categorias vazias
        document.querySelectorAll('.category').forEach(categoria => {
            const itensVisiveis = Array.from(categoria.querySelectorAll('.menu-item')).filter(item => item.style.display !== 'none').length;
            
            if (itensVisiveis === 0) {
                categoria.style.display = 'none';
            } else {
                categoria.style.display = 'block';
            }
        });
    });
});
