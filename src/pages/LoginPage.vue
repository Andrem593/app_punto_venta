<template>
  <q-page class="flex flex-center">
    <q-card class="q-pa-md q-gutter-md" style="width: 400px; padding: 20px">
      <div class="text-center">
        <q-img
          src="https://cdn.quasar.dev/logo-v2/svg/logo.svg"
          style="width: 150px; margin-bottom: 20px"
        />
      </div>
      <div class="q-pa-md">
        <div class="q-gutter-y-md column" style="max-width: 400px">
          <q-input
            v-model="ph"
            label="Correo"
            placeholder="Ingrese Correo"
            :dense="dense"
          >
            <template v-slot:prepend>
              <q-icon name="person" />
            </template>
          </q-input>
          <q-input
            v-model="ph"
            label="Contraseña"
            placeholder="Ingrese Contraseña"
            :dense="dense"
            class="q-mb-md"
          >
            <template v-slot:prepend>
              <q-icon name="lock" />
            </template>
          </q-input>
          <q-btn
            @click="fetchUsers"
            type="button"
            label="Ingresar"
            color="primary"
            class="full-width"
          />
        </div>
      </div>
    </q-card>
  </q-page>
</template>
<script>
import { ref } from "vue";

export default {
  setup() {
    return {
      text: ref(""),
      ph: ref(""),
      dense: ref(false),
    };
  },
};
</script>
