<template>
  <q-page class="q-pa-md">
    <span class="text-h3">Usuario: Marco Cardenas</span>
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
            @click="alert = true"
          />
          <q-btn
            label="Facturar"
            color="primary"
            class="q-mx-xs"
            style="width: 250px"
            size="32px"
          />
        </div>
      </div>
    </div>

    <q-dialog v-model="alert" persistent>
      <q-card>
        <q-card-section>
          <div class="text-h6">Apertura de Caja</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-form @submit="onSubmit" @reset="onReset" class="q-gutter-md">
            <q-input
              v-model="name"
              label="Secuencia *"
              hint="Secuencia"
              lazy-rules
              :rules="[(val) => (val && val.length > 0) || 'Escribe algo']"
            >
              <template v-slot:after>
                <q-btn round dense flat icon="search" />
              </template>
            </q-input>

            <q-input
              type="text"
              v-model="fecha"
              label="Fecha y Hora *"
              readonly
              lazy-rules
              :rules="[
                (val) => (val !== null && val !== '') || 'Please type your age',
                (val) => (val > 0 && val < 100) || 'Please type a real age',
              ]"
            >
            </q-input>

            <q-input
              type="number"
              v-model="age"
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
              v-model="age"
              label="Ticket Promedio *"
              lazy-rules
              :rules="[
                (val) =>
                  (val !== null && val !== '') || 'Escribir una cantidad',
              ]"
            >
            </q-input>
          </q-form>
        </q-card-section>

        <q-card-actions align="around">
          <q-btn
            align="center"
            class="btn-fixed-width"
            color="secondary"
            v-close-popup
            label="Abrir"
            style="width: 150px"
          />
          <q-btn
            align="center"
            class="btn-fixed-width"
            color="primary"
            label="Limpiar"
            style="width: 150px"
          />
          <q-btn
            align="center"
            class="btn-fixed-width"
            color="negative"
            label="Cancelar"
            style="width: 150px"
          />
        </q-card-actions>
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
import { ref } from "vue";

export default {
  setup() {
    return {
      alert: ref(false),
      confirm: ref(false),
      prompt: ref(false),
      fecha: ref("2024-02-25 20:20:00"),

      address: ref(""),

      selectedDate: ref(""),
      selectedTime: ref(""),
      showDatePicker: ref(false),
      showTimePicker: ref(false),
    };
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
