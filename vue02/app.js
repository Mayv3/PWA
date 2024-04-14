const app = Vue.createApp({
    data() {
      return {
        titulo: 'Agrega una tarea a la lista',
        titulo2: 'Cantidad de tareas',

        tarea: '',
        cantidad: 0,
        tareas: [{fecha: '12/04/20', descripcion: 'Leer un libro', favorito: false, completado: false},
                {fecha: '22/05/22', descripcion: 'Ir al Gimnasio', favorito: false, completado: false}],
      }
    },
    methods :{
        agregarFav(index){
            this.tareas[index].favorito=true;
        },
        sacarFav(index){
            this.tareas[index].favorito=false;
        },
        eliminar(index){
            this.tareas.splice(index, 1)
        },
        completar(index){
            console.log('Estado de tarea: ', this.tareas[index].completado)
            this.tareas[index].completado= true;
            console.log('Estado de tarea: ', this.tareas[index].completado)
        },
        agregar(){
            if (this.tarea.trim() !== '') { // Verificar si el campo de tarea no está vacío
                const date = new Date().toLocaleDateString();
                this.tareas.push({
                    fecha: date,
                    descripcion: this.tarea,
                    completado: false
                });
                this.tarea='';
            }
        }
    }
  })

app.mount('#app')