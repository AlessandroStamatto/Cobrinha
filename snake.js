"use strict"
//codigos das teclas
var TECLA_ESQUERDA = 37, TECLA_CIMA = 38, TECLA_DIREITA = 39, TECLA_BAIXO = 40;

var Mapa = [
    [" ", " ", " ", " ", " ", " ", " ", " ", " ", " "]
    , [" ", " ", " ", " ", " ", " ", " ", " ", " ", " "]
    , [" ", " ", " ", " ", " ", " ", " ", " ", " ", " "]
    , [" ", " ", " ", " ", " ", " ", " ", " ", " ", " "]
    , [" ", " ", " ", " ", " ", " ", " ", " ", " ", " "]
    , [" ", " ", " ", " ", " ", " ", " ", " ", " ", " "]
    , [" ", " ", " ", " ", " ", " ", " ", " ", " ", " "]
    , [" ", " ", " ", " ", " ", " ", " ", " ", " ", " "]
    , [" ", " ", " ", " ", " ", " ", " ", " ", " ", " "]
    , [" ", " ", " ", " ", " ", " ", " ", " ", " ", " "]
];
//For arbitrary sizes it would be best to initialize the matrix with:
// var Mapa = [];
// for (var i = 0; i < 26; ++i) {
// 	Mapa[i] = []
// 	for (var j = 0; j < 26; ++j)
// 		Mapa[i][j] = " ";
// }


var nLinhas = Mapa.length;
var nColunas = Mapa[0].length;

var Cobra = {
    direcao: "direita",
    partes: []
};

function adicionar(pos) {
    Cobra.partes.unshift(pos);
    Mapa[pos.i][pos.j] = "cobra";
}

function remover() {
    var cauda = Cobra.partes.pop();
    Mapa[cauda.i][cauda.j] = " ";
}

//retorna um numero aleatorio entre 0 e o numero passado - 1 (ate)
function aleatorio(ate) {
    return Math.floor(Math.random() * ate);
}

function criarComida() {
    var posVazia = [];
    for (var i = 0; i < nLinhas; ++i) {
        for (var j = 0; j < nColunas; ++j) {
            if (Mapa[i][j] === " ") {
                posVazia.push({ i: i, j: j });
            }
        }
    }
    var posAleatoria = posVazia[aleatorio(posVazia.length)];
    Mapa[posAleatoria.i][posAleatoria.j] = "fruta";
}

//Objetos Globais
var Canvas, Ctx, tecla, frames, framesPerUpdate, pontuacao;

function init() {
    Canvas = document.createElement("canvas");
    Canvas.width = nColunas * 20;
    Canvas.height = nLinhas * 20;
    Ctx = Canvas.getContext("2d");
    document.body.appendChild(Canvas);

    tecla = 0;
    document.addEventListener("keydown", function (event) {
        tecla = event.keyCode;
    });
    document.addEventListener("keyup", function (event) {
        tecla = 0;
    });

    reset();
    gameLoop();
}

function reset() {
    Cobra.partes = [];

    for (var i = 0; i < nLinhas; ++i)
        for (var j = 0; j < nColunas; ++j)
            Mapa[i][j] = " ";

    var posCobra = {
        i: aleatorio(nLinhas),
        j: aleatorio(nColunas)
    };
    adicionar(posCobra);
    criarComida();

    frames = 0;
    framesPerUpdate = 5;
    pontuacao = 0;
}

function processInput() {
    if (tecla === TECLA_DIREITA) {
        Cobra.direcao = "direita";
    }
    else if (tecla === TECLA_ESQUERDA) {
        Cobra.direcao = "esquerda";
    }
    else if (tecla === TECLA_CIMA)
        Cobra.direcao = "cima";
    else if (tecla === TECLA_BAIXO)
        Cobra.direcao = "baixo";
}

function gameLoop() {
    processInput();
    update();
    draw();

    requestAnimationFrame(gameLoop, Canvas);
}

function update() {
    frames++;

    if (frames % framesPerUpdate === 0) {
        var novaPos = {
            i: Cobra.partes[0].i,
            j: Cobra.partes[0].j
        };

        if (Cobra.direcao === "direita") {
            ++novaPos.j;
            novaPos.j %= nColunas;
        } else if (Cobra.direcao === "esquerda") {
            --novaPos.j;
            if (novaPos.j < 0) novaPos.j = nColunas - 1;
        } else if (Cobra.direcao === "cima") {
            --novaPos.i;
            if (novaPos.i < 0) novaPos.i = nLinhas - 1;
        } else if (Cobra.direcao === "baixo") {
            ++novaPos.i;
            novaPos.i %= nLinhas;
        }

        if (Mapa[novaPos.i][novaPos.j] === "cobra") reset();

        if (Mapa[novaPos.i][novaPos.j] === "fruta") {
            ++pontuacao;
            criarComida();
        } else {
            remover();
        }

        adicionar(novaPos);
    }
}

function draw() {
    var tileWidth = Canvas.width / nColunas,
        tileHeight = Canvas.height / nLinhas;

    for (var i = 0; i < nLinhas; ++i) {
        for (var j = 0; j < nColunas; ++j) {
            if (Mapa[i][j] === " ")
                Ctx.fillStyle = "#fff";
            else if (Mapa[i][j] === "cobra")
                Ctx.fillStyle = "#0ff";
            else if (Mapa[i][j] === "fruta")
                Ctx.fillStyle = "#f00";

            Ctx.fillRect(j * tileWidth, i * tileHeight, tileWidth, tileHeight);
        }
    }

    Ctx.font = "18px Helvetica";
    Ctx.fillStyle = "#000";
    Ctx.fillText("PONTUACAO: " + pontuacao, 10, Canvas.height - 10);
}

window.addEventListener("load", init);
