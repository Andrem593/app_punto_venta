<template>
  <q-page class="q-pa-md">
    <span class="text-h3"></span>
    <q-separator spaced />
    <div class="row justify-center">
      <div class="col-md-12">
        <div class="text-center">
          <q-img
            src="https://contifico.com/wp-content/uploads/2020/06/isotipo-contifico-1.png"
            style="width: 350px; margin-bottom: 80px"
          />
        </div>
      </div>

      <div class="col-12">
        <div class="row justify-center">
          <q-btn
            label="Abrir"
            color="primary"
            class="q-mx-xs"
            size="32px"
            style="width: 250px"
            @click="showModal"
          />
          <q-btn
            label="Facturar"
            @click="goToFacturar"
            color="primary"
            class="q-mx-xs"
            style="width: 250px"
            size="32px"
          />
        </div>
      </div>
    </div>

    <q-dialog v-model="cajaModal" persistent>
      <q-card>
        <q-form @submit="saveData" @reset="onReset" class="q-gutter-md">
          <q-card-section>
            <div class="text-h6">Apertura de Caja</div>
          </q-card-section>

          <q-card-section class="q-pt-none">
            <q-input
              v-model="form.secuencia"
              type="number"
              label="Secuencia *"
              hint="Secuencia"
              lazy-rules
              :rules="[(val) => (val && val > 0) || 'Escribe algo']"
            >
              <template v-slot:after>
                <q-btn round dense flat icon="search" />
              </template>
            </q-input>

            <q-input
              type="text"
              v-model="fechaTotal"
              label="Fecha y Hora *"
              readonly
              lazy-rules
            >
            </q-input>

            <q-input
              type="number"
              v-model="form.monto_inicial"
              label="Monto Inicial *"
              lazy-rules
              :rules="[
                (val) =>
                  (val !== null && val !== '') || 'Escribir una cantidad',
              ]"
            >
            </q-input>

            <q-input
              type="number"
              v-model="form.ticket_promedio"
              label="Ticket Promedio *"
              lazy-rules
              :rules="[
                (val) =>
                  (val !== null && val > 0) ||
                  'Escribir una cantidad mayor a cero',
              ]"
            >
            </q-input>
          </q-card-section>

          <q-card-actions align="around">
            <q-btn
              align="center"
              class="btn-fixed-width"
              color="secondary"
              type="submit"
              label="Abrir"
              style="width: 150px"
            />
            <q-btn
              @click="clearData"
              align="center"
              class="btn-fixed-width"
              color="primary"
              label="Limpiar"
              type="reset"
              style="width: 150px"
            />
            <q-btn
              align="center"
              class="btn-fixed-width"
              color="negative"
              label="Cancelar"
              v-close-popup
              style="width: 150px"
            />
          </q-card-actions>
        </q-form>
      </q-card>
    </q-dialog>
    <!-- <div class="q-pa-md q-gutter-sm full-height">
      <div class="flex-grow-1">
      </div>
      <div class="row justify-end">
        <q-btn label="Abrir" color="primary" />
        <q-btn label="Facturar" color="primary" class="q-ml-sm" />
      </div>
    </div> -->
  </q-page>
</template>

<script>
export default {
  name: "indexPage",
  data() {
    return {
      form: {
        id: "",
        secuencia: 1,
        fecha: "",
        hora: "",
        monto_inicial: 1,
        ticket_promedio: 0,
      },
      cajaModal: false,
    };
  },
  computed: {
    fechaTotal() {
      let self = this;
      // let now = new Date();
      // return now.toLocaleString();
      return `${self.form.fecha}   ${self.form.hora}`;
    },
  },
  methods: {
    showModal() {
      let self = this;
      let now = new Date();
      let fecha = now.toISOString().split("T")[0]; // Formato YYYY-MM-DD
      let hora = now.toTimeString().split(" ")[0]; // Formato HH:MM:SS
      self.form.fecha = fecha;
      self.form.hora = hora;
      self.cajaModal = true;
    },
    saveData() {
      let self = this;
      console.log(self.form, "Guraddo");
      self.cajaModal = false;
      self.triggerPositive("Guardado Correctamente");
    },
    clearData() {
      let self = this;
      let now = new Date();
      let fecha = now.toISOString().split("T")[0]; // Formato YYYY-MM-DD
      let hora = now.toTimeString().split(" ")[0]; // Formato HH:MM:SS

      self.form.monto_inicial = 1;
      self.form.ticket_promedio = 0;
      self.form.fecha = fecha;
      self.form.hora = hora;
    },
    triggerPositive(message) {
      this.$q.notify({
        type: "positive",
        message: message,
      });
    },
    triggerNegative(message) {
      this.$q.notify({
        type: "negative",
        message: message,
      });
    },
    goToFacturar() {
      let self = this;
      self.$router.push({ path: "/principal/facturar" });
    },
  },
};
</script>

<style scoped>
.full-height {
  height: 100vh;
}
/* .same-width {
  width: 250px;
} */
</style>
