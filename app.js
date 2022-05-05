new Vue({
    el: '#app',
    data: {
        saludJugador: 100,
        saludMonstruo: 100,
        hayUnaPartidaEnJuego: false,
        turnos: [], //es para registrar los eventos de la partida
        esJugador: false,
        rangoAtaque: [3, 10],
        rangoAtaqueEspecial: [10, 20],
        rangoAtaqueDelMonstruo: [5, 12],
    },

    methods: {
        getSalud(salud) {
            return `${salud}%`
        },
        
        empezarPartida: function () {
            this.hayUnaPartidaEnJuego = true;
            this.saludJugador = 100;
            this.saludMonstruo = 100;
            this.turnos = [];
        },

        atacar: function () {
            daño = this.calcularHeridas(this.rangoAtaque);
            this.saludMonstruo -= daño;
            this.registrarEvento({
                esJugador : true,
                text : 'el jugador golpea al monstruo por ' + daño + '%'
            })
            if(this.verificarGanador()){
                return;
            }
            this.ataqueDelMonstruo();
        },

        ataqueEspecial: function () {
            daño = this.calcularHeridas(this.rangoAtaqueEspecial);
            this.saludMonstruo -= daño;
            this.registrarEvento({
                esJugador : true,
                text : 'el jugador golpea al monstruo por ' + daño + '%'
            })
            if(this.verificarGanador()){
                return;
            }
            this.ataqueDelMonstruo();
        },

        curar: function () {
            if(this.saludJugador <= 90){
                this.saludJugador += 10;
                this.registrarEvento({
                    esJugador : true,
                    text : 'el jugador se curo por ' + 10 + '%'
                })
            } else{
                let vidaFaltante = 100 - this.saludJugador
                this.saludJugador = 100;
                if(vidaFaltante != 0){
                    this.registrarEvento({
                        esJugador : true,
                        text : 'el jugador se curo por ' + vidaFaltante + '%'
                    })
                }else{
                    this.registrarEvento({
                        esJugador : true,
                        text : 'el jugador ya tenia la vida al maximo'
                    })
                }
            }
            this.ataqueDelMonstruo();
        },

        registrarEvento(evento) {
            this.turnos.unshift(evento);
        },

        terminarPartida: function () {
            this.hayUnaPartidaEnJuego = false;
        },

        ataqueDelMonstruo: function () {
            daño = this.calcularHeridas(this.rangoAtaqueDelMonstruo);
            this.saludJugador -= daño;
            this.registrarEvento({
                esJugador : false,
                text : 'el monstruo golpea al jugador por ' + daño + '%'
            })
            this.verificarGanador();
        },

        calcularHeridas: function (rango) {
            let min = rango[0];
            let max = rango[1];
            return Math.max(Math.floor(Math.random() * max) + 1, min);

        },
        verificarGanador: function () {
            if(this.saludMonstruo <= 0){
                if(confirm("Ganaste! Jugar de nuevo")){
                    this.empezarPartida();
                } else{
                    this.hayUnaPartidaEnJuego = false;
                }
                return true;
            } else if (this.saludJugador <= 0){
                if(confirm("Perdiste! Jugar de nuevo")){
                    this.empezarPartida();
                } else{
                    this.hayUnaPartidaEnJuego = false;
                }
                return true;
            }
            return false;
        },
        cssEvento(turno) {
            //Este return de un objeto es prque vue asi lo requiere, pero ponerlo acá queda mucho mas entendible en el codigo HTML.
            return {
                'player-turno': turno.esJugador,
                'monster-turno': !turno.esJugador
            }
        }
    }
});